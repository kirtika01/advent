const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feeStructureSchema = new Schema({


}, {
    timestamps: true
})



const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema)
module.exports = FeeStructure