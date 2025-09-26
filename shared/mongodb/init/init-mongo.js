// I3M Platform MongoDB Initialization Script
// MongoDB 7.0 compatible

// Switch to i3m_platform database
db = db.getSiblingDB('i3m_platform');

// Create collections with validation schemas

// ======================
// CONTENT COLLECTIONS
// ======================

// Content collection for CMS
db.createCollection("contents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["tenant_id", "title", "type", "status"],
      properties: {
        tenant_id: {
          bsonType: "string",
          description: "Tenant ID for multi-tenant isolation"
        },
        title: {
          bsonType: "string",
          description: "Content title"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug"
        },
        type: {
          bsonType: "string",
          enum: ["page", "post", "product", "template"],
          description: "Content type"
        },
        status: {
          bsonType: "string",
          enum: ["draft", "published", "archived"],
          description: "Content status"
        },
        content: {
          bsonType: "object",
          description: "Content data structure"
        },
        metadata: {
          bsonType: "object",
          description: "SEO and additional metadata"
        },
        author_id: {
          bsonType: "string",
          description: "Author user ID"
        },
        published_at: {
          bsonType: "date",
          description: "Publication date"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

// Media files collection
db.createCollection("media", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["tenant_id", "filename", "mime_type", "file_size"],
      properties: {
        tenant_id: {
          bsonType: "string",
          description: "Tenant ID for multi-tenant isolation"
        },
        filename: {
          bsonType: "string",
          description: "File name"
        },
        original_filename: {
          bsonType: "string",
          description: "Original uploaded filename"
        },
        mime_type: {
          bsonType: "string",
          description: "MIME type of the file"
        },
        file_size: {
          bsonType: "int",
          description: "File size in bytes"
        },
        file_path: {
          bsonType: "string",
          description: "Storage path"
        },
        file_url: {
          bsonType: "string",
          description: "Public URL"
        },
        alt_text: {
          bsonType: "string",
          description: "Alternative text for accessibility"
        },
        metadata: {
          bsonType: "object",
          description: "File metadata (dimensions, etc.)"
        },
        uploaded_by: {
          bsonType: "string",
          description: "User ID who uploaded the file"
        },
        created_at: {
          bsonType: "date",
          description: "Upload timestamp"
        }
      }
    }
  }
});

// ======================
// TEMPLATE MARKETPLACE
// ======================

// Templates collection
db.createCollection("templates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "developer_id", "category", "status", "version"],
      properties: {
        name: {
          bsonType: "string",
          description: "Template name"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug"
        },
        description: {
          bsonType: "string",
          description: "Template description"
        },
        developer_id: {
          bsonType: "string",
          description: "Developer user ID"
        },
        category: {
          bsonType: "string",
          enum: ["business", "ecommerce", "blog", "portfolio", "landing"],
          description: "Template category"
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Template tags"
        },
        price: {
          bsonType: "decimal",
          description: "Template price"
        },
        currency: {
          bsonType: "string",
          description: "Price currency"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "approved", "rejected", "archived"],
          description: "Template status"
        },
        version: {
          bsonType: "string",
          description: "Template version"
        },
        preview_url: {
          bsonType: "string",
          description: "Preview URL"
        },
        download_url: {
          bsonType: "string",
          description: "Download URL"
        },
        screenshots: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Screenshot URLs"
        },
        features: {
          bsonType: "array",
          items: {
            bsonType: "string"
          },
          description: "Template features"
        },
        compatibility: {
          bsonType: "object",
          description: "Compatibility requirements"
        },
        ratings: {
          bsonType: "object",
          properties: {
            average: {
              bsonType: "double",
              minimum: 0,
              maximum: 5
            },
            count: {
              bsonType: "int",
              minimum: 0
            }
          }
        },
        downloads: {
          bsonType: "int",
          minimum: 0,
          description: "Download count"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

// Template reviews
db.createCollection("template_reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["template_id", "user_id", "rating", "review"],
      properties: {
        template_id: {
          bsonType: "string",
          description: "Template ID"
        },
        user_id: {
          bsonType: "string",
          description: "Reviewer user ID"
        },
        tenant_id: {
          bsonType: "string",
          description: "Tenant ID"
        },
        rating: {
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "Rating (1-5)"
        },
        review: {
          bsonType: "string",
          description: "Review text"
        },
        helpful_votes: {
          bsonType: "int",
          minimum: 0,
          description: "Helpful votes count"
        },
        created_at: {
          bsonType: "date",
          description: "Review timestamp"
        }
      }
    }
  }
});

