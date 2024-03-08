const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema

const employeeSchema = new Schema({

    employeeId: {
        type: String
    },

    userName: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },


    employeeDisplayPhoto: String,
    employeeICardPhoto: String,
    employeeDetectionPhoto: String,

    salutation: {
        type: String
    },

    employeeFirstName: {
        type: String
    },
    employeeMiddleName: {
        type: String
    },

    employeeLastName: {
        type: String
    },

    employeeFullName: {
        type: String
    },

    //personal details

    gender: {
        type: String
    },//Male, Female, Other
    
    dateOfBirth: {
        type: Date
    },
    placeOfBirth:{
        type:String,
        default:"Not Added"
    },
    bloodGroup:{
        type:String,
        default:"Not Added"
    },

    personalPhoneCode: {
        type: String
    },

    personalPhoneNumber: {
        type: String
    },

    personalEmail: {
        type: String,
        default: "NA"
    },

    presentAddress:{
        addLine1:{
            type:String
        },
        addLine2:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pinCode:{
            type:String
        },
        country:{
            type:String
        }

    },


    permanentAddress:{
        addLine1:{
            type:String
        },
        addLine2:{
            type:String
        },
        landmark:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        pinCode:{
            type:String
        },
        country:{
            type:String
        }

    },



    fatherName:{
        type:String,
        default:"Not Added"
    },
    motherName:{
        type:String,
        default:"Not Added"
    },

    maritalStatus:{
        type:String,
        default:"Not Added"
    },
    spouseName:{
        type:String,
        default:"Not Added"
    },
    
    maidenName:{
        type:String,
        default:null
    },

    emergencyContact:{
        relation:String,
        salutation:String,
        fullName:String,
        phoneCode:String,
        phoneNumber:String,
        email:String,
        address:{
            addLine1:{
                type:String
            },
            addLine2:{
                type:String
            },
            landmark:{
                type:String
            },
            city:{
                type:String
            },
            state:{
                type:String
            },
            pinCode:{
                type:String
            },
            country:{
                type:String
            }
    
        },
    },


    //end of personal details


    //govt ID details

    employeeAadhar: {
        type: Number,
        default: 0
    },
    aadharScan: {
        type: String,
        default: null
    },

    employeePAN: {
        type: String,
        default: null
    },
    panScan: {
        type: String,
        default: null
    },

    employeePassport: {
        passportNo: {
            type: String,
            default: null
        },
        passportScan: {
            type: String,
            default: null
        },
        issueDate: {
            type: Date,
            default: null
        },
        expiryDate: {
            type: Date,
            default: null
        },
        placeOfIssue: {
            type: String,
            default: null
        },
        countryOfIssue: {
            type: String,
            default: null
        }

    },

    //end of govt ID details


    educationalDetails: [
        {
            qualification: String,//10th,12th,Graduation,Post Graduation,Diploma
            schoolInstitute: String,
            universityBoard: String,
            score: String,
            scoreType: String,//Percentage,CGPA
            yearOfPassing: String,
            courseType:String,//Distance, Full Time, Part Time, Online
            city: String,
            State: String,
            country: String,
            degreeScan: String,
            marksheetScan: String
        }
    ],

    previousEmployerDetails: [
        {  
            employerName: String,
            designation: String,
            department: String,
            dateOfJoining: Date,
            dateOfLeaving: Date,
            lastCTC: String,
            experienceLetterScan: String,
            payslipsScan: String,
            additionalDocumentScan: {
                type: String,
                default: "Not Added"
            }
        }
    ],

    baseBranchCode: {
        type: String
    },
    baseBranchName: {
        type: String
    },
    baseBranchState: {
        type: String
    },

    squads:[{

        squadCode:{
            type: String
        },
    
        squadName:{
            type: String,
            default: "Not Assigned"
        },
        squadRole:{
            type:String
        },//Counsellor1,Counsellor2,Counsellor3,Counsellor4,Counsellor5,SupportExec1,SupportExec2,Marketing,SquadLeader
        squadLogo:{
            type:String
        },
        allocation:{
            type: Number
        },
        branch:{
            type:String
        }   

    }],


    /*squadCode:{
        type: String
    },

    squadName:{
        type: String,
        default: "Not Assigned"
    },
    squadRole:{
        type:String
    },//Counsellor1,Counsellor2,Counsellor3,Counsellor4,Counsellor5,SupportExec1,SupportExec2,Marketing,SquadLeader
    
    branchCode:{
        type: String
    },

    branchName:{
        type: String
    },
    */

    lineManagerId: {
        type: String,
        default: "Not Added"
    },//Line Manager's Employee ID

    lineManagerName: {
        type: String,
        default: "UnAssigned"
    },//Line Manager's Full Name

    hrManagerId: {
        type: String,
        default: "Not Added"
    },//HR Manager's Employee ID

    hrManagerName: {
        type: String,
        default: "UnAssigned"
    },//HR Manager's Full Name

    employeeRole: {

        type:String,
    // Counsellor, Process Executive, Student Support Executive,  Squad Leader, Marketing Executive,Marketing Manager,HR Executive, HR Manager,Group Lead,Branch Manager,Cluster Manager,Finance Executive, Finance Manager ,CEO
    },
    
    jobLevel:{
        type: String
    },//C1,S1,S2,P1,,M1,M2,H1,H2,GL,BM,CM,FE,FM,CEO


    dateOfJoining: {
        type: Date
    },

    officialEmail: {
        type: String
    },

    officialPhoneCode: {
        type: String
    },
    officialPhone: {    
        type: String
    },

    salaryAccount:{
        accountNumber: {
            type: String,
            default: "Not Added"
        },
        accountHolderName: String,
        bankName: String,
        branchName: String,
        IFSCCode: String
    },

    salaryStructureId: {
        type: String
    },



    

    
    
    

    leavePlanName: {
        type: String,
        default: "Not Assigned"
    },
    leavePlanId: {
        type: String,
        default: "Not Assigned"
    },

    leaveBalance: [{
        leaveCode: String,
        leaveType: String,
        balance: Number, 
        maxLimit: Number,
        isCarryForward: Boolean,
        isSpecialLeave: Boolean,
        frequency: String,//Monthly,Quarterly,Yearly,One Time
        isMedicalLeave: Boolean,
        comments: String
    }],

    
    isFlexiPlan: {
        type: Boolean,
        default: false
    },//can employee take flexible days weekly off
    
    flexiOffBalance: {
        type: Number,
        default: 0
    },
    flexiOffCarryForward: {
        type: Boolean,
        default: true
    },



    

    
    canWFH: {
        type: Boolean,
        default: false
    },

    wfhBalance: {
        type: Number,
        default: 0
    },

    registerCode:{
        type:String,
    },
    deviceToken: {
        type: String,
        default: null
    },

    
    
    
    

    


}, {
    timestamps: true
})

employeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Employee', employeeSchema)
