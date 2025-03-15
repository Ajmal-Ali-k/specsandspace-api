const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    project_title: { 
        type: String, 
        required: true 
    },
    project_slug: { 
        type: String, 
        required: true,
        unique: true 
    },

    client_name: { 
        type: String, 
        required: true 
    },
    client_location: { 
        type: String, 
        default: null 
    },
    status: { 
        type: String, 
        enum: ['planning', 'in_progress', 'completed', 'on_hold'], 
        default: 'planning' 
    },
    short_description: { 
        type: String, 
        required: true 
    },

    year: { 
        type: Number, 
        default: null 
    },

    hero_image: { 
        type: String,
        required: true  
    },
    thumbnail_image: { 
        type: String,
        required: true 
    },
    additional_images: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <= 4;
            },
            message: 'Additional images cannot exceed 4'
        }
    },

    topology: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Topology',
        required: true 
    },

    area: { 
        type: Number, 
        default: null 
    },

    is_public: { 
        type: Boolean, 
        default: true 
    },

    // grid_span: {
    //     type: String,
    //     enum: ['col-span-3', 'col-span-4', 'col-span-7'],
    //     default: 'col-span-4'
    // }
}, { 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    } 
});

const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;