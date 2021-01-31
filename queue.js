const zmq = require('zeromq');
const QUEUE_PORT1 = '8001';
const QUEUE_PORT2 = '8002';
const QUEUE_PORT3 = '8003';
const s11 = zmq.socket('rep');
const s12 = zmq.socket('rep');
const s13 = zmq.socket('rep');
const s21 = zmq.socket('req');
const s22 = zmq.socket('req');
s11.bind("tcp://*:".concat(QUEUE_PORT1));
s12.bind("tcp://*:".concat(QUEUE_PORT2));
s13.bind("tcp://*:".concat(QUEUE_PORT3));

s21.connect(process.env.ADRESS_QUEUE4);
s22.connect(process.env.ADRESS_QUEUE5);
console.log("Queues connected ");

var ids = [], workers = [1,2];
var queue = function(q, id){
	if (id.toString() != "worker done"){
		ids.push(id);
        	console.log(id
			+" received and the list of ids to elaborate is ["
			+ids.toString()
			+"]; "
			+workers.length
			+" workers avaible(s)");
        	var mess = ("queue "+q+"  : <<message "
			.concat(id.toString()))
			.concat(" in the queue >>");
      		switch(q){
			case 1 : s11.send(mess);
				break;
			case 2 : s12.send(mess);
				break;
			default :  s13.send(mess);
				break;
		}
	}
       	if (workers.length > 0 && ids.length > 0) {
               	//workers.shift();
		if (workers[0] == 1) s21.send([q,workers.shift(), ids.shift()]);
		else s22.send([q, workers.shift(), ids.shift()]);
	}

}

s11.on('message', (id) => {
	queue(1, id);	
});

s12.on('message', (id) => {
       queue(2, id);
});

s13.on('message', (id) => {
	queue(3, id);
});

s21.on('message', (q, w, id, mess) => {
	console.log(mess.toString());
       	workers.push(w);
	switch(q.toString()){
		case "1" : s11.send('Request with id : '+id+" is been elaborated");
			break;
		case "2" : s12.send('Request with id : '+id+" is been elaborated");
			break;
		default : s13.send('Request with id : '+id+" is been elaborated");
			break;
	}
});

s22.on('message', (q, w, id, mess) => {
        console.log(mess.toString());
        workers.push(w);
        switch(q.toString()){
                case "1" : s11.send('Request with id : '+id+" is been elaborated");
                        break;
                case "2" : s12.send('Request with id : '+id+" is been elaborated");
                        break;
                default : s13.send('Request with id : '+id+" is been elaborated");
                        break;
        }
});

