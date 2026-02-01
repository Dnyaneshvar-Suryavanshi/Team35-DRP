package com.cdac.RationSahayata.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cdac.RationSahayata.config.SecurityConfig;
import com.cdac.RationSahayata.dto.MonthlyEntitlementDto;
import com.cdac.RationSahayata.dto.ShopApprovalDto;
import com.cdac.RationSahayata.dto.StockAllocationDto;
import com.cdac.RationSahayata.service.AdminService;

import org.springframework.web.bind.annotation.RequestBody;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@GetMapping("/pending-shopkeeper-list")
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<Map<String, Object>>> getPendingShopkeepers() {
		List<Map<String, Object>> pending = adminService.getPendingShopkeepers();
		System.out.println("ADMIN API HIT");
		return ResponseEntity.ok(pending);
	}

	@GetMapping("/shopkeeper-list")
	public ResponseEntity<List<Map<String, Object>>> getAllShopkeepers() {
		List<Map<String, Object>> allActiveShopkeepers = adminService.getAllActiveShopkeepers();
		System.out.println("ADMIN API HIT");
		return ResponseEntity.ok(allActiveShopkeepers);
	}

	@PutMapping("/approve/{shopkeeperId}")
	public ResponseEntity<Map<String, Object>> approveShopkeeper(@PathVariable Integer shopkeeperId) {
		Map<String, Object> response = adminService.approveShopkeeper(shopkeeperId);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/suspend/{shopkeeperId}")
	public ResponseEntity<Map<String, Object>> suspendShopkeeper(@PathVariable Integer shopkeeperId) {
		Map<String, Object> responce = adminService.suspendShopkeeper(shopkeeperId);
		return ResponseEntity.ok(responce);

		// Jai Maharashtra
		// hello this is 2nd chech
	}

	@PostMapping("/create-shop/{shopkeeperId}")
	public ResponseEntity<Map<String, Object>> createShopForShopkeeper(@PathVariable Integer shopkeeperId,
			@Valid @RequestBody ShopApprovalDto dto) {
		Map<String, Object> response = adminService.createShopForShopkeeper(shopkeeperId, dto);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/all-shops")
	public ResponseEntity<List<Map<String, Object>>> getAllShops() {
		List<Map<String, Object>> shops = adminService.getAllShops();
		return ResponseEntity.ok(shops);
	}

	// sticks controllers
	@PostMapping("/allocate")
	public ResponseEntity<Map<String, Object>> allocateStock(@Valid @RequestBody StockAllocationDto dto) {
		Map<String, Object> response = adminService.allocateStock(dto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/allocation-details")
	public ResponseEntity<List<Map<String, Object>>> getAllAllocations() {
		List<Map<String, Object>> allocations = adminService.getAllAllocations();
		return ResponseEntity.ok(allocations);
	}

	// setting of entitlements
	@PostMapping("/create-entitlement")

	public ResponseEntity<Map<String, Object>> createEntitlement(@Valid @RequestBody MonthlyEntitlementDto dto) {
		Map<String, Object> response = adminService.createEntitlement(dto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/entitlements")

	public ResponseEntity<List<Map<String, Object>>> getAllEntitlements() {
		List<Map<String, Object>> entitlements = adminService.getAllEntitlements();
		return ResponseEntity.ok(entitlements);
	}

	@PutMapping("/update-entitlement")

	public ResponseEntity<Map<String, Object>> updateEntitlement(@Valid @RequestBody MonthlyEntitlementDto dto) {
		Map<String, Object> response = adminService.updateEntitlement(dto);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/delete-entitlement/{entitlementId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Map<String, Object>> deleteEntitlement(@PathVariable Integer entitlementId) {
		Map<String, Object> response = adminService.deleteEntitlement(entitlementId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/all-families")
	public ResponseEntity<List<Map<String, Object>>> getAllFamilies() {
		List<Map<String, Object>> families = adminService.getAllFamilies();
		return ResponseEntity.ok(families);
	}

	@GetMapping("/distribution-logs")
	public ResponseEntity<List<Map<String, Object>>> getAllDistributionLogs() {
		List<Map<String, Object>> logs = adminService.getAllDistributionLogs();
		return ResponseEntity.ok(logs);
	}
}
