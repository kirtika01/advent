const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({


    notificationId:String, //NT-Counter

    isPriority:Boolean,

    notificationCategory:String,  //Customer, Employee , Vendor
    notificationAudience:String,  
    //Customer,Phase,Project,AllCustomer, 
    //Personal,Squad,Organisation

    notificationHeadline:String,
    notificationBody:String,
    notificationDate:Date,
 

    //If notificationCategory is Employee

    employeeId:String,//for TeamMember(userName)
    squadCode:String,//for department
    isOrganisationWide:Boolean, //for Organisation

    
    
    //If notificationCategory is Customer 

    //for sending to single Customer
    customerId:String,
    customerName:String,//Customer Full Name

    //for sending to all Customers in a phase
    phaseCode:String,
    phaseName:String,
    siteCode:String,
    siteName:String,

    //for sending to all Customers in a project
    //enter the siteCode and siteName of the project in above fields

    //for sending to all Customers
    isAllCustomer:{
      type:Boolean,
      default:false
    },

    //If notificationCategory is Vendor
    //to be updated later

  },{
    timestamps: true
  }
)

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification