package com.cdac.RationSahayata.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cdac.RationSahayata.config.SecurityConfig;
import com.cdac.RationSahayata.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

	
	@Autowired
	private AdminService adminService;
	
	
	@GetMapping("/pending-shopkeeper-list")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<Map<String, Object>>> getPendingShopkeepers(){
		List<Map<String, Object>> pending = adminService.getPendingShopkeepers();
		System.out.println("ADMIN API HIT");
		return ResponseEntity.ok(pending);
	}
	
	
	@GetMapping("/shopkeeper-list")
	public ResponseEntity<List<Map<String, Object>>> getAllShopkeepers(){
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
	public ResponseEntity<Map<String,Object>> suspendShopkeeper(@PathVariable Integer shopkeeperId){
		Map<String,Object> responce = adminService.suspendShopkeeper(shopkeeperId);
		return ResponseEntity.ok(responce);
		
		// Jai Maharashtra
	}
	

}
