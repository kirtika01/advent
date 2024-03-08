const mongoose = require('mongoose')
const Schema = mongoose.Schema

const salaryStructureSchema = new Schema({

    //Details

    salaryStructureId: String,

    employeeId: String,
    employeeFullName:String,

    jobLevel:String,
    employeeRole:String,
    
    finYear:String,

    //Salary components

    monthlyBasic: Number,
    yearlyBasic: Number,
    monthlyHRA: Number,
    yearlyHRA: Number,

    basketOfAllowances:[
        {
            allowanceName:String,
            amount:Number,
            isMonthly:Boolean
            
        }
    ],

    

    eligibleForPF: Boolean,

    monthlyProvidentFund: Number,
    yearlyProvidentFund: Number,
    
    monthlyGratuity: Number,
    yearlyGratuity: Number,

    performanceBonus: [{
        bonusName: String,
        bonusAmount: Number,
        bonusFrequency: String//Monthly, Quarterly, Half-Yearly, Yearly
    }],

    monthlyTotal: Number,
    annualCTC: Number,
    comments:String,
    disclaimer:String,

    ctcDocumentLink:String,


}, {
    timestamps: true
})

const salaryStructure = mongoose.model('SalaryStructure', salaryStructureSchema)
module.exports = salaryStructure


