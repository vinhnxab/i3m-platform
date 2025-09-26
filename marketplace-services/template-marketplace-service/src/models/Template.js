const mongoose = require('mongoose');
const slugify = require('slugify');

const templateSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  
  name: {
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
  
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  category: {
    type: String,
    required: true,
    enum: ['business', 'ecommerce', 'portfolio', 'blog', 'landing', 'dashboard', 'mobile', 'other'],
    index: true
  },
  
  subcategory: {
    type: String,
    trim: true
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  
  author: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    avatar: String,
    website: String
  },
  
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'freemium'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  status: {
    type: String,
    required: true,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'draft',
    index: true
  },
  
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  images: {
    thumbnail: {
      type: String,
      required: true
    },
    screenshots: [{
      url: String,
      caption: String,
      order: Number
    }],
    logo: String
  },
  
  demo: {
    url: String,
    credentials: {
      username: String,
      password: String
    }
  },
  
  downloadInfo: {
    fileSize: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    fileUrl: String,
    fileName: String
  },
  
  requirements: {
    nodeVersion: String,
    dependencies: [{
      name: String,
      version: String,
      required: {
        type: Boolean,
        default: true
      }
    }],
    systemRequirements: String
  },
  
  features: [{
    type: String,
    trim: true
  }],
  
  technologies: [{
    name: String,
    version: String
  }],
  
  changelog: [{
    version: String,
    date: {
      type: Date,
      default: Date.now
    },
    changes: [String]
  }],
  
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  
  reviews: [{
    userId: String,
    userName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  
  support: {
    documentation: String,
    supportEmail: String,
    forum: String,
    github: String
  },
  
  license: {
    type: String,
    enum: ['MIT', 'GPL', 'Apache', 'BSD', 'Commercial', 'Other'],
    default: 'MIT'
  },
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
templateSchema.index({ tenantId: 1, status: 1, category: 1 });
templateSchema.index({ tenantId: 1, featured: 1, status: 1 });
templateSchema.index({ tags: 1, status: 1 });
templateSchema.index({ 'ratings.average': -1, status: 1 });
templateSchema.index({ 'downloadInfo.downloadCount': -1, status: 1 });
templateSchema.index({ createdAt: -1 });
templateSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for total ratings
templateSchema.virtual('totalRatings').get(function() {
  return this.ratings.breakdown.five + 
         this.ratings.breakdown.four + 
         this.ratings.breakdown.three + 
         this.ratings.breakdown.two + 
         this.ratings.breakdown.one;
});

// Pre-save middleware to generate slug
templateSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Add timestamp to ensure uniqueness
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  
  next();
});

// Static methods
templateSchema.statics.findPublic = function(filters = {}) {
  const query = {
    status: 'approved',
    visibility: 'public',
    isDeleted: false,
    ...filters
  };
  
  return this.find(query);
};

templateSchema.statics.findFeatured = function(limit = 10) {
  return this.find({
    status: 'approved',
    visibility: 'public',
    featured: true,
    isDeleted: false
  })
  .sort({ 'ratings.average': -1, downloadInfo.downloadCount: -1 })
  .limit(limit);
};

templateSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({
    category,
    status: 'approved',
    visibility: 'public',
    isDeleted: false
  })
  .sort({ 'ratings.average': -1, downloadInfo.downloadCount: -1 })
  .limit(limit);
};

// Instance methods
templateSchema.methods.incrementDownload = function() {
  this.downloadInfo.downloadCount += 1;
  return this.save();
};

templateSchema.methods.addRating = function(rating) {
  // Update breakdown
  switch(rating) {
    case 5: this.ratings.breakdown.five += 1; break;
    case 4: this.ratings.breakdown.four += 1; break;
    case 3: this.ratings.breakdown.three += 1; break;
    case 2: this.ratings.breakdown.two += 1; break;
    case 1: this.ratings.breakdown.one += 1; break;
  }
  
  // Recalculate average
  const total = this.totalRatings;
  const sum = (this.ratings.breakdown.five * 5) +
              (this.ratings.breakdown.four * 4) +
              (this.ratings.breakdown.three * 3) +
              (this.ratings.breakdown.two * 2) +
              (this.ratings.breakdown.one * 1);
  
  this.ratings.average = total > 0 ? (sum / total) : 0;
  this.ratings.count = total;
  
  return this.save();
};

templateSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Template', templateSchema);
