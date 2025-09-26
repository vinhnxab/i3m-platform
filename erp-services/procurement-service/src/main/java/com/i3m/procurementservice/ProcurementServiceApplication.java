package com.i3m.procurementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for I3M Platform Procurement Service
 * 
 * This service handles:
 * - Supplier Management
 * - Purchase Requisitions
 * - Request for Quotations (RFQ)
 * - Purchase Orders
 * - Procurement Analytics
 * - Supplier Performance Evaluation
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableTransactionManagement
public class ProcurementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcurementServiceApplication.class, args);
    }
}
