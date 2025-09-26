package com.i3m.procurementservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private String name;
    private String version;
    private String description;
    
    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Services services = new Services();
    private Procurement procurement = new Procurement();
    private Pagination pagination = new Pagination();
    private Cache cache = new Cache();
    private FileUpload fileUpload = new FileUpload();
    
    @Data
    public static class Jwt {
        private String secret;
        private Long expiration;
    }
    
    @Data
    public static class Cors {
        private String allowedOrigins;
        private String allowedMethods;
        private String allowedHeaders;
        private boolean allowCredentials;
    }
    
    @Data
    public static class Services {
        private ServiceConfig authService = new ServiceConfig();
        private ServiceConfig userService = new ServiceConfig();
        private ServiceConfig financeService = new ServiceConfig();
        private ServiceConfig hrmService = new ServiceConfig();
        private ServiceConfig inventoryService = new ServiceConfig();
        private ServiceConfig apiGateway = new ServiceConfig();
        
        @Data
        public static class ServiceConfig {
            private String url;
            private int timeout;
        }
    }
    
    @Data
    public static class Procurement {
        private String defaultCurrency;
        private ApprovalWorkflow approvalWorkflow = new ApprovalWorkflow();
        private Rfq rfq = new Rfq();
        private PurchaseOrder purchaseOrder = new PurchaseOrder();
        private Supplier supplier = new Supplier();
        private Notifications notifications = new Notifications();
        
        @Data
        public static class ApprovalWorkflow {
            private boolean enabled;
            private double autoApproveLimit;
        }
        
        @Data
        public static class Rfq {
            private int validityDays;
            private int minSuppliers;
            private int maxSuppliers;
        }
        
        @Data
        public static class PurchaseOrder {
            private String numberPrefix;
            private boolean autoNumbering;
        }
        
        @Data
        public static class Supplier {
            private Evaluation evaluation = new Evaluation();
            
            @Data
            public static class Evaluation {
                private boolean enabled;
                private String criteria;
            }
        }
        
        @Data
        public static class Notifications {
            private boolean enabled;
            private boolean emailEnabled;
        }
    }
    
    @Data
    public static class Pagination {
        private int defaultSize;
        private int maxSize;
    }
    
    @Data
    public static class Cache {
        private Ttl ttl = new Ttl();
        
        @Data
        public static class Ttl {
            private long suppliers;
            private long categories;
            private long purchaseOrders;
        }
    }
    
    @Data
    public static class FileUpload {
        private String maxSize;
        private String allowedTypes;
        private String storagePath;
    }
}
