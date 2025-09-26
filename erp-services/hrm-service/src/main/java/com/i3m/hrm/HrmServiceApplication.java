package com.i3m.hrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HrmServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HrmServiceApplication.class, args);
    }
}
