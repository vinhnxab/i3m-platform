package com.i3m.healthcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HealthcareServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthcareServiceApplication.class, args);
    }
}
