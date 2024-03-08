const Squad = require('../../../models/HRMgmt/Squad');
const Employee = require('../../../models/HRMgmt/Employee');

exports.deleteSquadBySquadCode  = async (req, res) => {
	try {
        let squad = await Squad.findOne({squadCode: req.body.squadCode});

        if(!squad){
            throw new Error("No Squad Found for squadCode-- "+req.body.squadCode)
        }

        let members = await Employee.find({squadCode:req.body.squadCode});

        if(members.length >0){
            throw new Error("Can not delete the squad if members are present")
        }

        let doc = await Squad.findOneAndDelete({squadCode: req.body.squadCode})

        if(!doc){
            throw new error(`Cannot delete squad with squadCode - ${req.body.squadCode}`)
        }
        
        return res.status(200).json({
            status:true,
            message:`Squad with squadCode - ${req.body.squadCode} deleted successfully`
        })

    }
	catch (err) {
		console.log(err)
		res.status(500).json({
			status: false,
			message: err.message
		})

	}

}