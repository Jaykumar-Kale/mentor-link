const express = require('express');
const router  = express.Router();
const {
  getModules, getModuleById, createModule,
  updateModule, uploadResource, deleteResource,
} = require('../controllers/moduleController');
const { protect, authorize } = require('../middleware/auth');

router.get ('/',                    protect,                    getModules);
router.get ('/:id',                 protect,                    getModuleById);
router.post('/',                    protect, authorize('admin'), createModule);
router.put ('/:id',                 protect, authorize('admin'), updateModule);
router.post('/:id/upload',          protect, authorize('admin'), uploadResource);
router.delete('/:id/resource/:rid', protect, authorize('admin'), deleteResource);

module.exports = router;
