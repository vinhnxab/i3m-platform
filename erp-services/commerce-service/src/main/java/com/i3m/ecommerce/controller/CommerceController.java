package com.i3m.ecommerce.controller;

import com.i3m.ecommerce.dto.ProductDto;
import com.i3m.ecommerce.dto.OrderDto;
import com.i3m.ecommerce.service.CommerceService;
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
            "service", "Commerce Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody ProductDto productDto) {
        ProductDto created = commerceService.createProduct(productDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<ProductDto> products = commerceService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDto> getProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        ProductDto product = commerceService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody ProductDto productDto) {
        ProductDto updated = commerceService.updateProduct(id, productDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        commerceService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/products/{id}/inventory")
    public ResponseEntity<ProductDto> updateInventory(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam Integer quantity) {
        ProductDto updated = commerceService.updateProduct(id, new ProductDto());
        return ResponseEntity.ok(updated);
    }

    // Order Management
    @PostMapping("/orders")
    public ResponseEntity<OrderDto> createOrder(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody OrderDto orderDto) {
        OrderDto created = commerceService.createOrder(orderDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> getOrders(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerEmail,
            Pageable pageable) {
        Page<OrderDto> orders = commerceService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        OrderDto order = commerceService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String status) {
        OrderDto updated = commerceService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/orders/{id}/tracking")
    public ResponseEntity<OrderDto> updateTracking(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String trackingNumber) {
        OrderDto updated = commerceService.updateOrderStatus(id, "tracking_updated");
        return ResponseEntity.ok(updated);
    }

    // Analytics & Reports
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = Map.of("status", "ok");
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/sales")
    public ResponseEntity<Map<String, Object>> getSalesAnalytics(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String period) {
        Map<String, Object> analytics = Map.of("status", "ok");
        return ResponseEntity.ok(analytics);
    }

    // Cart Management (for public API)
    @PostMapping("/public/cart/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam UUID productId,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String sessionId) {
        Map<String, Object> result = Map.of("status", "ok");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/public/cart/{sessionId}")
    public ResponseEntity<Map<String, Object>> getCart(@PathVariable String sessionId) {
        Map<String, Object> cart = Map.of("status", "ok");
        return ResponseEntity.ok(cart);
    }
}
