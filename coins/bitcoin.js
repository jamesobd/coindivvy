var bitcoin = require('bitcoin');

// Create client instance
var client = new bitcoin.Client({
    host: 'localhost',
    port: 8332,
    user: '0MNdueMvHGoZs1zNqHLvYMKFm3dB2zC5ATa',
    pass: '7m9FoCAg11w4KV4YZYMKxscEf9wLSPjUL2NuSNeGK5zx'
});

module.exports.client = client;
module.exports.minBalance = .1;
module.exports.minAccountFee = .0001;
module.exports.transactionFee = .0001; // TODO: Get this value from bitcoind
module.exports.passphrase = '5DcQ15hHEjS9diQ6mpnPRVQqmIGZ5';