// ======================
// ANALYTICS COLLECTIONS
// ======================

// User behavior tracking
db.createCollection("user_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["tenant_id", "event_type", "timestamp"],
      properties: {
        tenant_id: {
          bsonType: "string",
          description: "Tenant ID"
        },
        user_id: {
          bsonType: "string",
          description: "User ID (optional for anonymous events)"
        },
        session_id: {
          bsonType: "string",
          description: "Session ID"
        },
        event_type: {
          bsonType: "string",
          enum: ["page_view", "click", "purchase", "signup", "login", "logout"],
          description: "Event type"
        },
        event_data: {
          bsonType: "object",
          description: "Event-specific data"
        },
        page_url: {
          bsonType: "string",
          description: "Page URL"
        },
        referrer: {
          bsonType: "string",
          description: "Referrer URL"
        },
        user_agent: {
          bsonType: "string",
          description: "User agent string"
        },
        ip_address: {
          bsonType: "string",
          description: "IP address"
        },
        timestamp: {
          bsonType: "date",
          description: "Event timestamp"
        }
      }
    }
  }
});

// AI/ML model metadata
db.createCollection("ml_models", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "version", "status"],
      properties: {
        name: {
          bsonType: "string",
          description: "Model name"
        },
        type: {
          bsonType: "string",
          enum: ["classification", "regression", "clustering", "nlp", "recommendation"],
          description: "Model type"
        },
        version: {
          bsonType: "string",
          description: "Model version"
        },
        status: {
          bsonType: "string",
          enum: ["training", "ready", "deployed", "deprecated"],
          description: "Model status"
        },
        description: {
          bsonType: "string",
          description: "Model description"
        },
        parameters: {
          bsonType: "object",
          description: "Model parameters"
        },
        metrics: {
          bsonType: "object",
          description: "Model performance metrics"
        },
        training_data: {
          bsonType: "object",
          description: "Training data information"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

// ======================
// NOTIFICATION LOGS
// ======================

// Notification logs for detailed tracking
db.createCollection("notification_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["tenant_id", "type", "status", "timestamp"],
      properties: {
        tenant_id: {
          bsonType: "string",
          description: "Tenant ID"
        },
        user_id: {
          bsonType: "string",
          description: "User ID"
        },
        notification_id: {
          bsonType: "string",
          description: "Notification ID from PostgreSQL"
        },
        type: {
          bsonType: "string",
          enum: ["email", "sms", "push", "in-app"],
          description: "Notification type"
        },
        status: {
          bsonType: "string",
          enum: ["sent", "delivered", "opened", "clicked", "failed"],
          description: "Notification status"
        },
        provider: {
          bsonType: "string",
          description: "Service provider used"
        },
        response_data: {
          bsonType: "object",
          description: "Provider response data"
        },
        error_message: {
          bsonType: "string",
          description: "Error message if failed"
        },
        timestamp: {
          bsonType: "date",
          description: "Event timestamp"
        }
      }
    }
  }
});

// ======================
// CREATE INDEXES
// ======================

// Content indexes
db.contents.createIndex({ "tenant_id": 1, "type": 1, "status": 1 });
db.contents.createIndex({ "tenant_id": 1, "slug": 1 }, { unique: true });
db.contents.createIndex({ "published_at": -1 });
db.contents.createIndex({ "title": "text", "content.body": "text" });

// Media indexes
db.media.createIndex({ "tenant_id": 1, "mime_type": 1 });
db.media.createIndex({ "uploaded_by": 1, "created_at": -1 });

// Template indexes
db.templates.createIndex({ "developer_id": 1, "status": 1 });
db.templates.createIndex({ "category": 1, "status": 1 });
db.templates.createIndex({ "slug": 1 }, { unique: true });
db.templates.createIndex({ "name": "text", "description": "text", "tags": "text" });
db.templates.createIndex({ "ratings.average": -1 });
db.templates.createIndex({ "downloads": -1 });

