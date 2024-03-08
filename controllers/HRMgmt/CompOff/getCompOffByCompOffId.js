const CompOff = require('../../../models/HRMgmt/CompOff');

exports.getCompOffByCompOffId = async (req, res) => {
    try {


        let compOff = await CompOff.findOne({ compOffId: req.params.compOffId })

        if (!compOff) {
            throw new Error(`CompOff ${req.params.compOffId} not found`)
        }
        else{
            return res.status(200).json({
                status: true,
                compOff: compOff
            })
        }



    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}