var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    _id: String,
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
                    id: String,
                    timestamp: Date,
                    account_hashes: Number,
                    hashes: Number,
                    amount: Number,
                    action: String
                }
            ]
        }
    ],
    transactions: [
        {
            id: String,
            timestamp: Date,
            hashes: Number,
            fee: Number,
            amount: Number,
            action: String
        }
    ]
});

exports = mongoose.model('Server', accountSchema, 'server');