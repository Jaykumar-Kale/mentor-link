const Module    = require('../models/Module');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, modules });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/modules/:id
exports.getModuleById = async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: 'Module not found' });
    res.json({ success: true, module: mod });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/modules
exports.createModule = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const mod = await Module.create({ title, description, order: order || 0 });
    res.status(201).json({ success: true, module: mod });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/modules/:id
exports.updateModule = async (req, res) => {
  try {
    const mod = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, module: mod });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/modules/:id/upload
exports.uploadResource = async (req, res) => {
  try {
    if (!req.files?.file) return res.status(400).json({ message: 'No file uploaded' });
    const file = req.files.file;
    const ext  = file.name.split('.').pop().toLowerCase();
    const isImg = ['jpg','jpeg','png','gif'].includes(ext);

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: isImg ? 'image' : 'raw',
      folder: 'mentorlink/modules',
      public_id: `${Date.now()}_${file.name.replace(/\s+/g,'_')}`,
    });

    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ message: 'Module not found' });

    mod.resources.push({ fileName: file.name, fileUrl: result.secure_url, fileType: ext });
    await mod.save();
    res.json({ success: true, module: mod });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/modules/:id/resource/:resourceId
exports.deleteResource = async (req, res) => {
  try {
    await Module.findByIdAndUpdate(req.params.id, {
      $pull: { resources: { _id: req.params.resourceId } },
    });
    res.json({ success: true, message: 'Resource removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