// Template reviews indexes
db.template_reviews.createIndex({ "template_id": 1, "created_at": -1 });
db.template_reviews.createIndex({ "user_id": 1, "template_id": 1 }, { unique: true });

// Analytics indexes
db.user_analytics.createIndex({ "tenant_id": 1, "timestamp": -1 });
db.user_analytics.createIndex({ "user_id": 1, "timestamp": -1 });
db.user_analytics.createIndex({ "event_type": 1, "timestamp": -1 });
db.user_analytics.createIndex({ "session_id": 1, "timestamp": -1 });

// ML models indexes
db.ml_models.createIndex({ "name": 1, "version": 1 }, { unique: true });
db.ml_models.createIndex({ "type": 1, "status": 1 });

// Notification logs indexes
db.notification_logs.createIndex({ "tenant_id": 1, "timestamp": -1 });
db.notification_logs.createIndex({ "user_id": 1, "timestamp": -1 });
db.notification_logs.createIndex({ "notification_id": 1, "timestamp": -1 });
db.notification_logs.createIndex({ "type": 1, "status": 1, "timestamp": -1 });

// ======================
// INSERT SAMPLE DATA
// ======================

// Sample template for demo
db.templates.insertOne({
  name: "Modern Business Template",
  slug: "modern-business",
  description: "A clean and professional business website template with responsive design",
  developer_id: "550e8400-e29b-41d4-a716-446655440001",
  category: "business",
  tags: ["responsive", "modern", "professional", "business"],
  price: NumberDecimal("49.99"),
  currency: "USD",
  status: "approved",
  version: "1.0.0",
  preview_url: "https://preview.i3m.com/templates/modern-business",
  download_url: "https://downloads.i3m.com/templates/modern-business-v1.zip",
  screenshots: [
    "https://screenshots.i3m.com/modern-business/1.png",
    "https://screenshots.i3m.com/modern-business/2.png"
  ],
  features: [
    "Responsive Design",
    "SEO Optimized",
    "Contact Forms",
    "Google Analytics Ready"
  ],
  compatibility: {
    "node_version": ">=18.0.0",
    "browsers": ["Chrome", "Firefox", "Safari", "Edge"]
  },
  ratings: {
    average: 4.5,
    count: 23
  },
  downloads: 156,
  created_at: new Date(),
  updated_at: new Date()
});

// Sample content for demo
db.contents.insertOne({
  tenant_id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Welcome to I3M Platform",
  slug: "welcome-to-i3m-platform",
  type: "page",
  status: "published",
  content: {
    body: "Welcome to the I3M Platform - your complete business solution.",
    sections: [
      {
        type: "hero",
        title: "Transform Your Business",
        subtitle: "With our comprehensive platform"
      },
      {
        type: "features",
        items: [
          "ERP Management",
          "Multi-tenant Architecture",
          "Template Marketplace",
          "Advanced Analytics"
        ]
      }
    ]
  },
  metadata: {
    seo_title: "Welcome to I3M Platform - Complete Business Solution",
    seo_description: "Transform your business with our comprehensive ERP, CMS, and analytics platform.",
    keywords: ["business", "erp", "cms", "analytics"],
    og_image: "https://i3m.com/images/og-welcome.png"
  },
  author_id: "550e8400-e29b-41d4-a716-446655440001",
  published_at: new Date(),
  created_at: new Date(),
  updated_at: new Date()
});

// Sample ML model
db.ml_models.insertOne({
  name: "Customer Churn Prediction",
  type: "classification",
  version: "1.0.0",
  status: "ready",
  description: "Predicts customer churn based on usage patterns and behavior",
  parameters: {
    algorithm: "random_forest",
    n_estimators: 100,
    max_depth: 10,
    features: ["usage_frequency", "last_login", "support_tickets", "subscription_length"]
  },
  metrics: {
    accuracy: 0.87,
    precision: 0.84,
    recall: 0.89,
    f1_score: 0.86
  },
  training_data: {
    size: 10000,
    date_range: "2024-01-01 to 2024-09-01",
    features_count: 25
  },
  created_at: new Date(),
  updated_at: new Date()
});

print("MongoDB initialization completed successfully!");
print("Created collections: contents, media, templates, template_reviews, user_analytics, ml_models, notification_logs");
print("Created indexes for optimal performance");
print("Inserted sample data for development");
