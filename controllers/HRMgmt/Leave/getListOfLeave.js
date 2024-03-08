const Leave = require("../../../models/HRMgmt/Leave")
const Employee = require("../../../models/HRMgmt/Employee")

exports.getListOfLeave = async (req, res) => {

    try {
        let query = {}

        if (req.query.employeeId) {

            query["employeeId"] = req.query.employeeId

        }
        if (req.query.applicationStatus) {

            query["applicationStatus"] = req.query.applicationStatus

        }
        if (req.query.leaveType) {

            query["leaveType"] = req.query.leaveType

        }
        if (req.query.lineManagerId) {

            query["lineManagerId"] = req.query.lineManagerId

        }

        if (req.query.isRejected === true || req.query.isRejected === "true") {
            query["applicationStatus"] = { $in: ["Rejected", "Cancelled"] }
        }

        let no_of_docs_each_page = req.query.pageSize;
        let current_page_number = req.query.pageNo;

        if(!req.query.pageNo){
            current_page_number = 0
        }
        if(!req.query.pageSize){
            no_of_docs_each_page =10
        }
        let totalNoOfLeave


        //Object.keys(query).length === 0
        if (query === null) {

            //console.log(query)
            totalNoOfLeave = await Leave.find().sort({ leaveStartDate: -1 }).count()
            let leaveList = await Leave.find().sort({ leaveStartDate: -1 })
                                       .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)

            if (leaveList.length > 0) {

                return res.status(200).json({
                    status: true,
                    leaveList: leaveList
                })

            }
            else {

                return res.status(200).json({
                    status: false,
                    Message: "No Leave available"
                })

            }

        }
        else {
            totalNoOfLeave = await Leave.find(query).sort({ leaveStartDate: -1 }).count()

            let leaveList = await Leave.find(query).sort({ leaveStartDate: -1 })
                                       .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)


            console.log(query)


            if (leaveList.length > 0) {

                return res.status(200).json({
                    status: true,
                    Total_No_Of_Leave:totalNoOfLeave,
                    listlength:leaveList.length,
                    leaveList: leaveList
                })

            }
            else {

                return res.status(200).json({
                    status: false,
                    Message: "No Leave available"
                })

            }

        }





    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }

}
















