const express = require('express');
const zmq = require('zeromq');
const assert = require('assert');
const service = express();
const FRONTEND_PORT = 8000;
const bodyParser = require('body-parser');

//set the headers
service.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        req.headers['content-type'] = 'application/json';
        res.setHeader("Content-Type", "application/json");
        next();
});
service.use(bodyParser.urlencoded({extended : false}));
service.use(bodyParser.json());

//root
service.get('/', (req, res) => {
	if (res.statusCode == 200){
		res.send('Welcome to the SAD project, send a message with your id as a JSON');
	}
	else res.send("Something is wrong");
});

//post request
service.post('/id', (req, res, next) => {
	const mess =JSON.stringify(req.body); 
	if (res.statusCode != 200) res.send('Something went wrong');
	else {
		res.send(mess.toString()+" received!");
		zmqReq(mess);
	}
});

//req socket to handle the messages
const zmqReq = function(message){
	const s = zmq.socket('req');
	const n = Math.floor((Math.random() * 3)+1); //random queue 
	switch(n){
		case 1 : s.connect(process.env.ADRESS_FRONTEND1);
			break;
		case 2 : s.connect(process.env.ADRESS_FRONTEND2);
			break;
		default : s.connect(process.env.ADRESS_FRONTEND3);
			break;
	}
	s.send(message);
	s.on('message', (m) => {
		s.send("worker done");
		console.log(m.toString());
	});
}

service.set('port', process.env.PORT || FRONTEND_PORT);
service.listen(process.env.PORT || FRONTEND_PORT, () => {
	console.log("Listen to the port n: "+FRONTEND_PORT);});

