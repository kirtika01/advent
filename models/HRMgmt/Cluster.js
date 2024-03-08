const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');

const clusterSchema = new Schema({

    clusterId: {
        type: String
    },//BRNCH-counter

    clusterName: {
        type: String
    },

    


}, {
    timestamps: true
}
)

module.exports = mongoose.model('Cluster', clusterSchema)