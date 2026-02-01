package com.cdac.RationSahayata.serviceImpl;

import java.time.LocalDateTime;
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

import jakarta.transaction.Transactional;

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

	// Pending shopkeeper
	@Override
	public List<Map<String, Object>> getPendingShopkeepers() {
		List<User> allShopkeepers = userRepository.findAll();
		List<Map<String, Object>> result = new ArrayList<>();

		for (User u : allShopkeepers) {
			if (u.getRole() == UserRole.SHOPKEEPER && u.getStatus() == UserStatus.Inactive) {

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

		for (User u : allShopkeepers) {
			if (u.getRole() == UserRole.SHOPKEEPER && u.getStatus() == UserStatus.Active) {

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

		// Activate the shopkeeper user
		shopkeeper.setStatus(UserStatus.Active);
		shopkeeper = userRepository.save(shopkeeper);

		// Also activate the shop IF it exists
		Optional<RationShop> shopOpt = rationShopRepository.findByShopkeeperId(shopkeeperId);

		String shopStatus = "Not Created";
		if (shopOpt.isPresent()) {
			RationShop shop = shopOpt.get();
			shop.setStatus(ShopStatus.ACTIVE);
			rationShopRepository.save(shop);
			shopStatus = shop.getStatus().toString();
		}

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Shopkeeper approved successfully");
		response.put("shopkeeperId", shopkeeperId);
		response.put("shopkeeperStatus", shopkeeper.getStatus());
		response.put("shopStatus", shopStatus);

		return response;
	}

	@Override
	@Transactional
	public Map<String, Object> suspendShopkeeper(Integer shopkeeperId) {

		User shopkeeper = userRepository.findById(shopkeeperId)
				.orElseThrow(() -> new BadRequestException("Shopkeeper not found"));

		if (shopkeeper.getRole() != UserRole.SHOPKEEPER) {
			throw new BadRequestException("User is not a shopkeeper");
		}

		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new BadRequestException("Shop not found for this shopkeeper"));

		String actionMessage;

		if (shop.getStatus() == ShopStatus.SUSPENDED
				&& shopkeeper.getStatus() == UserStatus.Suspended) {

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
		response.put("shopkeeperId", shopkeeperId);
		response.put("shopkeeperStatus", shopkeeper.getStatus());
		response.put("shopStatus", shop.getStatus());

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
		Optional<RationShopStock> existingStock = rationShopStockRepository.findByShopAndGrain(shop, dto.getGrain());

		if (existingStock.isPresent()) {
			RationShopStock stock = existingStock.get();
			stock.setAvailableStock(
					stock.getAvailableStock() + dto.getQuantityAllocated());
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
		// allocationData.put("shopId", savedAllocation.getShopId());
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
		entitlement.setPricePerKg(dto.getPricePerKg() != null ? dto.getPricePerKg() : 0.0);

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
			map.put("pricePerKg", e.getPricePerKg());
			return map;
		}).collect(Collectors.toList());
	}

	@Override
	public Map<String, Object> updateEntitlement(MonthlyEntitlementDto dto) {
		MonthlyEntitlement entitlement = monthlyEntitlementRepository.findByGrain(dto.getGrain())
				.orElseThrow(() -> new BadRequestException("Entitlement for " + dto.getGrain() + " not found"));

		entitlement.setQuantityPerPerson(dto.getQuantityPerPerson());
		entitlement.setPricePerKg(dto.getPricePerKg() != null ? dto.getPricePerKg() : 0.0);
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
			map.put("shopName", shop.getShopName());
			map.put("citizenName", citizen.getName());
			map.put("citizenEmail", citizen.getEmail());
			map.put("status", r.getStatus().toString());
			map.put("issueDate", r.getIssueDate());
			return map;
		}).collect(Collectors.toList());
	}

	@Override
	public List<Map<String, Object>> getAllDistributionLogs() {
		List<RationDistributionLog> logs = distributionLogRepository.findAll();

		// Group logs by transactionId (if null, use distributionId as a unique key for
		// grouping)
		Map<String, List<RationDistributionLog>> groupedLogs = logs.stream()
				.collect(Collectors.groupingBy(log -> log.getTransactionId() != null ? log.getTransactionId()
						: "SINGLE_" + log.getDistributionId()));

		return groupedLogs.values().stream()
				.map(logGroup -> {
					RationDistributionLog referenceLog = logGroup.get(0);
					RationCard rationCard = referenceLog.getRationCard();
					RationShop shop = referenceLog.getShop();

					// Consolidate grains and quantities
					String combinedGrains = logGroup.stream()
							.map(l -> l.getGrain().toString())
							.collect(Collectors.joining(", "));

					Double totalQuantity = logGroup.stream()
							.mapToDouble(RationDistributionLog::getQuantityGiven)
							.sum();

					Map<String, Object> map = new HashMap<>();
					map.put("distributionId", referenceLog.getDistributionId()); // Using one of the IDs
					map.put("transactionId", referenceLog.getTransactionId());
					map.put("cardNumber", rationCard.getCardNumber());
					map.put("headOfFamily", rationCard.getHeadOfFamilyName());
					map.put("shopName", shop.getShopName());
					map.put("grain", combinedGrains);
					map.put("quantityGiven", totalQuantity);
					map.put("distributionMonth", referenceLog.getDistributionMonth());
					map.put("distributionDate", referenceLog.getDistributionDate());
					map.put("status", referenceLog.getStatus().toString());

					// Optional: add details for tooltip or dropdown
					List<Map<String, Object>> details = logGroup.stream().map(l -> {
						Map<String, Object> dMap = new HashMap<>();
						dMap.put("grain", l.getGrain().toString());
						dMap.put("quantity", l.getQuantityGiven());
						return dMap;
					}).collect(Collectors.toList());
					map.put("items", details);

					return map;
				})
				.sorted((m1, m2) -> ((LocalDateTime) m2.get("distributionDate"))
						.compareTo((LocalDateTime) m1.get("distributionDate")))
				.collect(Collectors.toList());
	}

	@Override
	public Map<String, Object> deleteEntitlement(Integer entitlementId) {
		MonthlyEntitlement entitlement = monthlyEntitlementRepository.findById(entitlementId)
				.orElseThrow(() -> new BadRequestException("Entitlement not found"));

		String grainType = entitlement.getGrain().toString();

		monthlyEntitlementRepository.delete(entitlement);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Entitlement deleted successfully");
		response.put("deletedGrain", grainType);
		return response;
	}

}
