const express = require('express');
const { body, param, query } = require('express-validator');
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Validation rules
const createContentValidation = [
  body('title').notEmpty().isLength({ max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('contentType').isIn(['article', 'page', 'blog', 'news', 'tutorial', 'documentation', 'faq', 'announcement']),
  body('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']),
  body('visibility').optional().isIn(['public', 'private', 'protected']),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('summary').optional().isLength({ max: 500 })
];

const updateContentValidation = [
  param('id').isMongoId().withMessage('Invalid content ID'),
  body('title').optional().isLength({ max: 200 }),
  body('contentType').optional().isIn(['article', 'page', 'blog', 'news', 'tutorial', 'documentation', 'faq', 'announcement']),
  body('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']),
  body('visibility').optional().isIn(['public', 'private', 'protected']),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
  body('summary').optional().isLength({ max: 500 })
];

const getContentValidation = [
  param('id').isMongoId().withMessage('Invalid content ID')
];

const listContentValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('contentType').optional().isIn(['article', 'page', 'blog', 'news', 'tutorial', 'documentation', 'faq', 'announcement']),
  query('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']),
  query('language').optional().isLength({ min: 2, max: 5 })
];

// Routes
router.get('/', listContentValidation, validateRequest, contentController.getAllContent);
router.get('/published', listContentValidation, validateRequest, contentController.getPublishedContent);
router.get('/slug/:slug', contentController.getContentBySlug);
router.get('/:id', getContentValidation, validateRequest, contentController.getContentById);

router.post('/', authMiddleware, createContentValidation, validateRequest, contentController.createContent);
router.put('/:id', authMiddleware, updateContentValidation, validateRequest, contentController.updateContent);
router.delete('/:id', authMiddleware, getContentValidation, validateRequest, contentController.deleteContent);

// Special actions
router.post('/:id/publish', authMiddleware, getContentValidation, validateRequest, contentController.publishContent);
router.post('/:id/archive', authMiddleware, getContentValidation, validateRequest, contentController.archiveContent);
router.post('/:id/duplicate', authMiddleware, getContentValidation, validateRequest, contentController.duplicateContent);

// Statistics
router.post('/:id/view', getContentValidation, validateRequest, contentController.incrementView);
router.post('/:id/like', authMiddleware, getContentValidation, validateRequest, contentController.incrementLike);
router.post('/:id/share', getContentValidation, validateRequest, contentController.incrementShare);

// Search
router.get('/search/text', query('q').notEmpty().withMessage('Search query is required'), validateRequest, contentController.searchContent);

module.exports = router;
