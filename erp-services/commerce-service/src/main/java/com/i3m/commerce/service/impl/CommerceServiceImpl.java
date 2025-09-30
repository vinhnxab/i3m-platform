package com.i3m.commerce.service.impl;

import com.i3m.commerce.dto.OrderDto;
import com.i3m.commerce.dto.ProductDto;
import com.i3m.commerce.model.Order;
import com.i3m.commerce.model.Product;
import com.i3m.commerce.repository.OrderRepository;
import com.i3m.commerce.repository.ProductRepository;
import com.i3m.commerce.service.CommerceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommerceServiceImpl implements CommerceService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setCategory(productDto.getCategory());
        product.setSku(productDto.getSku());
        product.setQuantityInStock(productDto.getQuantityInStock());
        product.setStatus(Product.ProductStatus.valueOf(productDto.getStatus() != null ? productDto.getStatus() : "DRAFT"));
        
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToDto);
    }

    @Override
    public ProductDto updateProduct(UUID id, ProductDto productDto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setCategory(productDto.getCategory());
        product.setSku(productDto.getSku());
        product.setQuantityInStock(productDto.getQuantityInStock());
        
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> searchProducts(String query) {
        // This would need a custom search implementation
        return List.of();
    }

    @Override
    public OrderDto createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setCustomerId(orderDto.getCustomerId());
        order.setTotalAmount(orderDto.getTotalAmount());
        order.setStatus(Order.OrderStatus.valueOf(orderDto.getStatus() != null ? orderDto.getStatus() : "PENDING"));
        
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    @Override
    public OrderDto getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }

    @Override
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::convertToDto);
    }

    @Override
    public OrderDto updateOrder(UUID id, OrderDto orderDto) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(Order.OrderStatus.valueOf(orderDto.getStatus()));
        order.setTotalAmount(orderDto.getTotalAmount());
        
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    @Override
    public void deleteOrder(UUID id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<OrderDto> getOrdersByCustomerId(UUID customerId) {
        List<Order> orders = orderRepository.findAll().stream()
            .filter(order -> order.getCustomerId() != null && order.getCustomerId().equals(customerId))
            .collect(Collectors.toList());
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public OrderDto updateOrderStatus(UUID id, String newStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(Order.OrderStatus.valueOf(newStatus));
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    @Override
    public OrderDto updatePaymentStatus(UUID id, String newStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setPaymentStatus(Order.PaymentStatus.valueOf(newStatus));
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    // Additional methods for CommerceController
    public ProductDto createProduct(UUID tenantId, ProductDto productDto) {
        return createProduct(productDto);
    }

    public Page<ProductDto> getProducts(UUID tenantId, String category, String status, String search, Pageable pageable) {
        return getAllProducts(pageable);
    }

    public ProductDto getProduct(UUID tenantId, UUID id) {
        return getProductById(id);
    }

    public ProductDto updateProduct(UUID tenantId, UUID id, ProductDto productDto) {
        return updateProduct(id, productDto);
    }

    public void deleteProduct(UUID tenantId, UUID id) {
        deleteProduct(id);
    }

    public ProductDto updateInventory(UUID tenantId, UUID id, Integer quantity) {
        // TODO: Implement inventory update
        return new ProductDto();
    }

    public OrderDto createOrder(UUID tenantId, OrderDto orderDto) {
        return createOrder(orderDto);
    }

    public Page<OrderDto> getOrders(UUID tenantId, String status, String customerEmail, Pageable pageable) {
        return getAllOrders(pageable);
    }

    public OrderDto getOrder(UUID tenantId, UUID id) {
        return getOrderById(id);
    }

    public OrderDto updateOrderStatus(UUID tenantId, UUID id, String status) {
        return updateOrderStatus(id, status);
    }

    public OrderDto updateTracking(UUID tenantId, UUID id, String trackingNumber) {
        // TODO: Implement tracking update
        return new OrderDto();
    }

    public Map<String, Object> getDashboardData(UUID tenantId) {
        // TODO: Implement dashboard data
        return Map.of("status", "ok");
    }

    public Map<String, Object> getSalesAnalytics(UUID tenantId, String period) {
        // TODO: Implement sales analytics
        return Map.of("status", "ok");
    }

    public Map<String, Object> addToCart(UUID productId, Integer quantity, String sessionId) {
        // TODO: Implement add to cart
        return Map.of("status", "ok");
    }

    public Map<String, Object> getCart(String sessionId) {
        // TODO: Implement get cart
        return Map.of("status", "ok");
    }
    
    // Helper methods for conversion
    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setSku(product.getSku());
        dto.setQuantityInStock(product.getQuantityInStock());
        dto.setStatus(product.getStatus() != null ? product.getStatus().name() : "DRAFT");
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
    
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomerId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus() != null ? order.getStatus().name() : "PENDING");
        dto.setPaymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "PENDING");
        dto.setShippingAddress(order.getShippingAddress());
        dto.setBillingAddress(order.getBillingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}
