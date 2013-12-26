var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    name: String,
    address: String,
    owner: String,
    coin_type: String,
    addresses: [
        {
            address: String,
            name: String,
            hashes: Number,
            transactions: [
                {
                    id: Number,
                    timestamp: Date,
                    hashes: Number,
                    hashes_total: Number,
                    amount: Number,
                    amount_total: Number,
                    usd_btc: Number,
                    fee_period: Number,
                    fee_per_hash: Number
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Account', accountSchema, 'account');