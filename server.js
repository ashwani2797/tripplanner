var express    = require('express');
var app        = express();
var port       = process.env.PORT || 8085 ;
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');
var passport   = require('passport');
var social     = require('./app/passport/passport')(app,passport);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ashwani:abcd1234@olympia.modulusmongo.net:27017/duS6exiq',function(err){
	if(err){
		console.log('Not connected to database' + err);
	} else {
		console.log('Successfully connected to database');
	}
});

app.get('*',function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


app.listen( port, function(){
	console.log('Running on server on port'+ port );
});
