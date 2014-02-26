var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    _id: String, // The transaction number from the cryptocurrency transaction system
    timestamp: { type: Date, default: Date.now },
    owner_address: String,
    total_units: Number,
    amounts: {}
});

var addressSchema = new mongoose.Schema({
    address: String, // Out address (is unique)
    units: Number, // 177000000000
    notes: String // "YOLANDA MARIA AGOSTINI"
});

var accountSchema = new mongoose.Schema({
    name: String,  // Name of the server
    owner: String, // "delmonger"
    address: String, // Whatever address we generate for the bitcoin account
    owner_address: String, // The address to send account fees to
    coin_type: String, // "bitcoin"
    unit_name: { type: String, default: "KHashes" },
    last_transaction_date: Date, // Updated from last transaction date or manually updated on interface
    fee_period: { type: Number, default: 30 },
    fee_per_unit: Number,
    addresses: [addressSchema],
    transactions: [transactionSchema]
});

module.exports = mongoose.model('Account', accountSchema);