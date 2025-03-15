const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminModel = require("../models/admin.m");
const TagModel = require("../models/tag.m");
const CategoryModel = require("../models/category.m");
const TopologyModel = require("../models/topology.m");
const ProjectModel = require("../models/project.m");

// {
//   "email":"admin@admin.com",
//   "password":"admin@123"
// }


 const jwtSecret = "Irshad123";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await adminModel.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Tag Controllers
const addTag = async (req, res) => {
  try {
    const { tag_name, tag_slug, tag_description } = req.body;
    
    const newTag = await TagModel.create({
      tag_name,
      tag_slug,
      tag_description
    });

    res.status(201).json({
      message: "Tag added successfully!",
      success: true,
      tag: newTag
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.code === 11000 ? "Tag slug already exists" : "Error adding tag",
      success: false
    });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json({ tags, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await TagModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Tag deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Category Controllers
const addCategory = async (req, res) => {
  try {
    const { category_name, category_slug, category_description } = req.body;
    let icon = null;

    if (req.file) {
      icon = req.file.filename;
    }

    const newCategory = await CategoryModel.create({
      category_name,
      category_slug,
      category_description,
      icon
    });

    res.status(201).json({
      message: "Category added successfully!",
      success: true,
      category: newCategory
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.code === 11000 ? "Category slug already exists" : "Error adding category",
      success: false
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({ categories, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    await CategoryModel.updateMany(
      { subcategories: id },
      { $pull: { subcategories: id } }
    );
    
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const generateSlug = (name) => {
  return name
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove special characters
};

// Topology Controllers
const addTopology = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.body)
    const slug = generateSlug(name)
    console.log(slug)
    const newTopology = await TopologyModel.create({
      name,
      slug,
      description
    });

    res.status(201).json({
      message: "Topology added successfully!",
      success: true, 
      topology: newTopology
    });
  } catch (error) {
    console.error(error);
    console.log(error)
    res.status(400).json({
      message: error.code === 11000 ? "Topology slug already exists" : "Error adding topology",
      success: false
    });
  }
};

const getTopologies = async (req, res) => {
  try {
    const topologies = await TopologyModel.find();
    console.log(topologies.length)
    res.status(200).json({ topologies, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteTopology = async (req, res) => {
  try {
    const { id } = req.params;
    await TopologyModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Topology deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Project Controllers
const addProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      is_public: req.body.is_public === 'true',
      year: Number(req.body.year),
      area: Number(req.body.area),
      hero_image: null,
      thumbnail_image: null,
      additional_images: [],
    };
    req.files.forEach((file) => {
      if (file.fieldname === 'hero_image') {
        projectData.hero_image = file.location; // Store hero image URL
      } else if (file.fieldname === 'thumbnail_image') {
        projectData.thumbnail_image = file.location; // Store thumbnail image URL

      } else if (file.fieldname === 'additional_images') {
        projectData.additional_images.push(file.location); // Store additional images URLs in an array
      }
    });

    const newProject = await ProjectModel.create(projectData);
    res.status(201).json({
      success: true,
      message: "Project added successfully!",
      project: newProject
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? "Project slug already exists" : "Error adding project"
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    res.status(200).json({ projects, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id).populate('topology');
    console.log(project)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ project, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await ProjectModel.findOne({ project_slug: slug }).populate('topology');
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const relatedProjects = await ProjectModel.find({
      _id: { $ne: project._id },
      is_public: true
    });

    res.status(200).json({ 
      project, 
      relatedProjects,
      success: true 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      is_public: req.body.is_public === 'true',
      year: Number(req.body.year),
      area: Number(req.body.area),
      hero_image: null,
      thumbnail_image: null,
      additional_images: [],
    };
    req.files.forEach((file) => {
      if (file.fieldname === 'hero_image') {
        updateData.hero_image = file.location;
      } else if (file.fieldname === 'thumbnail_image') {
        updateData.thumbnail_image = file.location;

      } else if (file.fieldname === 'additional_images') {
        updateData.additional_images.push(file.location);
      }
    });
    // Fetch the existing project data
    const existingProject = await ProjectModel.findById(id);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found!" });
    }

    // Keep existing image URLs if new files are not provided
    updateData.hero_image = existingProject.hero_image;
    updateData.thumbnail_image = existingProject.thumbnail_image;
    updateData.additional_images = existingProject.additional_images || [];

    if (req.files) {
      req.files.forEach((file) => {
        if (file.fieldname === 'hero_image') {
          updateData.hero_image = file.location;
        } else if (file.fieldname === 'thumbnail_image') {
          updateData.thumbnail_image = file.location;
        } else if (file.fieldname === 'additional_images') {
          if (!Array.isArray(updateData.additional_images)) {
            updateData.additional_images = [];
          }
          updateData.additional_images.push(file.location);
        }
      });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true });
    
    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  adminLogin: (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error at login controller", success: false });
      }
      if (!user) {
        return res.status(403).json({ message: info.message, success: false });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ id: user._id }, jwtSecret);
        return res.status(200).json({
          message: "Login Successful",
          success: true,
          token,
          user,
        });
      });
    })(req, res, next);
  },
  adminRegister: async (req, res) => {
    try {
      const data = req.body;
      console.log(data)
      const check = await adminModel.findOne({ email: data.email });
      if (check) {
        return res
          .status(200)
          .send({ msg: "User already exists", success: false });
      }
      const password = data.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      data.password = hashedPassword;
      const newUser = new adminModel(data);
      const token = jwt.sign({ id: newUser._id }, String(jwtSecret));
      await newUser.save();
      res
        .status(201)
        .send({ msg: "registered succesfully", success: true, token });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "error while registering", success: false });
    }
  },
   // Tag exports
   addTag,
   getTags,
   deleteTag,
   
   // Category exports
   addCategory,
   getCategories,
   deleteCategory,
   
   // Topology exports
   addTopology,
   getTopologies,
   deleteTopology,
   
   // Project exports
   addProject,
   getProjects,
   getProject,
   getProjectBySlug,
   updateProject,
   deleteProject
};
