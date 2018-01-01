const mongoose = require("mongoose");
const config = require("../config/database");
var Schema = mongoose.Schema;

const CompanySchema = mongoose.Schema({
    organization : {
        type : String,
        require : true,
    },
    organization_type : {
        id : Schema.ObjectId ,
        name : {
            type : String,
            require : true,
        }
    },
    industry : {
        id : Schema.ObjectId ,
        name : {
            type : String,
            require : true,
        }
    },
    location : {
        type : String,
        require : true,
    },
    contact_person_email : {
        type : String,
        require : true,
        unique : true,
    },
    contact_person_fname : {
        type : String,
        require : true,
    },
    contact_person_lname : {
        type : String,
        require : true,
    },
    contact_no : {
        type : Number,
        require : true,
    },
    job_role : {
        type : String,
        require : true,
    },
    job_level : {
        type : String,
        require : true,
    },
    survey_attenders : [{
        id : Schema.ObjectId ,
        name : {
            type : String,
            require : true,
        }
    }],
    company_strength : {
        type : String,
        require : true,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    google         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    verification_code : {
        type : String,
    },
    delete_status : { 
        type: Boolean, 
        default: false 
    },
    block_status : { 
        type: Boolean, 
        default: false 
    },
    cmp_status : { 
        type: String, 
        default: "Not Verified", 
        // Trail, Subscribed, Expired
    },
    reg_datetime : { 
        type: Date, 
        default: Date.now 
    },
    paid_datetime : { 
        type: Date, 
    },
    subscribed_datetime : { 
        type: Date,
    },
    is_profile_completed : { 
        type: Boolean, 
        default: false 
    },
    password : {
        type : String,
    },
    role : {
        type : String,
        default : "company",
    },
    users : [{
        email : {
            type : String
        },
        group : {
            type : String
        },
        is_registered : {
            type : Boolean,
            default : false,
        },
        delete_status : {
            type : Boolean,
            default : false,
        },
        admin_block : {
            type : Boolean,
            default : false,
        },
        block_req_status : {
            type : Boolean,
            default : false,
        },
    }]
});

const Company = module.exports = mongoose.model('Company', CompanySchema, 'company');