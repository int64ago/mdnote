var fs = require('fs');
var join = require('path').join;
var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var request = require("request");
var app = express();
var index = express.Router();

app.set('view engine', 'ejs');

require('app-module-path').addPath(__dirname + '/controllers');

var connect = function() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    // Bluemix && Mongolab
    if (process.env.VCAP_SERVICES) {
        var credentials = JSON.parse(process.env.VCAP_SERVICES)['user-provided'][0].credentials;
        var dbuser = credentials.user,
            dbpassword = credentials.password,
            host = credentials.uri,
            port = credentials.port;
        var mongdbUrl = 'mongodb://' + dbuser + ':' + dbpassword + '@' + host + ':' + port + '/mdnote';
        mongoose.connect(mongdbUrl, options);
    } else {
        mongoose.connect('mongodb://localhost/mdnote', options);
    }

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
    var UACheckUrl = 'http://www.useragentstring.com/?getJSON=agent_type&uas=';
    request(UACheckUrl + req.headers['user-agent'], function(error, response, body) {
        var agentType = JSON.parse(body)['agent_type'];
        if (agentType === 'Crawler' || agentType === 'Offline Browser') {
            res.render('index');
        } else {
            var Note = mongoose.model('Note');
            Note.newNote(function(err, result) {
                if (result) {
                    res.redirect('/' + result._id);
                } else {
                    res.redirect('https://github.com/int64ago/mdnote');
                }
            });
        }
    });
});

app.get('/404', function(req, res) {
    res.render('404');
});

app.get('/:id', function(req, res) {
    res.render('index');
});

app.use('/static', express.static(__dirname + '/static'));

index.use('/note', require('note'));
app.use('/api', index);

app.listen(process.env.VCAP_APP_PORT || 3000);
