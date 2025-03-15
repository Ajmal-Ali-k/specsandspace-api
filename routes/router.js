const express = require("express");
const authMiddleWare = require("../middlewares/authMiddleWare");
const { adminRegister,deleteTag ,adminLogin,addTag,getTags,addCategory,getCategories,deleteCategory,addTopology,getTopologies,deleteTopology,addProject,getProjects,getProject,getProjectBySlug,updateProject,deleteProject} = require("../controllers/controller");
const { uploadS3 } = require("../middlewares/s3Multer");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegister);


// Tag routes
router.post('/tags', authMiddleWare, addTag);
router.get('/tags', getTags);
router.delete('/tags/:id', authMiddleWare, deleteTag);

// Category routes
// router.post('/categories', authMiddleWare, upload.single('icon'), addCategory);
router.get('/categories', getCategories);
router.delete('/categories/:id', authMiddleWare, deleteCategory);

// Topology routes
router.post('/topologies', authMiddleWare, addTopology);
router.get('/topologies', getTopologies);
router.delete('/topologies/:id', authMiddleWare, deleteTopology);

// Project routes
router.post('/projects', authMiddleWare, uploadS3.any(), addProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);
router.get('/projects/slug/:slug', getProjectBySlug);
router.put('/projects/:id', authMiddleWare, uploadS3.any(), updateProject);
router.delete('/projects/:id', authMiddleWare, deleteProject);

module.exports = router;