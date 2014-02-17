var mongoose = require('mongoose');


var accountSchema = new mongoose.Schema({
    name: String,  // Name of the server (cointraction)
    owner: String, // "delmonger"
    address: String, // Whatever address we generate for the bitcoin account
    owner_address: String, // The address to send account fees to
    coin_type: String, // "bitcoin"
    unit_name: { type: String, default: "KHashes" },
    fee_period: { type: Number, default: 30 },
    fee_per_unit: Number,
    addresses: [
        {
            address: String, // Out address (is unique)
            units: Number, // 177000000000
            notes: String // "YOLANDA MARIA AGOSTINI"
        }
    ],
    transactions: [
        {
            id: Number, // The transaction number from the cryptocurrency transaction system
            timestamp: { type: Date, default: Date.now }, // new Date
            transaction_period: Number, // In days
            owner_address: String,
            total_units: Number,
            amounts: {}
        }
    ]
});

module.exports = mongoose.model('Account', accountSchema);