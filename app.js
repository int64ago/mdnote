var fs = require('fs');
var join = require('path').join;
var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var request = require("request");
var app = express();
var index = express.Router();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

require('app-module-path').addPath(__dirname + '/controllers');

var connect = function() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mdnote', options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);


fs.readdirSync(join(__dirname, 'models')).forEach(function(file) {
    if (~file.indexOf('.js')) require(join(__dirname, 'models', file));
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/new', function(req, res) {
    var Note = mongoose.model('Note');
    Note.newNote(function(err, result) {
        if (result) {
            res.send('/' + result._id);
        } else {
            res.send('https://github.com/int64ago/mdnote');
        }
    });
});

app.get('/404', function(req, res) {
    res.render('404');
});

app.get('/:id', function(req, res) {
    res.render('note');
});

app.use('/static', express.static(__dirname + '/static'));

index.use('/note', require('note'));
app.use('/api', index);

app.listen(process.env.VCAP_APP_PORT || 3000);
