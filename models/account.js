var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    key : {
        name: String,  // Name of the server (cointraction)
        owner: String // "delmonger"
    },
    address: String, // Whatever address we generate for the bitcoin account
    coin_type: String, // "bitcoin"
    fee_period: Number,
    fee_per_hash: Number,
    addresses: [
        {
            address: String, // Out address (is unique)
            hashes: Number, // 177000000000
            notes: String, // "YOLANDA MARIA AGOSTINI"
            transactions: [
                {
                    id: Number, // The transaction number from the cryptocurrency transaction system
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

module.exports = mongoose.model('Account', accountSchema);