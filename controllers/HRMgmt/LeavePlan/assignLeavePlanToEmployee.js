const LeavePlan = require("../../../models/HRMgmt/LeavePlan")
const Employee = require("../../../models/HRMgmt/Employee")


exports.assignLeavePlanToEmployee = async (req,res)=>{
 

    
    try{

        let token = req.headers.authorization.split(' ')[1]

        const leavePlan= await LeavePlan.findOne({leavePlanId:req.body.leavePlanId})

        const employee= await Employee.findOne({employeeId:req.body.employeeId})

        //console.log(employee.employeeId,leavePlan.leavePlanId)

        if(leavePlan && employee){

            employee.leavePlanId=req.body.leavePlanId
            employee.leavePlanName=leavePlan.leavePlanName
            employee.isFlexiPlan=leavePlan.isFlexiPlan

            await leavePlan.leaveCredits.reduce(async (promise, leaveCredit) => {

                await promise;
                if (leaveCredit.frequency == "One Time") {

                    let leaveTypeFound = false

                        for (let i = 0; i < employee.leaveBalance.length; i++) {
                            if (employee.leaveBalance[i].leaveType === leaveCredit.leaveType) {
                                leaveTypeFound = true
                                // Copy the object into employee.leaveBalance
                                employee.leaveBalance[i].balance = parseInt(employee.leaveBalance[i].balance) + parseInt(leaveCredit.balance)
                                if (parseInt(employee.leaveBalance[i].balance) > parseInt(leaveCredit.maxLimit)) {
                                    employee.leaveBalance[i].balance = parseInt(leaveCredit.maxLimit)
                                }

                                // employee.leaveBalance[i].balance = employee.leaveBalance[i].balance + leaveCredit.balance
                                // if (employee.leaveBalance[i].balance > leaveCredit.maxLimit) {
                                //     employee.leaveBalance[i].balance = leaveCredit.maxLimit
                                // }
                            }
                        }
                        if (leaveTypeFound === false) {
                            employee.leaveBalance.push({
                                leaveCode: leaveCredit.leaveCode,
                                leaveType: leaveCredit.leaveType,
                                balance: leaveCredit.balance,
                                maxLimit: leaveCredit.maxLimit,
                                isCarryForward: leaveCredit.isCarryForward,
                                isSpecialLeave: leaveCredit.isSpecialLeave,
                                frequency: leaveCredit.frequency,
                                isMedicalLeave: leaveCredit.isMedicalLeave,
                                comments: leaveCredit.comments
                            })
                        }

                }
                    
            }, Promise.resolve());



             let doc= await employee.save()

            if(doc){

                console.log("Send Notification to Employee-" + employee.employeeId)
                    // url = process.env.URL + '/api/v1/hrmgmt/notification/createNotificationEmployee'
                    // let sendNotify = await axios.post(url, {
                    //     "notificationAudience": "Personal",
                    //     "notificationHeadline": `Leave Plan Updated`,
                    //     "notificationBody": `Leave Plan Updated -${leavePlan.leavePlanName}. Check Leave section of your mobile app for more details.`,
                    //     "isPriority": false,
                    //     "employeeId": employee.employeeId
                    // }, {
                    //     headers: {
                    //         'Authorization': `Bearer ${token}`,
                    //         'Platform': `employeeMobile`
                    //     }
                    // })

                    // if (sendNotify.status !== 200) {
                    //     logger.error(`Unable to send notification for Employee-${employee.employeeId}`)
                    // }
                    // logger.info(`Notification sent to Employee-${employee.employeeId}`)
                    // logger.info(`Employee Leave Balance updated for Employee-${employee.employeeId}. `)
                return res.status(200).json({
        
                    status:true,
                    message:"Leave Plan Assigned to EmployeeId- "+req.body.employeeId+" Successfully",
                    employee:doc
               } )}

            else{
                 throw new Error(`Unable to update Employee-${req.body.employeeId}`)
            
             }

        }    

        else{
        return res.status(200).json({
    
            status:false,
            message:"Leave Plan not Assigned to EmployeeId- "+req.body.employeeId+ " EmployeeId or LeavePlanId is incorrect"
        } )}

        }

    catch(err){
        console.log(err)

            return res.status(500).json({
                status:false,
                error:err.toString()
            })
    }       
       
       
}