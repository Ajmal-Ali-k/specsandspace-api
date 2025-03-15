const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    category_name: { 
        type: String, 
        required: true 
    },
    category_slug: { 
        type: String, 
        required: true,
        unique: true 
    },
    category_description: { 
        type: String, 
        default: null 
    },
    icon: { 
        type: String, 
        default: null 
    },
    projects_count: { 
        type: Number, 
        default: 0 
    },
}, { 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
    } 
});

const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;