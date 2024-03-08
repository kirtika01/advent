const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolSchema = new Schema({

    schoolId: {
        type: String,

    },//SCHOOL-Counter
    schoolCode: {
        type: String
    },//Unique Code for the school
    schoolName: {
        type: String
    },

    city: {
        type: String
    },
    country: {
        type: String
    },
    geo: {
        type: String
    },

    intake: [],

    schoolShortDesc: {
        type: String
    },
    schoolDesc: {
        type: String
    },
    established: {
        type: String
    },

    schoolType: {
        type: String
    }, // University, College, Institute, Business School

    schoolCategory: {
        type: String
    }, // Public, Private, Government, Autonomous, Deemed, Aided

    schoolWebsite: {
        type: String
    },

    schoolLogo: {
        type: String
    },
    schoolThumbNail: {
        type: String
    },

    photoGallery: [{
        link: String,
        date: Date,
        comment: String
    }],


    videolink: [{
        link: String,
        date: Date,
        comment: String
    }],

    requestedForEdit: {
        type: Boolean,
        default: false
    },
    requestedForEditBy: {
        type: String
    },
    requestedForEditByEmpId: {
        type: String
    },
    requestedForEditDate: {
        type: Date
    },

    status: {
        type: String,
        default: "Draft" //Draft, In Review, Live,Decommisioned
    },

    isFocused: {
        type: Boolean,
        default: false
    },


    creationDate: Date,
    createdBy: String,
    createdByEmpId: String,

    lastUpdated: Date,
    updatedBy: String,
    updatedByEmpId: String,

    inReviewDate: Date,

    liveApprovedDate: Date,
    liveApprovedBy: String,
    liveApprovedByEmpId: String,

    decommisionedDate: Date,
    decommisionedBy: String,
    decommisionedByEmpId: String,
    decommisionedReason: String,

    comments: [{
        comment: String,
        commentedBy: String,
        commentedByEmpId: String,
        commentedDate: Date
    }],

    schoolBookmark: [{
        schoolId: String,
    }],

    scholarshipAvailable: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true

})

schoolSchema.index({ schoolName: 'text', schoolDesc: 'text', schoolShortDesc: 'text', city: 'text', country: 'text', geo: 'text' });

const School = mongoose.model('School', schoolSchema)
module.exports = School