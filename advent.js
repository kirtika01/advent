const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
let path = require("path");
// const { Logger, Levels } = require("@zohocrm/nodejs-sdk-2.0/routes/logger/logger");

// let logger = Logger.getInstance(Levels.INFO, "/Users/user_name/Documents/nodejs_sdk_log.log");
// const UserSignature = require("@zohocrm/nodejs-sdk-2.0/routes/user_signature").UserSignature;

// let user = new UserSignature("abc@zoho.com");



require("dotenv").config();
require("./config/db");

const firebaseAdmin = require("firebase-admin");
var serviceAccount = require("./config/advent-c7620-firebase-adminsdk-x8ptp-d7a62cc81b.json");
const { initializeApp, getApps, getApp } = require("firebase-admin/app")




const port = process.env.PORT;
console.log("port:::" + port);


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Initialize Firebase app

const firebaseApp = !getApps().length ? initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
}) : getApp()

console.log("Firebase App initialized:: " + firebaseApp.name)

const logger = require("./config/logger").logger;
const accessLogStream = require("./config/logger").accessLogStream;


//Batch jobs
//const expireOTP = require('./batchJobs/expireOTP');
//Lead Mgmt
//const assignLeadToQueue = require('./batchJobs/LeadMgmt/assignLeadToQueue');
//const sendTeleCallingReminder = require('./batchJobs/LeadMgmt/sendTeleCallingReminder');
//const expireSlots = require('./batchJobs/LeadMgmt/expireSlots');

//HR Mgmt
//const RejectAttendance = require('./batchJobs/HRMgmt/RejectAttendance');
//const rejectNonStartWFH = require('./batchJobs/HRMgmt/rejectNonStartWFH')
//const monthlyLeaveBalance = require('./batchJobs/HRMgmt/monthlyLeaveBalance');
//const clearLeaveBalance = require('./batchJobs/HRMgmt/clearLeaveBalance');
//const rejectNonStartWFH= require('./batchJobs/HRMgmt/rejectNonStartWFH');
//const addmonthlyWFHBalance= require('./batchJobs/HRMgmt/addmonthlyWFHBalance');
//const cleanupNotification= require('./batchJobs/HRMgmt/cleanupNotification');
//Routes


//authEmployee

const authEmployeeRoutes = require("./routes/Auth/Employee");
app.use("/api/v1/auth/employee", authEmployeeRoutes);

//authLead

const authLeadRoutes = require("./routes/Auth/Lead");
app.use("/api/v1/auth/lead", authLeadRoutes);


const userRoutes = require("./routes/User");
app.use("/api/v1/user", userRoutes);


//Lead Mgmt

const leadRoutes = require("./routes/LeadMgmt/Lead");
app.use("/api/v1/leadmgmt/lead", leadRoutes);

const campaignRoutes = require("./routes/LeadMgmt/Campaigns");
app.use("/api/v1/leadmgmt/campaign", campaignRoutes);

const CouncillingSlotsRoutes = require("./routes/LeadMgmt/CouncillingSlots");
app.use("/api/v1/leadmgmt/councillingSlots", CouncillingSlotsRoutes);

const LeadProcessingRoutes = require("./routes/LeadMgmt/LeadProcessing");
app.use("/api/v1/leadmgmt/leadProcessing", LeadProcessingRoutes);

const ProcessorRoutes = require("./routes/LeadMgmt/Processor");
app.use("/api/v1/leadmgmt/processor", ProcessorRoutes);

const utilRoutes = require('./routes/Utils');
app.use('/api/v1/utils', utilRoutes);

const setupRoutes = require('./routes/Setup');
app.use('/api/v1/setup', setupRoutes);

//Lead Mgmt Api

// const campaignsRoutes = require("./routes/LeadMgmt/Campaigns");
// app.use("/api/v1/leadmgmt/campaigns", campaignsRoutes);


//HR Mgmt API
const employeeRoutes = require("./routes/HRMgmt/Employee");
app.use("/api/v1/hrmgmt/employee", employeeRoutes);

const leaveRoutes = require("./routes/HRMgmt/Leave");
app.use("/api/v1/hrmgmt/leave", leaveRoutes);

const leavePlanRoutes = require("./routes/HRMgmt/LeavePlan")
app.use("/api/v1/hrmgmt/leavePlan", leavePlanRoutes)

const notificationRoutes = require("./routes/HRMgmt/Notification")
app.use("/api/v1/hrmgmt/notification", notificationRoutes)

const taskRoutes = require("./routes/HRMgmt/Task");
app.use("/api/v1/hrmgmt/task", taskRoutes);

const HRReportRoutes = require("./routes/HRMgmt/Report");
app.use("/api/v1/hrmgmt/report", HRReportRoutes);

const compOffRoutes = require("./routes/HRMgmt/CompOff");
app.use("/api/v1/hrmgmt/compOff", compOffRoutes);

const attendanceRoutes = require('./routes/HRMgmt/Attendance')
app.use('/api/v1/hrmgmt/attendance', attendanceRoutes);

const salaryStructureRoutes = require('./routes/HRMgmt/SalaryStructure');
app.use('/api/v1/hrmgmt/SalaryStructure', salaryStructureRoutes);

const claimRoutes = require('./routes/HRMgmt/Claims');
app.use('/api/v1/hrmgmt/claims', claimRoutes);

const branchRoutes = require('./routes/HRMgmt/Branch');
app.use('/api/v1/hrmgmt/branch', branchRoutes);

const squadRoutes = require('./routes/HRMgmt/Squad');
app.use('/api/v1/hrmgmt/squad', squadRoutes);

const countryRoutes = require('./routes/HRMgmt/Country');
app.use('/api/v1/hrmgmt/country', countryRoutes);

const geoRoutes = require('./routes/HRMgmt/Geo');
app.use('/api/v1/hrmgmt/geo', geoRoutes);

const holidayListRoutes = require('./routes/HRMgmt/HolidayList');
app.use('/api/v1/hrmgmt/holidaylist', holidayListRoutes);

//School API

const schoolRoutes = require("./routes/SchoolRepo/School");
app.use("/api/v1/schoolRepo/school", schoolRoutes);

const courseRoutes = require("./routes/SchoolRepo/Course");
app.use("/api/v1/schoolRepo/course", courseRoutes);

const schoolCoordinatorRoutes = require("./routes/SchoolRepo/SchoolCoordinator");
app.use("/api/v1/schoolRepo/schoolCoordinator", schoolCoordinatorRoutes);

const schoolReportRoutes = require("./routes/SchoolRepo/Reports");
app.use("/api/v1/schoolRepo/reports", schoolReportRoutes);


//Finance Mgmt

const finTeamRoutes = require("./routes/FinanceMgmt/FinTeam");
app.use("/api/v1/FinanceMgmt/finTeam", finTeamRoutes);


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public");





app.listen(port, () => {
  console.log(`Server running on Port - ${port}`);

});
