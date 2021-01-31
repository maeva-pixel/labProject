// worker
const zmq = require("zeromq");
sockREP1 = zmq.socket("rep");
sockREP2 = zmq.socket("rep");

sockREP1.bind(process.env.ADRESS_WORKER);
sockREP2.bind(process.env.ADRESS_WORKER2);

console.log("worker connected to ports "
	+ process.env.ADRESS_WORKER
	+" and "
	+process.env.ADRESS_WORKER2);

sockREP1.on("message", (q, nwork, id)=> {
	// work = echo
	 console.log("worker "
		 +nwork.toString()
		 +" : work done on "
		 +id.toString());
	sockREP1.send([q, 1, id, 'worker 1 : done with '.concat(id)]);
});

sockREP2.on("message", (q, nwork, id)=> {
        // work = echo
         console.log("worker "
                 +nwork.toString()
                 +" : work done on "
                 +id.toString());
        sockREP2.send([q, 2, id, 'worker 2 : done with '.concat(id)]);
});

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
