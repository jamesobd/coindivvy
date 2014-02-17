var https = require('https');

// Get the USD value of bitcoin
module.exports.usd = function (callback) {
    var request = https.request(
        {host: 'www.bitstamp.net', path: '/api/ticker/'},
        function (response) {
            var body = ""
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function () {
                var responseObject = JSON.parse(body);
                if (callback != undefined) {
                    callback(responseObject.last);
                }
            });
        }
    );
    request.on('error', function (e) {
        console.log('Problem with request: ' + e.message);
    });
    request.end();
}

