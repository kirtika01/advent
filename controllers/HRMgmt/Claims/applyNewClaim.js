const Claim = require('../../../models/HRMgmt/Claims');
const Employee = require('../../../models/HRMgmt/Employee');
const Counter = require('../../../models/Counter');
const moment = require("moment");
const firebaseAdmin = require("firebase-admin");



exports.applyNewClaim = async (req, res) => {
    try {
        const { employeeId, claimType, claimDescription, claimAmount, expenseDate } = req.body;

        const employee = await Employee.findOne({ employeeId: employeeId });

        if (employee) {


            //create claim Id
            let counter = await Counter.findOneAndUpdate({ identifierName: "Claim" }, { $inc: { count: 1 } }, { upsert: true, new: true })


            const claimId = "CLAIM-" + counter.count;


            employeeFullName = employee.employeeFirstName
            if (employee.employeeMiddleName) {
                employeeFullName += " ";
                employeeFullName += employee.employeeMiddleName;
            }
            employeeFullName += " " + employee.employeeLastName;



            //create a new claim

            const claim = new Claim({
                claimId: claimId,
                raisedBy: employee.userName,
                raisedByFullName: employeeFullName,
                raisedByEmpId: employeeId,
                claimType: claimType,
                claimDescription: claimDescription,
                claimAmount: claimAmount,
                expenseDate: moment.tz(new Date(expenseDate), "Asia/Kolkata")
            });

            if (claimAmount <= employee.currentMonthRemainingLimit) {

                console.log ("Here auto approved")
                claim.isAutoApprovedLineMgr = true;
                claim.lineMgrApprovalDate = moment();
                claim.lineMgrApprovalComments = "Claim is Auto Approved";
                claim.claimStatus = "AutoApproved"

                newCurrentLimit = employee.currentMonthRemainingLimit - claimAmount;
                await Employee.findOneAndUpdate({ employeeId: employeeId }, { currentMonthRemainingLimit: newCurrentLimit }, { new: true },
                    function (err, docs) {
                        if (err) {
                            throw new Error(
                                "Unable to Create New Claim"
                            )
                        }
                        else {
                            //console.log("Claim Amount Updated: ", docs);
                            console.log("Claim Amount Updated: ");
                        }
                    }
                );

                // await sendFCMNotification(employee,claim)
                
            }
            else {
                console.log ("Here line mgr approved")
                claim.lineMgrEmpId = employee.lineManagerId;
                const lineManager = await Employee.findOne({ employeeId: employee.lineManagerId });
                if (lineManager) {
                    lineMgrFullName = lineManager.employeeFirstName;
                    if (lineManager.employeeMiddleName) {
                        lineMgrFullName += " ";
                        lineMgrFullName += lineManager.employeeMiddleName;
                    }
                    lineMgrFullName += " " + lineManager.employeeLastName;
                    claim.lineMgrFullName = lineMgrFullName;
                    claim.lineMgr = lineManager.userName;
                    claim.lineMgrEmpId = lineManager.employeeId;
                    claim.claimStatus = "LineManagerApproval"
                    await claim.save()
                }
                else {

                    throw new Error("Unable to Create New Claim")

                }

            }
            //update this in employees data


            let doc = await claim.save();
            if (!doc) {
                throw new Error(
                    "Unable to Create New Claim"
                )
            }
            else {

                return res.status(200).json({
                    status: true,
                    message: "New Claim Successfully Created",
                    claim: doc
                })
            }
        }
        else {
            //console.log(error)
            return res.status(500).json({
                status: false,
                message: 'Employee Not Found'
            });
        }
    }
    catch (err) {
        let counter = await Counter.findOneAndUpdate({ identifierName: "Claim" }, { $inc: { count: -1 } }, { upsert: true, new: true })
        console.log(err)
        return res.status(500).send({
            status: false,
            error: err.toString()
        })
    }

}


const sendFCMNotification=async(employee,claim)=>{
   
   


    let messagingPayload = {
        notification: {
            title: `Claim ${claim.claimId} Auto Approved`,
            body: `Claim ${claim.claimId} has been Auto Approved and send to Finance Team for Clearance`,
            imageUrl: 'https://westroad-prd.s3.us-east-2.amazonaws.com/FCMTemplates/claim_auto_approve.png'
        },
        
    };

    

    firebaseAdmin.messaging().sendToDevice(employee.deviceToken,messagingPayload)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log(error)
        throw new Error('Error sending message:', error);
    })

    

}

