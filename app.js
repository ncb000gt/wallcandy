var express = require('express'),
    mongoDB = require('mongodb').Db,
    mongoServer = require('mongodb').Server,
    sessionServerConfig = new mongoServer('localhost', 27017, {auto_reconnect: true})
    mongodb = new mongoDB('wallcandy', sessionServerConfig, {}),
    mongostore = require('connect-mongodb');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    cookie: {maxAge: 60000 * 20},
    secret: "say WUUUUT?!?",
    store: new mongostore({db: mongodb})
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/****************************************/
mongodb.open(function(err, db) {
  app.get('/type/:type', function(req, res) {
    var type = req.params.type;
    db.collection('types', function(err, col) {
      col.findOne({name:type}, function(err, type) {
        res.json(type);
      });
    });
  });

  app.get('/data/:type/data/:vfield', function(req, res) {
    var type = req.params.type;
    var vfield = req.params.vfield;
    db.collection(type, function(err, col) {
      col.find({}, {sort: 'created'}, function(err, cursor) {
        cursor.toArray(function(err, rows) {

          var max_  = (function max(data, idx, _max) {
            if (data.length === idx) return _max;
            var row = data[idx];
            if (_max < row[vfield]) _max = row.avg;
            return max(data, ++idx, _max);
          })(rows, 0, 0);

          var data = {
            total: rows.length,
            max: max_,
            plots: rows.map(function(row) {
              return {
                truevalue: row[vfield],
                value: (row[vfield]/max_)*100,
                time: row.created
              }
            })
          };
          res.json(data);
        });
      });
    });
  });

  app.get('/data/:type', function(req, res) {
    var type = req.params.type;

    db.collection('types', function(err, col) {
      col.findOne({name: type}, {}, function(err, type) {
        res.render('type', {
          type: type,
          scripts: [
            'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
            'http://d3js.org/d3.v2.js',
            '/js/line.js',
            '/js/load.js'
          ],
          styles: [
            '/css/line.css'
          ]
        });
      });
    });
  });
  
  app.post('/data/:type', function(req, res) {
    var type = req.params.type;
    var doc = req.body;
    if (!(doc.created)) doc.created = new Date().getTime();
    db.collection('types', function(err, col) {
      col.update({name: doc.name}, doc, {upsert: true, safe: true}, function(err) {
        res.send(201);
      });
    });
  });

  app.put('/data/:type', function(req, res) {
    var type = req.params.type;
    var doc = req.body;
    if (!(doc.created)) doc.created = new Date().getTime();
    db.collection(type, function(err, col) {
      col.save(doc, {safe: true}, function(err) {
        res.send(201);
      });
    });
  });

  app.get('/', function(req, res) {
    db.collection('types', function(err, col) {
      col.find({}, {sort: 'created'}, function(err, cursor) {
        cursor.toArray(function(err, rows) {
          res.json(rows);
        });
      });
    });
  });
});
/****************************************/

app.error(function(err, req, res, next) {
  next(err);
});

app.listen(process.env.NODE_PORT || (process.env.NODE_ENV === 'production' ? 80 : 8003));

console.log('Server listening on ' + app.address().port);

process.on("exit", function() {
  console.log("Shutdown Server.");
});

process.on("SIGINT", function() {
  console.log("Server interupted.");
  process.exit(0);
});
