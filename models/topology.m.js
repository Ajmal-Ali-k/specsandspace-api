const mongoose = require("mongoose");

const TopologySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: null 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
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

const TopologyModel = mongoose.models.Topology || mongoose.model('Topology', TopologySchema);

module.exports = TopologyModel;