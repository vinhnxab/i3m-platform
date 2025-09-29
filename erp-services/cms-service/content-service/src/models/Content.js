const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  summary: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  content: {
    type: String,
    required: true
  },
  
  contentType: {
    type: String,
    required: true,
    enum: ['article', 'page', 'blog', 'news', 'tutorial', 'documentation', 'faq', 'announcement'],
    default: 'article'
  },
  
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
  },
  
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'private', 'protected'],
    default: 'public'
  },
  
  language: {
    type: String,
    required: true,
    default: 'en',
    minlength: 2,
    maxlength: 5
  },
  
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  
  categories: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  }],
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'video', 'audio', 'other']
    },
    name: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      maxlength: 160
    },
    keywords: [{
      type: String,
      trim: true
    }],
    canonicalUrl: String
  },
  
  publishedAt: {
    type: Date,
    index: true
  },
  
  scheduledAt: {
    type: Date,
    index: true
  },
  
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  likeCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  shareCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowSharing: {
      type: Boolean,
      default: true
    },
    showAuthor: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    }
  },
  
  version: {
    type: Number,
    default: 1
  },
  
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    index: true
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  
  deletedAt: Date,
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
contentSchema.index({ tenantId: 1, status: 1, publishedAt: -1 });
contentSchema.index({ tenantId: 1, contentType: 1, status: 1 });
contentSchema.index({ tenantId: 1, 'categories.id': 1 });
contentSchema.index({ tenantId: 1, tags: 1 });
contentSchema.index({ tenantId: 1, 'author.id': 1 });
contentSchema.index({ slug: 1, tenantId: 1 }, { unique: true });
contentSchema.index({ title: 'text', content: 'text', summary: 'text' });

// Virtual for URL
contentSchema.virtual('url').get(function() {
  return `/${this.contentType}/${this.slug}`;
});

// Virtual for excerpt
contentSchema.virtual('excerpt').get(function() {
  if (this.summary) return this.summary;
  if (this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }
  return '';
});

// Pre-save middleware to generate slug
contentSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Add timestamp to ensure uniqueness
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  
  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Increment version on content changes
  if (this.isModified('content') && !this.isNew) {
    this.version += 1;
  }
  
  next();
});

// Static methods
contentSchema.statics.findPublished = function(tenantId, options = {}) {
  const query = {
    tenantId,
    status: 'published',
    isDeleted: false,
    publishedAt: { $lte: new Date() }
  };
  
  if (options.contentType) {
    query.contentType = options.contentType;
  }
  
  if (options.category) {
    query['categories.id'] = options.category;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query)
    .sort({ publishedAt: -1 })
    .limit(options.limit || 20);
};

contentSchema.statics.findBySlug = function(slug, tenantId) {
  return this.findOne({
    slug,
    tenantId,
    isDeleted: false
  });
};

// Instance methods
contentSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

contentSchema.methods.incrementLike = function() {
  this.likeCount += 1;
  return this.save();
};

contentSchema.methods.incrementShare = function() {
  this.shareCount += 1;
  return this.save();
};

contentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Content', contentSchema);
