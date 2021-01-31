var request = require('request');

for (i = 0; i<100; i++){
        var idStr = i.toString();
        request.post(
                'http://localhost:5000/id',
                { json: { id: idStr } },
                function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                                console.log(body);
                        }
                        else {
                                console.log("Something went wrong. StatusCode = "+response.statusCode);
                        }
                }
        );
}


