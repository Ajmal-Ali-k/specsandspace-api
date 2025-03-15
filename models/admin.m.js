const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    password: { 
        type: String, 
        default: null 
    },
    role: { 
        type: String, 
        enum: ["admin", "superadmin", "moderator"], 
        default: "superadmin" 
    },
}, { 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    } 
});

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);

module.exports = adminModel;