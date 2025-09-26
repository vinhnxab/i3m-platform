const express = require('express');
const { body, param, query } = require('express-validator');
const templateController = require('../controllers/templateController');

const router = express.Router();

// Validation rules
const createTemplateValidation = [
  body('name').notEmpty().isLength({ max: 200 }).withMessage('Name is required and must be less than 200 characters'),
  body('description').notEmpty().isLength({ max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('shortDescription').notEmpty().isLength({ max: 200 }).withMessage('Short description is required and must be less than 200 characters'),
  body('category').isIn(['business', 'ecommerce', 'portfolio', 'blog', 'landing', 'dashboard', 'mobile', 'other']).withMessage('Invalid category'),
  body('author.name').notEmpty().withMessage('Author name is required'),
  body('author.email').isEmail().withMessage('Valid author email is required'),
  body('images.thumbnail').notEmpty().withMessage('Thumbnail image is required')
];

const updateTemplateValidation = [
  param('id').isMongoId().withMessage('Invalid template ID'),
  body('name').optional().isLength({ max: 200 }),
  body('description').optional().isLength({ max: 1000 }),
  body('shortDescription').optional().isLength({ max: 200 }),
  body('category').optional().isIn(['business', 'ecommerce', 'portfolio', 'blog', 'landing', 'dashboard', 'mobile', 'other'])
];

const getTemplateValidation = [
  param('id').isMongoId().withMessage('Invalid template ID')
];

const listTemplatesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['business', 'ecommerce', 'portfolio', 'blog', 'landing', 'dashboard', 'mobile', 'other']),
  query('status').optional().isIn(['draft', 'pending', 'approved', 'rejected', 'archived']),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['createdAt', 'name', 'downloadCount', 'rating', 'price']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

// Routes
router.get('/', listTemplatesValidation, templateController.getAllTemplates);
router.get('/featured', templateController.getFeaturedTemplates);
router.get('/categories/:category', templateController.getTemplatesByCategory);
router.get('/search', templateController.searchTemplates);
router.get('/:id', getTemplateValidation, templateController.getTemplateById);
router.get('/slug/:slug', templateController.getTemplateBySlug);

router.post('/', createTemplateValidation, templateController.createTemplate);
router.put('/:id', updateTemplateValidation, templateController.updateTemplate);
router.delete('/:id', getTemplateValidation, templateController.deleteTemplate);

// Special actions
router.post('/:id/download', getTemplateValidation, templateController.downloadTemplate);
router.post('/:id/rate', getTemplateValidation, body('rating').isInt({ min: 1, max: 5 }), templateController.rateTemplate);
router.post('/:id/review', getTemplateValidation, templateController.addReview);

module.exports = router;
