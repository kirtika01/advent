const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const payslipSchema = new Schema({

    payslipNumber: String, //YYYY-MMM-EmployeeId

    payslipStatus: {
        type: String,
        default: "Payroll Generated"//Payroll Generated, Payroll Approved, Payroll Rejected, Payroll Paid
    },

    payslipGenerationDate:Date,
    pan:String,

    financialYear:String,
    month:String,
    year:Number,
    

    salaryAccount:{
        accountNumber: String,
        accountHolderName: String,
        bankName: String,
        branchName: String,
        IFSCCode: String
    },
    transactionId:String,

    salaryStructureId: String,
    employeeId: String,
    employeeFullName: String,
    jobLevel: String,
    designation: String,

    year: Number,
    month: String,
    finYear: String, //YYYY eg. 2324 for 2023-2024
    payrollGenerationDate:{
        type : Date,
        default: moment.tz(new Date(), "Asia/Kolkata")
    },
        
    monthlyBasic: Number,
    monthlyHRA: Number,

    monthlyPersonalAllowance: Number,
    monthlyTravelAllowance: Number,
    monthlyMealAllowance: Number,
    monthlyPhoneAndDataAllowance: Number,

    quarterlyPerformanceBonus: {
        type:Number,
        default:0
    },
    performanceBonusPercentage:{
        type:Number,
        default:0
    },
    annualFestivalBonus: {
        type:Number,
        default:0
    },
    festivalBonusPercentage:{
        type:Number,
        default:0
    },


    eligileForPF: Boolean,

    monthlyProvidentFundDeduction: Number,
    monthlyGratuity: Number,

    totalPFDeduction: {
        type: Number,
        default: 0
    },
    interestOnPF: {
        type: Number,
        default: 0
    },
    totalProvidentFund: {
        type: Number,
        default: 0
    },
    
    totalGratuity: Number,


    professionalTaxDeduction: Number,    
    salaryAdvanceDeduction:Number,
    tdsDeduction:{
        type:Number,
        default:0
    },

    incentives:[{
        description:String,
        amount:Number

    }],
    totalIncentive:Number,


    grossSalary: Number,
    totalDeduction: Number,

    netSalary: Number,

    payslipS3Link: String,

    approvedByEmpId: String,
    approvedByFullName: String,
    approvalDate: Date,

    payoutStatus: {
        type: Boolean,
        default: false
    },
    payoutDate: Date,
    payoutMode: String,
    chequeNumber: String,

    bankAccountNumber: String,
    bankName: String,
    bankBranch: String,
    bankIFSC: String,


}, {
    timestamps: true
}
)

const Payslip = mongoose.model('Payslip', payslipSchema)
module.exports = Payslip