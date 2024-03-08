const Squad = require('../../../models/HRMgmt/Squad');
const Employee = require('../../../models/HRMgmt/Employee');
const Branch = require("../../../models/HRMgmt/Branch");

exports.getListOfSquad = async (req, res) => {
    try {
        let query = {};

        if (req.query.squadGeo) {
            query['squadGeo'] = req.query.squadGeo;
        }
        if (req.query.squadType) {
            query['squadType'] = req.query.squadType;
        }
        if (req.query.branchCode) {
            query['branchCode'] = req.query.branchCode;
        }
        if (req.query.isRelatedSquadAssigned) {
            query['isRelatedSquadAssigned'] = req.query.isRelatedSquadAssigned;
        }
        
        let list;


        let no_of_docs_each_page = req.query.pageSize;
        let current_page_number = req.query.pageNo;

        if(!req.query.pageNo){
            current_page_number = 0
        }
        if(!req.query.pageSize){
            no_of_docs_each_page =10
        }
        let totalNoOfSquad


         if (Object.keys(query).length > 0) {
            totalNoOfSquad = await Squad.find(query).count()
            console.log(totalNoOfSquad)

            list = await Squad.find(query).populate('relatedSquad')
                              .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)
        } else {
            totalNoOfSquad = await Squad.find().count()
            console.log(totalNoOfSquad)
            list = await Squad.find().populate('relatedSquad')
                              .skip(no_of_docs_each_page * current_page_number).limit(no_of_docs_each_page)
        }

        if (list.length > 0) {

            // let employeeList = [];
            // let squadLeader
            // let branch
            
            // for (let i = 0; i < list.length; i++) {
            //     employeeList = await Employee.find({ squadCode: list[i].squadCode });
            //     squadLeader = await Employee.findOne({ squadCode: list[i].squadCode ,squadRole:"Squad Leader" });//ssl or psL
            //     branch = await Branch.findOne({branchCode:list[i].branchCode})
            //     list[i] = list[i].toObject();
            //     list[i].squadLeader = squadLeader;
            //     list[i].employeeList = employeeList;
            //     list[i].branchName = branch.branchName;
            // }    

            return res.status(200).json({
                status: true,
                Total_No_Of_Squad:totalNoOfSquad,
                No_Of_Squad: list.length,
                Squads: list

            })
        }

        return res.status(200).json({
            status: false,
            message: "No Squad Found"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}