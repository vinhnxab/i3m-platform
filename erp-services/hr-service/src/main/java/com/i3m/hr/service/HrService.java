package com.i3m.hr.service;

import com.i3m.hr.dto.EmployeeDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class HrService {
    
    // In-memory storage for demo purposes
    private final Map<UUID, EmployeeDto> employees = new HashMap<>();
    
    public HrService() {
        // Initialize with some sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        UUID tenantId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        
        EmployeeDto emp1 = new EmployeeDto();
        emp1.setId(UUID.randomUUID());
        emp1.setFirstName("John");
        emp1.setLastName("Doe");
        emp1.setEmail("john.doe@company.com");
        emp1.setPhone("+1234567890");
        emp1.setTenantId(tenantId);
        emp1.setPosition("Software Engineer");
        emp1.setDepartment("Engineering");
        emp1.setHireDate(LocalDate.now().minusYears(2));
        emp1.setBirthDate(LocalDate.now().minusYears(30));
        emp1.setAddress("123 Main St, City, State");
        emp1.setEmergencyContact("Jane Doe");
        emp1.setEmergencyPhone("+1234567891");
        emp1.setStatus("ACTIVE");
        emp1.setSalary(75000.0);
        emp1.setNotes("Excellent performance");
        emp1.setCreatedAt(LocalDateTime.now());
        emp1.setUpdatedAt(LocalDateTime.now());
        
        employees.put(emp1.getId(), emp1);
        
        EmployeeDto emp2 = new EmployeeDto();
        emp2.setId(UUID.randomUUID());
        emp2.setFirstName("Jane");
        emp2.setLastName("Smith");
        emp2.setEmail("jane.smith@company.com");
        emp2.setPhone("+1234567892");
        emp2.setTenantId(tenantId);
        emp2.setPosition("HR Manager");
        emp2.setDepartment("Human Resources");
        emp2.setHireDate(LocalDate.now().minusYears(3));
        emp2.setBirthDate(LocalDate.now().minusYears(35));
        emp2.setAddress("456 Oak Ave, City, State");
        emp2.setEmergencyContact("Bob Smith");
        emp2.setEmergencyPhone("+1234567893");
        emp2.setStatus("ACTIVE");
        emp2.setSalary(65000.0);
        emp2.setNotes("Team leader");
        emp2.setCreatedAt(LocalDateTime.now());
        emp2.setUpdatedAt(LocalDateTime.now());
        
        employees.put(emp2.getId(), emp2);
    }
    
    public List<EmployeeDto> getAllEmployees(UUID tenantId) {
        return employees.values().stream()
            .filter(emp -> tenantId.equals(emp.getTenantId()))
            .toList();
    }
    
    public EmployeeDto getEmployeeById(UUID id, UUID tenantId) {
        EmployeeDto employee = employees.get(id);
        if (employee != null && tenantId.equals(employee.getTenantId())) {
            return employee;
        }
        return null;
    }
    
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        employeeDto.setId(UUID.randomUUID());
        employeeDto.setCreatedAt(LocalDateTime.now());
        employeeDto.setUpdatedAt(LocalDateTime.now());
        employees.put(employeeDto.getId(), employeeDto);
        return employeeDto;
    }
    
    public EmployeeDto updateEmployee(UUID id, EmployeeDto employeeDto, UUID tenantId) {
        EmployeeDto existing = employees.get(id);
        if (existing != null && tenantId.equals(existing.getTenantId())) {
            employeeDto.setId(id);
            employeeDto.setCreatedAt(existing.getCreatedAt());
            employeeDto.setUpdatedAt(LocalDateTime.now());
            employees.put(id, employeeDto);
            return employeeDto;
        }
        return null;
    }
    
    public boolean deleteEmployee(UUID id, UUID tenantId) {
        EmployeeDto employee = employees.get(id);
        if (employee != null && tenantId.equals(employee.getTenantId())) {
            employees.remove(id);
            return true;
        }
        return false;
    }
    
    public List<EmployeeDto> getEmployeesByDepartment(String department, UUID tenantId) {
        return employees.values().stream()
            .filter(emp -> tenantId.equals(emp.getTenantId()) && 
                          department.equals(emp.getDepartment()))
            .toList();
    }
    
    public List<EmployeeDto> getEmployeesByStatus(String status, UUID tenantId) {
        return employees.values().stream()
            .filter(emp -> tenantId.equals(emp.getTenantId()) && 
                          status.equals(emp.getStatus()))
            .toList();
    }
    
    public Map<String, Object> getEmployeeStats(UUID tenantId) {
        List<EmployeeDto> tenantEmployees = employees.values().stream()
            .filter(emp -> tenantId.equals(emp.getTenantId()))
            .toList();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", tenantEmployees.size());
        stats.put("activeEmployees", tenantEmployees.stream()
            .filter(emp -> "ACTIVE".equals(emp.getStatus()))
            .count());
        stats.put("departments", tenantEmployees.stream()
            .map(EmployeeDto::getDepartment)
            .distinct()
            .count());
        stats.put("averageSalary", tenantEmployees.stream()
            .filter(emp -> emp.getSalary() != null)
            .mapToDouble(EmployeeDto::getSalary)
            .average()
            .orElse(0.0));
        
        return stats;
    }
}
