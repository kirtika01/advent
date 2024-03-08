const FinTeam = require('../../../models/FinanceMgmt/FinTeam')

exports.getFinTeamByCountryCode = async (req, res) => {

	try{

		let finTeam = await FinTeam.findOne({countryCode:req.params.countryCode})

		if(finTeam){

			return res.status(200).json({
				message:"FinTeam Found",
				finTeam:finTeam
			})

		}
		else{

			throw Error("FinTeam for country : "+req.params.countryCode+" Not Found")

		}
	}
	catch(err){
		console.log(err)
		res.status(500).json({
			error:err
		})
	}
}