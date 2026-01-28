package com.cdac.RationSahayata.serviceImpl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.RationSahayata.Entities.MonthlyEntitlement;
import com.cdac.RationSahayata.Entities.RationCard;
import com.cdac.RationSahayata.Entities.RationDistributionLog;
import com.cdac.RationSahayata.Entities.RationShop;
import com.cdac.RationSahayata.Entities.RationShopStock;
import com.cdac.RationSahayata.Entities.StockAllocation;
import com.cdac.RationSahayata.Entities.User;
import com.cdac.RationSahayata.Enums.AllocationStatus;
import com.cdac.RationSahayata.Enums.ShopStatus;
import com.cdac.RationSahayata.Enums.UserRole;
import com.cdac.RationSahayata.Enums.UserStatus;
import com.cdac.RationSahayata.dto.MonthlyEntitlementDto;
import com.cdac.RationSahayata.dto.ShopApprovalDto;
import com.cdac.RationSahayata.dto.StockAllocationDto;
import com.cdac.RationSahayata.exception.BadRequestException;
import com.cdac.RationSahayata.exception.UnauthorizedException;
import com.cdac.RationSahayata.repository.*;
import com.cdac.RationSahayata.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {
	
	@Autowired 
	private UserRepository userRepository;
	
	@Autowired 
	private RationShopRepository rationShopRepository;
	 @Autowired
	    private MonthlyEntitlementRepository monthlyEntitlementRepository;

	    @Autowired
	    private StockAllocationRepository stockAllocationRepository;

	    @Autowired
	    private RationShopStockRepository rationShopStockRepository;

	    @Autowired
	    private RationCardRepository rationCardRepository;

	    @Autowired
	    private RationDistributionLogRepository distributionLogRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;
	
	//Pending shopkeeper 
	@Override
	public List<Map<String, Object>> getPendingShopkeepers() {
		List<User> allShopkeepers = userRepository.findAll();
		List<Map<String, Object>> result = new ArrayList<>();
		
		for(User u:allShopkeepers) {
			if(u.getRole()==UserRole.SHOPKEEPER && u.getStatus()==UserStatus.Inactive) {
				
				 Map<String, Object> map = new HashMap<>();
		            map.put("userId", u.getUserId());
		            map.put("name", u.getName());
		            map.put("email", u.getEmail());
		            map.put("status", u.getStatus().toString());
		            map.put("createdAt", u.getCreatedAt());
		            
		            result.add(map);
				
			}
		}
		return result;
	}

	@Override
	public List<Map<String, Object>> getAllActiveShopkeepers() {
		
		List<User> allShopkeepers = userRepository.findAll();
		List<Map<String, Object>> result = new ArrayList<>();
		
		for(User u:allShopkeepers) {
			if(u.getRole()==UserRole.SHOPKEEPER && u.getStatus()==UserStatus.Active) {
				
				 Map<String, Object> map = new HashMap<>();
		            map.put("userId", u.getUserId());
		            map.put("name", u.getName());
		            map.put("email", u.getEmail());
		            map.put("status", u.getStatus().toString());
		            map.put("createdAt", u.getCreatedAt());
		            
		            result.add(map);
				
			}
		}
		return result;
	}
	
	// approve shopkeeper 
	@Override
	public Map<String, Object> approveShopkeeper(Integer shopkeeperId) {
		User shopkeeper = userRepository.findById(shopkeeperId)
                .orElseThrow(() -> new BadRequestException("Shopkeeper not found"));

        if (shopkeeper.getRole() != UserRole.SHOPKEEPER) {
            throw new BadRequestException("User is not a shopkeeper");
        }

        shopkeeper.setStatus(UserStatus.Active);
        userRepository.save(shopkeeper);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Shopkeeper approved successfully");
        return response;
	}

	
	@Override
	public Map<String, Object> suspendShopkeeper(Integer shopkeeperId) {
		User shopkeeper = userRepository.findById(shopkeeperId).
				orElseThrow(()-> new BadRequestException("Shopkeeper not found"));
		if (shopkeeper.getRole() != UserRole.SHOPKEEPER) {
            throw new BadRequestException("User is not a shopkeeper");
        }
		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
                .orElseThrow(() -> new BadRequestException("Shop not found for this shopkeeper"));

        String actionMessage;

        if (shop.getStatus() == ShopStatus.SUSPENDED && shopkeeper.getStatus() == UserStatus.Suspended) {
            shopkeeper.setStatus(UserStatus.Active);
            shop.setStatus(ShopStatus.ACTIVE);
            actionMessage = "Shopkeeper activated successfully";
        } else {
            shopkeeper.setStatus(UserStatus.Suspended);
            shop.setStatus(ShopStatus.SUSPENDED);
            actionMessage = "Shopkeeper suspended successfully";
        }

        userRepository.save(shopkeeper);
        rationShopRepository.save(shop);

        Map<String, Object> response = new HashMap<>();
        response.put("message", actionMessage);
        return response;
	}

	@Override
	public Map<String, Object> createShopForShopkeeper(Integer shopkeeperId, ShopApprovalDto dto) {
		User shopkeeper = userRepository.findById(shopkeeperId)
                .orElseThrow(() -> new BadRequestException("Shopkeeper not found or not active"));

        if (shopkeeper.getRole() != UserRole.SHOPKEEPER || shopkeeper.getStatus() != UserStatus.Active) {
            throw new BadRequestException("Shopkeeper not found or not active");
        }

        if (rationShopRepository.existsByShopkeeperId(shopkeeperId)) {
            throw new BadRequestException("Shop already exists for this shopkeeper");
        }

        RationShop shop = new RationShop();
        shop.setShopName(dto.getShopName());
        shop.setLocation(dto.getLocation());
        shop.setShopkeeperId(shopkeeperId);
        shop.setStatus(ShopStatus.ACTIVE);

        RationShop savedShop = rationShopRepository.save(shop);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Shop created successfully");
        response.put("shop", savedShop);
        return response;
	}

	@Override
	public List<Map<String, Object>> getAllShops() {
		List<RationShop> shops = rationShopRepository.findAll();

        return shops.stream().map(s -> {
            User shopkeeper = userRepository.findById(s.getShopkeeperId()).orElse(null);
            
            Map<String, Object> map = new HashMap<>();
            map.put("shopId", s.getShopId());
            map.put("shopName", s.getShopName());
            map.put("location", s.getLocation());
            map.put("shopkeeperId", s.getShopkeeperId());
            map.put("shopkeeperName", shopkeeper != null ? shopkeeper.getName() : "N/A");
            map.put("shopkeeperEmail", shopkeeper != null ? shopkeeper.getEmail() : "N/A");
            map.put("status", s.getStatus().toString());
            map.put("createdAt", s.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
		
	}

	@Override
	public Map<String, Object> allocateStock(StockAllocationDto dto) {
		 // Verify admin credentials
        User admin = userRepository.findByEmail(dto.getAdminEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid admin credentials"));

        if (!passwordEncoder.matches(dto.getAdminPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Invalid admin credentials");
        }

        if (admin.getRole() != UserRole.ADMIN || admin.getStatus() != UserStatus.Active) {
            throw new UnauthorizedException("Invalid admin credentials");
        }

        // Verify shop exists
        RationShop shop = rationShopRepository.findById(dto.getShopId())
                .orElseThrow(() -> new BadRequestException("Shop not found"));

     // Create allocation record
        StockAllocation allocation = new StockAllocation();
        allocation.setShop(shop); 
        allocation.setMonthYear(dto.getMonthYear());
        allocation.setGrain(dto.getGrain());
        allocation.setQuantityAllocated(dto.getQuantityAllocated());
        allocation.setAdmin(admin);
        allocation.setStatus(AllocationStatus.COMPLETED);

        StockAllocation savedAllocation = stockAllocationRepository.save(allocation);

        // Update shop stock
        Optional<RationShopStock> existingStock =
                rationShopStockRepository.findByShopAndGrain(shop, dto.getGrain());


        if (existingStock.isPresent()) {
            RationShopStock stock = existingStock.get();
            stock.setAvailableStock(
                    stock.getAvailableStock() + dto.getQuantityAllocated()
                );	
            rationShopStockRepository.save(stock);
        } else {
            RationShopStock newStock = new RationShopStock();
            newStock.setShop(shop);
            newStock.setGrain(dto.getGrain());
            newStock.setAvailableStock(dto.getQuantityAllocated());
            rationShopStockRepository.save(newStock);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Stock allocated successfully");
        
        Map<String, Object> allocationData = new HashMap<>();
        allocationData.put("allocationId", savedAllocation.getAllocationId());
//        allocationData.put("shopId", savedAllocation.getShopId());
        allocationData.put("shopName", shop.getShopName());
        allocationData.put("monthYear", savedAllocation.getMonthYear());
        allocationData.put("grain", savedAllocation.getGrain().toString());
        allocationData.put("quantityAllocated", savedAllocation.getQuantityAllocated());
        allocationData.put("allocatedBy", admin.getName());
        allocationData.put("status", savedAllocation.getStatus().toString());
        allocationData.put("allocatedDate", savedAllocation.getAllocatedDate());
        
        response.put("allocation", allocationData);
        return response;
	}

	@Override
	public List<Map<String, Object>> getAllAllocations() {
		 List<StockAllocation> allocations = stockAllocationRepository.findAll();

	        return allocations.stream()
	                .sorted(Comparator.comparing(StockAllocation::getAllocatedDate).reversed())
	                .map(a -> {
	                	RationShop shop = a.getShop();   
	                    User admin = a.getAdmin(); 

	                    Map<String, Object> map = new HashMap<>();
	                    map.put("allocationId", a.getAllocationId());
	                    map.put("shopId", shop.getShopId());
	                    map.put("shopName", shop != null ? shop.getShopName() : "N/A");
	                    map.put("monthYear", a.getMonthYear());
	                    map.put("grain", a.getGrain().toString());
	                    map.put("quantityAllocated", a.getQuantityAllocated());
	                    map.put("status", a.getStatus().toString());
	                    map.put("allocatedBy", admin != null ? admin.getName() : "N/A");
	                    map.put("allocatedDate", a.getAllocatedDate());
	                    return map;
	                }).collect(Collectors.toList());
	}

	@Override
	public Map<String, Object> createEntitlement(MonthlyEntitlementDto dto) {
		if (monthlyEntitlementRepository.existsByGrain(dto.getGrain())) {
            throw new BadRequestException("Entitlement for " + dto.getGrain() + " already exists");
        }

        MonthlyEntitlement entitlement = new MonthlyEntitlement();
        entitlement.setGrain(dto.getGrain());
        entitlement.setQuantityPerPerson(dto.getQuantityPerPerson());

        monthlyEntitlementRepository.save(entitlement);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Entitlement created successfully");
        return response;
	}

	@Override
	public List<Map<String, Object>> getAllEntitlements() {
		List<MonthlyEntitlement> entitlements = monthlyEntitlementRepository.findAll();

        return entitlements.stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("entitlementId", e.getEntitlementId());
            map.put("grain", e.getGrain().toString());
            map.put("quantityPerPerson", e.getQuantityPerPerson());
            return map;
        }).collect(Collectors.toList());
	}

	@Override
	public Map<String, Object> updateEntitlement(MonthlyEntitlementDto dto) {
		MonthlyEntitlement entitlement = monthlyEntitlementRepository.findByGrain(dto.getGrain())
                .orElseThrow(() -> new BadRequestException("Entitlement for " + dto.getGrain() + " not found"));

        entitlement.setQuantityPerPerson(dto.getQuantityPerPerson());
        monthlyEntitlementRepository.save(entitlement);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Entitlement updated successfully");
        
        Map<String, Object> changes = new HashMap<>();
        changes.put("grain", dto.getGrain().toString());
        changes.put("newQuantity", dto.getQuantityPerPerson());
        
        response.put("Updated", changes);
        return response;
	}

	@Override
	public List<Map<String, Object>> getAllFamilies() {
		List<RationCard> families = rationCardRepository.findAll();

        return families.stream().map(r -> {
        	User citizen = r.getCitizen();     
            RationShop shop = r.getShop();

            Map<String, Object> map = new HashMap<>();
            map.put("cardNumber", r.getCardNumber());
            map.put("headOfFamilyName", r.getHeadOfFamilyName());
            map.put("familyMemberCount", r.getFamilyMemberCount());
            map.put("address", r.getAddress());
            map.put("shopName",  shop.getShopName());
            map.put("citizenName",  citizen.getName() );
            map.put("citizenEmail", citizen.getEmail());
            map.put("status", r.getStatus().toString());
            map.put("issueDate", r.getIssueDate());
            return map;
        }).collect(Collectors.toList());
	}

	@Override
	public List<Map<String, Object>> getAllDistributionLogs() {
		List<RationDistributionLog> logs = distributionLogRepository.findAll();

        return logs.stream()
                .sorted(Comparator.comparing(RationDistributionLog::getDistributionDate).reversed())
                .map(d -> {
                    RationCard rationCard = rationCardRepository.findById(d.getCardNumber()).orElse(null);
                    RationShop shop = rationShopRepository.findById(d.getShopId()).orElse(null);

                    Map<String, Object> map = new HashMap<>();
                    map.put("distributionId", d.getDistributionId());
                    map.put("cardNumber", d.getCardNumber());
                    map.put("headOfFamily",  rationCard.getHeadOfFamilyName() );
                    map.put("shopName",  shop.getShopName() );
                    map.put("grain", d.getGrain().toString());
                    map.put("quantityGiven", d.getQuantityGiven());
                    map.put("distributionMonth", d.getDistributionMonth());
                    map.put("distributionDate", d.getDistributionDate());
                    map.put("status", d.getStatus().toString());
                    return map;
                }).collect(Collectors.toList());
	}

	

}
