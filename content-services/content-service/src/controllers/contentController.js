const Content = require('../models/Content');
const logger = require('../utils/logger');
const sanitizeHtml = require('sanitize-html');

class ContentController {
  // Get all content with pagination and filters
  async getAllContent(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        contentType,
        status,
        language,
        category,
        tags,
        author,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const tenantId = req.header('X-Tenant-ID');
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Tenant ID is required'
        });
      }

      // Build query
      const query = { tenantId, isDeleted: false };
      
      if (contentType) query.contentType = contentType;
      if (status) query.status = status;
      if (language) query.language = language;
      if (category) query['categories.id'] = category;
      if (tags) query.tags = { $in: tags.split(',') };
      if (author) query['author.id'] = author;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [contents, total] = await Promise.all([
        Content.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-content'), // Exclude full content for list view
        Content.countDocuments(query)
      ]);

      res.json({
        success: true,
        message: 'Content retrieved successfully',
        data: contents,
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
      logger.error('Error getting all content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve content',
        error: error.message
      });
    }
  }

  // Get published content only
  async getPublishedContent(req, res) {
    try {
      const { page = 1, limit = 20, contentType, category, tags } = req.query;
      const tenantId = req.header('X-Tenant-ID');

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Tenant ID is required'
        });
      }

      const options = {
        limit: parseInt(limit),
        contentType,
        category,
        tags: tags ? tags.split(',') : undefined
      };

      const contents = await Content.findPublished(tenantId, options);
      const total = await Content.countDocuments({
        tenantId,
        status: 'published',
        isDeleted: false,
        publishedAt: { $lte: new Date() }
      });

      res.json({
        success: true,
        message: 'Published content retrieved successfully',
        data: contents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Error getting published content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve published content',
        error: error.message
      });
    }
  }

  // Get content by ID
  async getContentById(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Tenant ID is required'
        });
      }

      const content = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.json({
        success: true,
        message: 'Content retrieved successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error getting content by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve content',
        error: error.message
      });
    }
  }

  // Get content by slug
  async getContentBySlug(req, res) {
    try {
      const { slug } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Tenant ID is required'
        });
      }

      const content = await Content.findBySlug(slug, tenantId);

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      res.json({
        success: true,
        message: 'Content retrieved successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error getting content by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve content',
        error: error.message
      });
    }
  }

  // Create new content
  async createContent(req, res) {
    try {
      const contentData = req.body;
      const tenantId = req.tenantId;
      const user = req.user;

      // Sanitize HTML content
      if (contentData.content) {
        contentData.content = sanitizeHtml(contentData.content);
      }

      // Set author information
      contentData.author = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      contentData.tenantId = tenantId;

      const content = new Content(contentData);
      await content.save();

      logger.info('Content created:', { contentId: content._id, tenantId, userId: user.id });

      res.status(201).json({
        success: true,
        message: 'Content created successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error creating content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create content',
        error: error.message
      });
    }
  }

  // Update content
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tenantId = req.tenantId;

      // Sanitize HTML content
      if (updateData.content) {
        updateData.content = sanitizeHtml(updateData.content);
      }

      const content = await Content.findOneAndUpdate(
        { _id: id, tenantId, isDeleted: false },
        updateData,
        { new: true, runValidators: true }
      );

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      logger.info('Content updated:', { contentId: content._id, tenantId });

      res.json({
        success: true,
        message: 'Content updated successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error updating content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update content',
        error: error.message
      });
    }
  }

  // Delete content (soft delete)
  async deleteContent(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      const content = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await content.softDelete();

      logger.info('Content deleted:', { contentId: content._id, tenantId });

      res.json({
        success: true,
        message: 'Content deleted successfully'
      });

    } catch (error) {
      logger.error('Error deleting content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete content',
        error: error.message
      });
    }
  }

  // Publish content
  async publishContent(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      const content = await Content.findOneAndUpdate(
        { _id: id, tenantId, isDeleted: false },
        { 
          status: 'published',
          publishedAt: new Date()
        },
        { new: true }
      );

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      logger.info('Content published:', { contentId: content._id, tenantId });

      res.json({
        success: true,
        message: 'Content published successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error publishing content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish content',
        error: error.message
      });
    }
  }

  // Archive content
  async archiveContent(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      const content = await Content.findOneAndUpdate(
        { _id: id, tenantId, isDeleted: false },
        { status: 'archived' },
        { new: true }
      );

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      logger.info('Content archived:', { contentId: content._id, tenantId });

      res.json({
        success: true,
        message: 'Content archived successfully',
        data: content
      });

    } catch (error) {
      logger.error('Error archiving content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to archive content',
        error: error.message
      });
    }
  }

  // Duplicate content
  async duplicateContent(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;
      const user = req.user;

      const originalContent = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!originalContent) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      // Create duplicate
      const duplicateData = originalContent.toObject();
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;
      delete duplicateData.publishedAt;
      
      duplicateData.title = `${duplicateData.title} (Copy)`;
      duplicateData.status = 'draft';
      duplicateData.author = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      const duplicateContent = new Content(duplicateData);
      await duplicateContent.save();

      logger.info('Content duplicated:', { originalId: id, duplicateId: duplicateContent._id, tenantId });

      res.status(201).json({
        success: true,
        message: 'Content duplicated successfully',
        data: duplicateContent
      });

    } catch (error) {
      logger.error('Error duplicating content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate content',
        error: error.message
      });
    }
  }

  // Increment view count
  async incrementView(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const content = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await content.incrementView();

      res.json({
        success: true,
        message: 'View count incremented',
        viewCount: content.viewCount
      });

    } catch (error) {
      logger.error('Error incrementing view:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to increment view count',
        error: error.message
      });
    }
  }

  // Increment like count
  async incrementLike(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId;

      const content = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await content.incrementLike();

      res.json({
        success: true,
        message: 'Like count incremented',
        likeCount: content.likeCount
      });

    } catch (error) {
      logger.error('Error incrementing like:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to increment like count',
        error: error.message
      });
    }
  }

  // Increment share count
  async incrementShare(req, res) {
    try {
      const { id } = req.params;
      const tenantId = req.header('X-Tenant-ID');

      const content = await Content.findOne({
        _id: id,
        tenantId,
        isDeleted: false
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }

      await content.incrementShare();

      res.json({
        success: true,
        message: 'Share count incremented',
        shareCount: content.shareCount
      });

    } catch (error) {
      logger.error('Error incrementing share:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to increment share count',
        error: error.message
      });
    }
  }

  // Search content
  async searchContent(req, res) {
    try {
      const { q, page = 1, limit = 20, contentType, status } = req.query;
      const tenantId = req.header('X-Tenant-ID');

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: 'Tenant ID is required'
        });
      }

      // Build search query
      const query = {
        tenantId,
        isDeleted: false,
        $text: { $search: q }
      };

      if (contentType) query.contentType = contentType;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const [contents, total] = await Promise.all([
        Content.find(query, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-content'),
        Content.countDocuments(query)
      ]);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: contents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        query: q
      });

    } catch (error) {
      logger.error('Error searching content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search content',
        error: error.message
      });
    }
  }
}

module.exports = new ContentController();
