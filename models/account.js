var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    name: String,  // Name of the server (cointraction)
    address: String, // Whatever address we generate for the bitcoin account
    owner: String, // "delmonger"
    coin_type: String, // "bitcoin"
    addresses: [
        {
            address: String, // Out address (can have multiples in here, non-unique)
            name: String, // "YOLANDA MARIA AGOSTINI"
            hashes: Number, // 177000000000
            transactions: [
                {
                    id: Number, // Incremented transaction number.  The last transaction # is stored somewhere else... wherever that is
                    timestamp: { type: Date, default: Date.now }, // new Date
                    hashes: Number, // 177000000000
                    hashes_total: Number, // 2000000000000 (the summation of all address hashes for this account at the time of transaction
                    amount_total: Number, // This is the amount
                    usd_btc: Number,
                    fee_period: Number,
                    fee_per_hash: Number
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Account', accountSchema, 'account');