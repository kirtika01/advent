const axios = require("axios");
const Lead = require("../../../models/LeadMgmt/Lead");
const Employee = require("../../../models/HRMgmt/Employee");
const Squad = require("../../../models/HRMgmt/Squad");
const fbaseAdmin = require("firebase-admin");
const moment = require("moment-timezone");


exports.assignCounsellorToLead = async (req, res) => {
    try {

        
        const { 
            leadId, 
            counsellorEmpId ,
            isSelfAssigned,
            assignedByEmpId

        } = req.body;
         

        let lead = await Lead.findOne({ leadId:leadId })

        if (!lead) {
            throw new Error("No Lead found for Lead ID :: " + leadId)
        }

        const counsellor = await Employee.findOne({ employeeId: counsellorEmpId });

        if (!counsellor) {
            throw new Error("No Counsellor found for Employee ID :: " + counsellorEmpId)
        }

        const counsellorSquad = await Squad.findOne({ squadCode: counsellor.squadCode });

        if (!counsellorSquad) {
            throw new Error("No Squad found for Employee ID :: " + counsellorEmpId)
        }

        lead.assignedType = "Pulled"

        let assignedBy
        if (isSelfAssigned== false){

            assignedBy = await Employee.findOne({ employeeId: assignedByEmpId });

            if (!assignedBy) {
                throw new Error("No Employee found for Employee ID :: " + assignedByEmpId)
            }

            lead.counsellorAssignedBy = {
                employeeFullName:assignedBy.employeeFullName,
                employeeId:assignedBy.employeeId
            }

            lead.assignedType = "Supervisor"

        }

        


        lead.counsellorAssigned = counsellor
        lead.counsellorAssignedDate =  new Date()
        nextTelecallingDate = new Date().setDate(new Date().getDate()+1)
        lead.leadStatus = "Counsellor Assigned";
        lead.studentSupportSquad =counsellorSquad


        let doc = await lead.save();

        if (!doc) {

            throw new Error(
                "Unable to Assign Counsellor to the Lead"
            )
        }

        let url = process.env.URL + '/api/v1/leadmgmt/leadProcessing/addCommentToLead';

        let comment
        let commentedBy
        if(isSelfAssigned==true){
            comment= `Lead assigned to Counsellor ${counsellor.employeeFullName}. Self Assigned`
            commentedBy = counsellor.employeeFullName
        }
        else{
            comment= `Lead assigned to Counsellor ${counsellor.employeeFullName} by ${assignedBy.employeeFullName}`
            commentedBy = assignedBy.employeeFullName
        }
        let addComment =await axios.put(url,{
            "leadId":leadId,
            "comment":{
                comment: comment,
                commentedBy: commentedBy,
                commentType: isSelfAssigned?"Self":"Supervisor"
            }
        })
        //console.log(addComment.status)
        if(addComment.status!=200){
            throw new Error("Unable to add Comment to Lead")
        }

        // Send Mobile Notification to Counsellor
        
        return res.status(200).json({
            status: true,
            message: "Counsellor Assigned",
            lead: doc
        })
    }
    
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            error: err.toString()
        })
    }
}




/*
url = process.env.URL + '/api/v1/utils/sendEmail'
            let subject = `Counsellor Assigned to Lead ${lead.leadId}`;

            let html

            
            html = `${emailBody}`;

            console.log(html)
            console.log(lead.leadEmail)
            let mailSent = await axios.post(url, {
                to: lead.leadEmail,  // Change to email address that you want to receive messages on
                subject: subject,
                html: html
            })

            if(mailSent.status= 200){
                console.log("Mail Sent")
            }

const emailBody=`<p>
        <div style=" padding: 15px;">
            <div style="height: 45rem; width: 50rem; display: flex;">
                <div style="background-color: #fffff0; border-radius: 20px 0px 0px 20px; width: 70%;">
                    <div style="padding: 25px 30px 25px 50px; font-size: 11.5px;">
                        <h3>Dear Abhishek,</h3>
                        <br>
                        <p>
                            We are pleased to inform you that you have been assigned a dedicated Advent Education counselor
                            to assist you throughout your study abroad journey. Your counselor's name is ${lead.counsellorFirstName} ${lead.counsellorMiddleName?lead.counsellorMiddleName+ " ":``}${lead.counsellorLastName},
                            and they are a highly experienced and knowledgeable professional with years of experience in
                            helping students achieve their study abroad goals.
                            <br>
                            <br>
                            Your counselor will be your primary point of contact throughout the application process, and
                            they will guide you every step of the way, from selecting the right program and university to
                            preparing for exams and submitting your application materials.
                            <br>
                            <br>
                            You can reach out to your councellor on the given mail id or phone number :
                            <br>
                            <br>${lead.counsellorEmail} </span>"
                            
                            <br><span>Phone : </span>${lead.counsellorPhone} </span>"
                            <br>
                            <br>
                            Thank you for choosing Advent Education. We are committed to supporting you throughout your
                            study abroad journey, and we look forward to helping you achieve your dreams of studying abroad.
                            <br>
                            <br>
                            Best regards,<br>Advent Education Team
                        </p>
                        <br>
                        <br>
                        <br>
                        <h2 style="text-align: center; margin: 45px 80px 0px 0px;">To Access your Dashboard
                        </h2>
                        <br>
                        <button class="btn">Click Here</button>
                    </div>
                </div>
                <div style="background-color: #785289; border-radius: 0px 20px 20px 0px; width: 18rem;position: relative;">
                    <img src="./Access Board.png" alt="Access-Board"
                        style="width: 100%; margin-left: 15px; margin-top: 50px;" />
                    <img src="./image.png" alt="right-image"
                        style="height: 66%; margin: 115px 0px 0px 0px;position: absolute;right: -109px;" />
                </div>
            </div>
            <div style=" width: 50rem;
            font-size: small; margin-top: 15px;">
                <div style="display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 150px;">
                    <div class="social-icons">
                        <a href="#" class="fa fa-facebook"></a>
                        <a href="#" class="fa fa-twitter"></a>
                        <a href="#" class="fa fa-instagram"></a>
                    </div>
                    <div style="font-size: 11px; font-weight: 600;">
                        <p>www.accessboard.com<br>98300 98300</p>
                    </div>
                    <div>
                        <span>Powered by</span><br>
                        <img style="width: 90%;" src="./Advent Logo.png" alt="advent-logo" />
                    </div>
                </div>
                <p style="font-size: 9px;font-weight: 600; text-align: right; margin: 13px 65px 0px 0px;">
                    Disclaimer : Neque porro quisquam est qui ipsum quia dolor sit amet, consecteur, addipsci veilt...
                </p>
            </div>
        </div>
        </p>`

    */