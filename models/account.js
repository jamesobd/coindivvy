var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    _id: String, // The transaction number from the cryptocurrency transaction system (is unique)
    amounts: {},
    fee_address: String,
    timestamp: { type: Date, default: Date.now },
    total_units: Number
});

var addressSchema = new mongoose.Schema({
    _id: String, // Out address (is unique)
    notes: String, // "YOLANDA MARIA AGOSTINI"
    units: Number // 177000000000
});

var accountSchema = new mongoose.Schema({
    _id: String,  // Name of the account (is unique)
    address: String, // Whatever address we generate for the bitcoin account
    addresses: [addressSchema],
    coin_type: String, // "bitcoin"
    fee_address: String, // The address to send account fees to
    fee_per_unit: Number,
    fee_period: { type: Number, default: 30 },
    last_transaction_date: Date, // Updated from last transaction date or manually updated on interface
    owner: String, // "delmonger"
    transactions: [transactionSchema],
    unit_name: String
});

module.exports = mongoose.model('Account', accountSchema);