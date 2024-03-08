const mongoose = require('mongoose')
const Schema = mongoose.Schema

const geoSchema = new Schema({

	geoCode: String,
	geoName: String,

	geoDescription: String,

	countries: [{
			
		countryCode:String,
		countryName:String
		
	}],
}, {
	timestamps: true
})

module.exports = mongoose.model('Geo', geoSchema)

