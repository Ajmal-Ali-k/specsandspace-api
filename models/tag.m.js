const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    tag_name: { 
        type: String, 
        required: true 
    },
    tag_slug: { 
        type: String, 
        required: true,
        unique: true 
    },
    tag_description: { 
        type: String, 
        default: null 
    },
    projects_count: { 
        type: Number, 
        default: 0 
    },
    projects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    }]
}, { 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    } 
});

const TagModel = mongoose.models.Tag || mongoose.model('Tag', TagSchema);

module.exports = TagModel;