var express = require('express');
var path = require('path');
var bodypareser = require('body-parser')
var fs = require('fs');
var morgan = require('morgan');
var cluster = require('cluster');
var cors = require('cors');

var app = express();

app.use(bodypareser.urlencoded({limit:'5mb',extended:true}));
app.use(bodypareser.json({limit:'5mb'}));
	
app.use(express.static(path.join(__dirname,'app')));
 
app.use(cors())
	if(cluster.isMaster) {
		var numWorkers = require('os').cpus().length;
		console.log('Master cluster setting up ' + numWorkers + ' workers...');

		for(var i = 0; i < numWorkers; i++) {
			cluster.fork();
		}

		cluster.on('online', function(worker) {
			console.log('Worker ' + worker.process.pid + ' is online');
		});
		
		

		cluster.on('exit', function(worker, code, signal) {
			console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
			console.log('Starting a new worker');
			cluster.fork();
		});
		
		
	} 
	else {
		
		//app.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})
		
		var server = app.listen(8900,function(){
			 console.log('server start on '+ server.address().port+ ' port, Process ' + process.pid + ' is listening to all incoming requests');
			
		});
	}



