const Country= require("../../../models/HRMgmt/Country");
const Employee= require("../../../models/HRMgmt/Employee");

exports.createCountry = async (req, res) => {
try{

    
	let countryCheck = await Country.findOne({countryCode:req.body.countryCode})
	if(countryCheck){
		throw new Error("Country Code already exists")
	}
	
    let newCountry=new Country(req.body)
    
	let countryHead = await Employee.findOne({employeeId:req.body.countryHeadEmpId})

	if(!countryHead){
		throw new Error("Country Head Employee Id not found")
	}
	newCountry.countryHead=countryHead
	newCountry.countryHeadName = countryHead.employeeFullName
    await newCountry.save()

    if(newCountry){

        return res.status(200).json({
            status:true,
            message:`New Country -  ${newCountry.countryCode} created successfully`,
            country:newCountry
        })

    }
    else{
        return res.status(200).json({
            status:false,
            message:`Branch Creation Un-Successful`
        })

    }

}
catch (err) {
    console.log(err)
    //let counter = await Counter.findOneAndUpdate({ identifierName: "Branch" }, { $inc: { count: -1 } }, { upsert: true, new: true })

    
    return res.status(500).json({
        status: false,
        error: err.toString()
    })
}
}