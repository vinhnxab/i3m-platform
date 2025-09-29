package com.i3m.ecommerce.service;

import com.i3m.ecommerce.dto.ProductDto;
import com.i3m.ecommerce.dto.OrderDto;
import com.i3m.ecommerce.model.Product;
import com.i3m.ecommerce.model.Order;
import com.i3m.ecommerce.repository.ProductRepository;
import com.i3m.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class EcommerceService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Product Management
    public ProductDto createProduct(UUID tenantId, ProductDto dto) {
        Product product = new Product(tenantId, dto.getName(), dto.getDescription(), dto.getPrice());
        mapDtoToProduct(dto, product);
        Product saved = productRepository.save(product);
        return convertProductToDto(saved);
    }

    @Cacheable(value = "products", key = "#tenantId + '_' + #pageable.pageNumber")
    public Page<ProductDto> getProducts(UUID tenantId, String category, String status, String search, Pageable pageable) {
        Page<Product> products;
        
        if (search != null && !search.isEmpty()) {
            products = productRepository.findByTenantIdAndSearch(tenantId, search, pageable);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByTenantIdAndCategory(tenantId, category, pageable);
        } else if (status != null && !status.isEmpty()) {
            products = productRepository.findByTenantIdAndStatus(tenantId, Product.ProductStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            products = productRepository.findByTenantId(tenantId, pageable);
        }
        
        return products.map(this::convertProductToDto);
    }

    public ProductDto getProduct(UUID tenantId, UUID id) {
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertProductToDto(product);
    }

    public ProductDto updateProduct(UUID tenantId, UUID id, ProductDto dto) {
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        mapDtoToProduct(dto, product);
        Product updated = productRepository.save(product);
        return convertProductToDto(updated);
    }

    public void deleteProduct(UUID tenantId, UUID id) {
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    public ProductDto updateInventory(UUID tenantId, UUID id, Integer quantity) {
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setQuantityInStock(quantity);
        Product updated = productRepository.save(product);
        return convertProductToDto(updated);
    }

    // Order Management
    public OrderDto createOrder(UUID tenantId, OrderDto dto) {
        Order order = new Order(tenantId, dto.getCustomerEmail(), dto.getTotalAmount());
        mapDtoToOrder(dto, order);
        Order saved = orderRepository.save(order);
        return convertOrderToDto(saved);
    }

    @Cacheable(value = "orders", key = "#tenantId + '_' + #pageable.pageNumber")
    public Page<OrderDto> getOrders(UUID tenantId, String status, String customerEmail, Pageable pageable) {
        Page<Order> orders;
        
        if (status != null && !status.isEmpty()) {
            orders = orderRepository.findByTenantIdAndStatus(tenantId, Order.OrderStatus.valueOf(status.toUpperCase()), pageable);
        } else if (customerEmail != null && !customerEmail.isEmpty()) {
            orders = orderRepository.findByTenantIdAndCustomerEmail(tenantId, customerEmail, pageable);
        } else {
            orders = orderRepository.findByTenantId(tenantId, pageable);
        }
        
        return orders.map(this::convertOrderToDto);
    }

    public OrderDto getOrder(UUID tenantId, UUID id) {
        Order order = orderRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertOrderToDto(order);
    }

    public OrderDto updateOrderStatus(UUID tenantId, UUID id, String status) {
        Order order = orderRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        if (order.getStatus() == Order.OrderStatus.SHIPPED) {
            order.setShippedAt(LocalDateTime.now());
        } else if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        Order updated = orderRepository.save(order);
        return convertOrderToDto(updated);
    }

    public OrderDto updateTracking(UUID tenantId, UUID id, String trackingNumber) {
        Order order = orderRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setTrackingNumber(trackingNumber);
        Order updated = orderRepository.save(order);
        return convertOrderToDto(updated);
    }

    // Analytics & Reports
    @Cacheable(value = "dashboard", key = "#tenantId")
    public Map<String, Object> getDashboardData(UUID tenantId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        Long totalProducts = productRepository.countByTenantIdAndStatus(tenantId, Product.ProductStatus.ACTIVE);
        Long totalOrders = orderRepository.countByTenantIdAndStatus(tenantId, Order.OrderStatus.DELIVERED);
        BigDecimal totalRevenue = orderRepository.getTotalRevenue(tenantId);
        Long pendingOrders = orderRepository.countByTenantIdAndStatus(tenantId, Order.OrderStatus.PENDING);
        
        dashboard.put("totalProducts", totalProducts);
        dashboard.put("totalOrders", totalOrders);
        dashboard.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        dashboard.put("pendingOrders", pendingOrders);
        
        return dashboard;
    }

    public Map<String, Object> getSalesAnalytics(UUID tenantId, String period) {
        Map<String, Object> analytics = new HashMap<>();
        LocalDateTime startDate;
        
        switch (period != null ? period : "month") {
            case "week":
                startDate = LocalDateTime.now().minusWeeks(1);
                break;
            case "year":
                startDate = LocalDateTime.now().minusYears(1);
                break;
            default:
                startDate = LocalDateTime.now().minusMonths(1);
        }
        
        BigDecimal revenue = orderRepository.getRevenueBetween(tenantId, startDate, LocalDateTime.now());
        Long orderCount = orderRepository.countOrdersSince(tenantId, startDate);
        
        analytics.put("revenue", revenue != null ? revenue : BigDecimal.ZERO);
        analytics.put("orderCount", orderCount);
        analytics.put("period", period);
        analytics.put("startDate", startDate);
        
        return analytics;
    }

    // Cart Management (Redis-based)
    public Map<String, Object> addToCart(UUID productId, Integer quantity, String sessionId) {
        String cartKey = "cart:" + (sessionId != null ? sessionId : UUID.randomUUID().toString());
        
        // Get current cart
        Map<Object, Object> cart = redisTemplate.opsForHash().entries(cartKey);
        cart.put(productId.toString(), quantity);
        
        // Save back to Redis with expiration
        redisTemplate.opsForHash().putAll(cartKey, cart);
        redisTemplate.expire(cartKey, 24, TimeUnit.HOURS);
        
        return Map.of("sessionId", sessionId, "itemsCount", cart.size());
    }

    public Map<String, Object> getCart(String sessionId) {
        String cartKey = "cart:" + sessionId;
        Map<Object, Object> cart = redisTemplate.opsForHash().entries(cartKey);
        
        return Map.of("items", cart, "itemsCount", cart.size());
    }

    // Helper methods
    private void mapDtoToProduct(ProductDto dto, Product product) {
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getCompareAtPrice() != null) product.setCompareAtPrice(dto.getCompareAtPrice());
        if (dto.getCostPrice() != null) product.setCostPrice(dto.getCostPrice());
        if (dto.getSku() != null) product.setSku(dto.getSku());
        if (dto.getBarcode() != null) product.setBarcode(dto.getBarcode());
        if (dto.getQuantityInStock() != null) product.setQuantityInStock(dto.getQuantityInStock());
        if (dto.getTrackQuantity() != null) product.setTrackQuantity(dto.getTrackQuantity());
        if (dto.getWeight() != null) product.setWeight(dto.getWeight());
        if (dto.getDimensions() != null) product.setDimensions(dto.getDimensions());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getTags() != null) product.setTags(dto.getTags());
        if (dto.getImages() != null) product.setImages(dto.getImages());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());
        if (dto.getIsFeatured() != null) product.setIsFeatured(dto.getIsFeatured());
        if (dto.getMetaTitle() != null) product.setMetaTitle(dto.getMetaTitle());
        if (dto.getMetaDescription() != null) product.setMetaDescription(dto.getMetaDescription());
        if (dto.getSearchKeywords() != null) product.setSearchKeywords(dto.getSearchKeywords());
    }

    private void mapDtoToOrder(OrderDto dto, Order order) {
        if (dto.getCustomerId() != null) order.setCustomerId(dto.getCustomerId());
        if (dto.getCustomerPhone() != null) order.setCustomerPhone(dto.getCustomerPhone());
        if (dto.getSubtotal() != null) order.setSubtotal(dto.getSubtotal());
        if (dto.getTaxAmount() != null) order.setTaxAmount(dto.getTaxAmount());
        if (dto.getShippingAmount() != null) order.setShippingAmount(dto.getShippingAmount());
        if (dto.getDiscountAmount() != null) order.setDiscountAmount(dto.getDiscountAmount());
        if (dto.getCurrency() != null) order.setCurrency(dto.getCurrency());
        if (dto.getPaymentMethod() != null) order.setPaymentMethod(dto.getPaymentMethod());
        if (dto.getShippingAddress() != null) order.setShippingAddress(dto.getShippingAddress());
        if (dto.getBillingAddress() != null) order.setBillingAddress(dto.getBillingAddress());
        if (dto.getNotes() != null) order.setNotes(dto.getNotes());
    }

    private ProductDto convertProductToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCompareAtPrice(product.getCompareAtPrice());
        dto.setCostPrice(product.getCostPrice());
        dto.setSku(product.getSku());
        dto.setBarcode(product.getBarcode());
        dto.setQuantityInStock(product.getQuantityInStock());
        dto.setTrackQuantity(product.getTrackQuantity());
        dto.setWeight(product.getWeight());
        dto.setDimensions(product.getDimensions());
        dto.setCategory(product.getCategory());
        dto.setTags(product.getTags());
        dto.setImages(product.getImages());
        dto.setStatus(product.getStatus());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setMetaTitle(product.getMetaTitle());
        dto.setMetaDescription(product.getMetaDescription());
        dto.setSearchKeywords(product.getSearchKeywords());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    private OrderDto convertOrderToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getCustomerId());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setStatus(order.getStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setShippingAmount(order.getShippingAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCurrency(order.getCurrency());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStripePaymentIntentId(order.getStripePaymentIntentId());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setBillingAddress(order.getBillingAddress());
        dto.setNotes(order.getNotes());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setShippedAt(order.getShippedAt());
        dto.setDeliveredAt(order.getDeliveredAt());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}
