package com.i3m.commerce.service;

import com.i3m.commerce.dto.ProductDto;
import com.i3m.commerce.dto.OrderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CommerceService {
    
    // Product Management
    ProductDto createProduct(ProductDto productDto);
    ProductDto getProductById(UUID id);
    Page<ProductDto> getAllProducts(Pageable pageable);
    ProductDto updateProduct(UUID id, ProductDto productDto);
    void deleteProduct(UUID id);
    List<ProductDto> searchProducts(String query);
    
    // Order Management
    OrderDto createOrder(OrderDto orderDto);
    OrderDto getOrderById(UUID id);
    Page<OrderDto> getAllOrders(Pageable pageable);
    OrderDto updateOrder(UUID id, OrderDto orderDto);
    void deleteOrder(UUID id);
    List<OrderDto> getOrdersByCustomerId(UUID customerId);
    OrderDto updateOrderStatus(UUID id, String newStatus);
    OrderDto updatePaymentStatus(UUID id, String newStatus);
}
