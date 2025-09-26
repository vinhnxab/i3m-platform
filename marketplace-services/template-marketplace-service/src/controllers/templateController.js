const Template = require('../models/Template');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

class TemplateController {
  // Get all templates with pagination and filters
  async getAllTemplates(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        page = 1,
        limit = 20,
        category,
        status = 'approved',
        featured,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        pricing
      } = req.query;

      const tenantId = req.header('X-Tenant-ID');

      // Build query
      const query = { isDeleted: false };
      
      if (tenantId) query.tenantId = tenantId;
      if (category) query.category = category;
      if (status) query.status = status;
      if (featured !== undefined) query.featured = featured === 'true';
      if (pricing) query['pricing.type'] = pricing;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [templates, total] = await Promise.all([
        Template.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-reviews'), // Exclude reviews for list view
        Template.countDocuments(query)
      ]);

      res.json({
        success: true,
        message: 'Templates retrieved successfully',
        data: templates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });

    } catch (error) {
      logger.error('Error getting all templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve templates',
        error: error.message
      });
    }
  }

  // Get featured templates
  async getFeaturedTemplates(req, res) {
    try {
      const { limit = 10 } = req.query;

      const templates = await Template.findFeatured(parseInt(limit));

      res.json({
        success: true,
        message: 'Featured templates retrieved successfully',
        data: templates
      });

    } catch (error) {
      logger.error('Error getting featured templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured templates',
        error: error.message
      });
    }
  }

  // Get templates by category
  async getTemplatesByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 20 } = req.query;

      const templates = await Template.findByCategory(category, parseInt(limit));

      res.json({
        success: true,
        message: `Templates in ${category} category retrieved successfully`,
        data: templates
      });

    } catch (error) {
      logger.error('Error getting templates by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve templates by category',
        error: error.message
      });
    }
  }

  // Get template by ID
  async getTemplateById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template retrieved successfully',
        data: template
      });

    } catch (error) {
      logger.error('Error getting template by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve template',
        error: error.message
      });
    }
  }

  // Get template by slug
  async getTemplateBySlug(req, res) {
    try {
      const { slug } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const query = { slug, isDeleted: false, status: 'approved' };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template retrieved successfully',
        data: template
      });

    } catch (error) {
      logger.error('Error getting template by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve template',
        error: error.message
      });
    }
  }

  // Create new template
  async createTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const templateData = req.body;
      const tenantId = req.header('X-Tenant-ID');

      if (tenantId) {
        templateData.tenantId = tenantId;
      }

      const template = new Template(templateData);
      await template.save();

      logger.info('Template created:', { templateId: template._id, name: template.name });

      res.status(201).json({
        success: true,
        message: 'Template created successfully',
        data: template
      });

    } catch (error) {
      logger.error('Error creating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template',
        error: error.message
      });
    }
  }

  // Update template
  async updateTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOneAndUpdate(
        query,
        updateData,
        { new: true, runValidators: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      logger.info('Template updated:', { templateId: template._id, name: template.name });

      res.json({
        success: true,
        message: 'Template updated successfully',
        data: template
      });

    } catch (error) {
      logger.error('Error updating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update template',
        error: error.message
      });
    }
  }

  // Delete template (soft delete)
  async deleteTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      await template.softDelete();

      logger.info('Template deleted:', { templateId: template._id, name: template.name });

      res.json({
        success: true,
        message: 'Template deleted successfully'
      });

    } catch (error) {
      logger.error('Error deleting template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete template',
        error: error.message
      });
    }
  }

  // Download template
  async downloadTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false, status: 'approved' };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      // Increment download count
      await template.incrementDownload();

      logger.info('Template downloaded:', { templateId: template._id, name: template.name });

      res.json({
        success: true,
        message: 'Template download initiated',
        data: {
          downloadUrl: template.downloadInfo.fileUrl || '/downloads/' + template.slug + '.zip',
          fileName: template.downloadInfo.fileName || template.slug + '.zip',
          fileSize: template.downloadInfo.fileSize
        }
      });

    } catch (error) {
      logger.error('Error downloading template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download template',
        error: error.message
      });
    }
  }

  // Rate template
  async rateTemplate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { rating } = req.body;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false, status: 'approved' };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      await template.addRating(rating);

      logger.info('Template rated:', { templateId: template._id, rating });

      res.json({
        success: true,
        message: 'Template rated successfully',
        data: {
          averageRating: template.ratings.average,
          totalRatings: template.totalRatings
        }
      });

    } catch (error) {
      logger.error('Error rating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to rate template',
        error: error.message
      });
    }
  }

  // Add review
  async addReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { rating, comment, userId, userName } = req.body;
      const tenantId = req.header('X-Tenant-ID');

      const query = { _id: id, isDeleted: false, status: 'approved' };
      if (tenantId) query.tenantId = tenantId;

      const template = await Template.findOne(query);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      // Add review
      template.reviews.push({
        userId: userId || 'anonymous',
        userName: userName || 'Anonymous User',
        rating,
        comment,
        date: new Date()
      });

      // Update rating if provided
      if (rating) {
        await template.addRating(rating);
      }

      await template.save();

      logger.info('Review added:', { templateId: template._id, userId });

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: {
          reviewCount: template.reviews.length,
          averageRating: template.ratings.average
        }
      });

    } catch (error) {
      logger.error('Error adding review:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add review',
        error: error.message
      });
    }
  }

  // Search templates
  async searchTemplates(req, res) {
    try {
      const { q, page = 1, limit = 20, category, pricing } = req.query;
      const tenantId = req.header('X-Tenant-ID');

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      // Build search query
      const query = {
        isDeleted: false,
        status: 'approved',
        $text: { $search: q }
      };

      if (tenantId) query.tenantId = tenantId;
      if (category) query.category = category;
      if (pricing) query['pricing.type'] = pricing;

      const skip = (page - 1) * limit;

      const [templates, total] = await Promise.all([
        Template.find(query, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-reviews'),
        Template.countDocuments(query)
      ]);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: templates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        query: q
      });

    } catch (error) {
      logger.error('Error searching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search templates',
        error: error.message
      });
    }
  }
}

module.exports = new TemplateController();
