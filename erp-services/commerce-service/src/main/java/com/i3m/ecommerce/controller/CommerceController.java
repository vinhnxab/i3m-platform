package com.i3m.core.commerce.controller;

import com.i3m.core.commerce.dto.ProductDto;
import com.i3m.core.commerce.dto.OrderDto;
import com.i3m.core.commerce.service.CommerceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/core/commerce")
@CrossOrigin(origins = "*")
public class CommerceController {

    @Autowired
    private CommerceService commerceService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "E-commerce Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody ProductDto productDto) {
        ProductDto created = ecommerceService.createProduct(tenantId, productDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<ProductDto> products = ecommerceService.getProducts(tenantId, category, status, search, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDto> getProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        ProductDto product = ecommerceService.getProduct(tenantId, id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody ProductDto productDto) {
        ProductDto updated = ecommerceService.updateProduct(tenantId, id, productDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        ecommerceService.deleteProduct(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/products/{id}/inventory")
    public ResponseEntity<ProductDto> updateInventory(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam Integer quantity) {
        ProductDto updated = ecommerceService.updateInventory(tenantId, id, quantity);
        return ResponseEntity.ok(updated);
    }

    // Order Management
    @PostMapping("/orders")
    public ResponseEntity<OrderDto> createOrder(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody OrderDto orderDto) {
        OrderDto created = ecommerceService.createOrder(tenantId, orderDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> getOrders(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerEmail,
            Pageable pageable) {
        Page<OrderDto> orders = ecommerceService.getOrders(tenantId, status, customerEmail, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        OrderDto order = ecommerceService.getOrder(tenantId, id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String status) {
        OrderDto updated = ecommerceService.updateOrderStatus(tenantId, id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/orders/{id}/tracking")
    public ResponseEntity<OrderDto> updateTracking(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String trackingNumber) {
        OrderDto updated = ecommerceService.updateTracking(tenantId, id, trackingNumber);
        return ResponseEntity.ok(updated);
    }

    // Analytics & Reports
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = ecommerceService.getDashboardData(tenantId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/sales")
    public ResponseEntity<Map<String, Object>> getSalesAnalytics(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String period) {
        Map<String, Object> analytics = ecommerceService.getSalesAnalytics(tenantId, period);
        return ResponseEntity.ok(analytics);
    }

    // Cart Management (for public API)
    @PostMapping("/public/cart/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam UUID productId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String sessionId) {
        Map<String, Object> result = ecommerceService.addToCart(productId, quantity, sessionId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/public/cart/{sessionId}")
    public ResponseEntity<Map<String, Object>> getCart(@PathVariable String sessionId) {
        Map<String, Object> cart = ecommerceService.getCart(sessionId);
        return ResponseEntity.ok(cart);
    }
}
