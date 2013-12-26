var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    name: String,
    address: String,
    owner: String,
    coin_type: String,
    hashes: Number,
    addresses: [
        {
            id: String,
            hashes: Number,
            transactions: [
                {
                    id: Number,
                    timestamp: Date,
                    hashes: Number,
                    hashes_total: Number,
                    amount: Number,
                    amount_total: Number,
                    fee: Number,
                    action: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Account', accountSchema, 'account');