var bitcoin = require('bitcoin');

// Create client instance
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: '',
    pass: ''
});

module.exports.client = client;
module.exports.minBalance = .1;
module.exports.minAccountFee = .0001;
module.exports.transactionFee = .0001; // TODO: Get this value from bitcoind
module.exports.passphrase = '';