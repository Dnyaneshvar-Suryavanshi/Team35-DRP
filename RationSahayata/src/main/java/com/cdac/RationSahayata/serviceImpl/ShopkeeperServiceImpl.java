package com.cdac.RationSahayata.serviceImpl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.cdac.RationSahayata.Entities.MonthlyEntitlement;
import com.cdac.RationSahayata.Entities.Otp;
import com.cdac.RationSahayata.Entities.RationCard;
import com.cdac.RationSahayata.Entities.RationDistributionLog;
import com.cdac.RationSahayata.Entities.RationShop;
import com.cdac.RationSahayata.Entities.RationShopStock;
import com.cdac.RationSahayata.Entities.StockAllocation;
import com.cdac.RationSahayata.Entities.User;
import com.cdac.RationSahayata.Enums.*;

import com.cdac.RationSahayata.dto.AddCitizenDto;
import com.cdac.RationSahayata.dto.DistributeRationDto;
import com.cdac.RationSahayata.dto.GenerateOtpDto;
import com.cdac.RationSahayata.dto.UpdateCitizenDto;
import com.cdac.RationSahayata.exception.ResourceNotFoundException;
import com.cdac.RationSahayata.repository.MonthlyEntitlementRepository;
import com.cdac.RationSahayata.repository.OtpRepository;
import com.cdac.RationSahayata.repository.RationCardRepository;
import com.cdac.RationSahayata.repository.RationDistributionLogRepository;
import com.cdac.RationSahayata.repository.RationShopRepository;
import com.cdac.RationSahayata.repository.RationShopStockRepository;
import com.cdac.RationSahayata.repository.StockAllocationRepository;
import com.cdac.RationSahayata.repository.UserRepository;
import com.cdac.RationSahayata.service.EmailService;
import com.cdac.RationSahayata.service.ShopkeeperService;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.transaction.Transactional;

@Service
public class ShopkeeperServiceImpl implements ShopkeeperService {

	private final UserRepository userRepository;
	private final RationShopRepository rationShopRepository;
	private final RationCardRepository rationCardRepository;
	private final MonthlyEntitlementRepository monthlyEntitlementRepository;
	private final StockAllocationRepository stockAllocationRepository;
	private final RationShopStockRepository rationShopStockRepository;
	private final RationDistributionLogRepository distributionLogRepository;
	private final OtpRepository otpRepository;
	private final EmailService emailService;
	private final com.cdac.RationSahayata.repository.PaymentRepository paymentRepository;

	public ShopkeeperServiceImpl(UserRepository userRepo, RationShopRepository shopRepo, RationCardRepository cardRepo,
			MonthlyEntitlementRepository entitlementRepo, StockAllocationRepository stockAllocationRepo,
			RationShopStockRepository shopStockRepo, RationDistributionLogRepository distributionLogRepo,
			OtpRepository otpRepository, EmailService emailService,
			com.cdac.RationSahayata.repository.PaymentRepository paymentRepo) {
		this.userRepository = userRepo;
		this.rationShopRepository = shopRepo;
		this.rationCardRepository = cardRepo;
		this.monthlyEntitlementRepository = entitlementRepo;
		this.stockAllocationRepository = stockAllocationRepo;
		this.rationShopStockRepository = shopStockRepo;
		this.distributionLogRepository = distributionLogRepo;
		this.otpRepository = otpRepository;
		this.emailService = emailService;
		this.paymentRepository = paymentRepo;

	}

	// get shopkkeper SHOP
	@Override
	public Map<String, Object> getMyShop(Integer shopkeeperId) {

		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		Map<String, Object> map = new HashMap<>();
		map.put("shopId", shop.getShopId());
		map.put("shopName", shop.getShopName());
		map.put("location", shop.getLocation());
		map.put("status", shop.getStatus());
		map.put("createdAt", shop.getCreatedAt());

		return map;
	}

	// add citizen
	@Override
	@Transactional
	public Map<String, Object> addCitizen(Integer shopkeeperId, AddCitizenDto dto) {

		// 1Getshopkeeper
		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("You don't have a shop. Contact admin."));

		// Find citizen
		User citizen = userRepository.findByEmail(dto.getCitizenEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));

		if (citizen.getRole() != UserRole.CITIZEN ||
				citizen.getStatus() != UserStatus.Active) {
			throw new ResourceNotFoundException("Citizen not found or not active");
		}

		// Check if citizen already has ration card
		if (rationCardRepository.existsByCitizen(citizen)) {
			throw new ResourceNotFoundException("This citizen already has a ration card");
		}

		// 5 Check duplicate card number
		if (rationCardRepository.existsById(dto.getCardNumber())) {
			throw new ResourceNotFoundException("This card number already exists");
		}

		// Create ration card
		RationCard rationCard = new RationCard();
		rationCard.setCardNumber(dto.getCardNumber());
		rationCard.setCitizen(citizen);
		rationCard.setHeadOfFamilyName(dto.getHeadOfFamilyName());
		rationCard.setFamilyMemberCount(dto.getFamilyMemberCount());
		rationCard.setAddress(dto.getAddress());
		rationCard.setShop(shop);
		rationCard.setStatus(RationCardStatus.VERIFIED);

		RationCard savedCard = rationCardRepository.save(rationCard);

		// Prepare response
		Map<String, Object> response = new HashMap<>();
		response.put("message", "Citizen verified and added successfully");

		Map<String, Object> cardData = new HashMap<>();
		cardData.put("cardNumber", savedCard.getCardNumber());
		cardData.put("headOfFamilyName", savedCard.getHeadOfFamilyName());
		cardData.put("familyMemberCount", savedCard.getFamilyMemberCount());
		cardData.put("address", savedCard.getAddress());
		cardData.put("citizenEmail", citizen.getEmail());
		cardData.put("citizenName", citizen.getName());
		cardData.put("shopName", shop.getShopName());
		cardData.put("shopLocation", shop.getLocation());
		cardData.put("issueDate", savedCard.getIssueDate());
		cardData.put("status", savedCard.getStatus());

		response.put("rationCard", cardData);
		return response;
	}

	// get citizens under that shopkeeper
	@Override
	public List<Map<String, Object>> getCitizens(Integer shopkeeperId) {

		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		List<RationCard> citizens = rationCardRepository.findByShop(shop);

		String currentMonth = java.time.LocalDateTime.now()
				.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
		java.time.LocalDateTime now = java.time.LocalDateTime.now();
		java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
		java.time.LocalDateTime endOfMonth = now.withDayOfMonth(now.getMonth().length(now.toLocalDate().isLeapYear()))
				.withHour(23).withMinute(59).withSecond(59);

		return citizens.stream()
				.filter(rc -> {
					// Filter out if already distributed
					boolean isDistributed = distributionLogRepository
							.existsByRationCard_CardNumberAndDistributionMonth(rc.getCardNumber(), currentMonth);
					if (isDistributed)
						return false;

					// Filter out if already paid (even if not distributed yet)
					long paymentsCount = paymentRepository.countByCitizenEmailAndTimestampBetween(
							rc.getCitizen().getEmail(), startOfMonth, endOfMonth);
					if (paymentsCount > 0)
						return false;

					return true;
				})
				.map(rc -> {
					User citizen = rc.getCitizen(); // already loaded reference

					Map<String, Object> map = new HashMap<>();
					map.put("cardNumber", rc.getCardNumber());
					map.put("headOfFamilyName", rc.getHeadOfFamilyName());
					map.put("familyMemberCount", rc.getFamilyMemberCount());
					map.put("address", rc.getAddress());
					map.put("citizenName", citizen.getName());
					map.put("citizenEmail", citizen.getEmail());
					map.put("status", rc.getStatus().toString());
					map.put("issueDate", rc.getIssueDate());

					return map;
				}).collect(Collectors.toList());
	}

	// stock allocation getting
	@Override
	public List<Map<String, Object>> getStockAllocations(Integer shopkeeperId) {

		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		List<StockAllocation> allocations = stockAllocationRepository
				.findByShop_ShopId(shop.getShopId());

		return allocations.stream().map(a -> {
			Map<String, Object> map = new HashMap<>();
			map.put("allocationId", a.getAllocationId());
			map.put("monthYear", a.getMonthYear());
			map.put("grain", a.getGrain().toString());
			map.put("quantityAllocated", a.getQuantityAllocated());
			map.put("status", a.getStatus().toString());
			map.put("allocatedDate", a.getAllocatedDate());
			return map;
		}).collect(Collectors.toList());
	}

	// view current stock
	@Override
	public List<Map<String, Object>> viewCurrentStock(Integer shopId) {

		List<RationShopStock> stocks = rationShopStockRepository.findByShop_ShopId(shopId);

		if (stocks.isEmpty()) {
			throw new ResourceNotFoundException("No stock available");
		}

		return stocks.stream().map(s -> {
			Map<String, Object> map = new HashMap<>();
			map.put("grain", s.getGrain().toString());
			map.put("availableQuantity", s.getAvailableStock());
			map.put("lastUpdated", s.getLastUpdated());
			return map;
		}).collect(Collectors.toList());
	}

	// distribution history
	@Override
	public List<Map<String, Object>> distributionHistory(Integer shopkeeperId) {

		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		List<RationDistributionLog> history = distributionLogRepository
				.findByShop_ShopIdOrderByDistributionDateDesc(shop.getShopId());

		return history.stream().map(d -> {

			RationCard rationCard = d.getRationCard();

			Map<String, Object> map = new HashMap<>();
			map.put("distributionId", d.getDistributionId());
			map.put("cardNumber", rationCard.getCardNumber());
			map.put("headOfFamily",
					rationCard != null ? rationCard.getHeadOfFamilyName() : "N/A");
			map.put("grain", d.getGrain().toString());
			map.put("quantityGiven", d.getQuantityGiven());
			map.put("distributionMonth", d.getDistributionMonth());
			map.put("distributionDate", d.getDistributionDate());
			map.put("status", d.getStatus().toString());

			return map;
		}).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public Map<String, Object> distributeRation(DistributeRationDto dto) {
		// 1. Verify OTP
		Otp otpEntry = otpRepository
				.findTopByCardNumberAndOtpAndIsUsedFalseAndExpiryTimeAfterOrderByCreatedAtDesc(
						dto.getCardNumber(),
						dto.getOtp(),
						LocalDateTime.now())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid or expired OTP"));

		// 2. Get ration card
		RationCard rationCard = rationCardRepository.findById(dto.getCardNumber())
				.orElseThrow(() -> new ResourceNotFoundException("Ration card not found"));

		if (rationCard.getStatus() != RationCardStatus.VERIFIED) {
			throw new ResourceNotFoundException("Ration card not verified");
		}

		// 3. Citizen & Shop
		User citizen = rationCard.getCitizen();
		RationShop shop = rationCard.getShop();

		// 4. Current month
		String distributionMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
		String transactionId = java.util.UUID.randomUUID().toString();

		StringBuilder grainDetailsBuilder = new StringBuilder();
		List<Map<String, Object>> distributions = new java.util.ArrayList<>();

		// 5. Process each grain
		for (com.cdac.RationSahayata.Enums.GrainType grain : dto.getGrains()) {
			// a. Monthly limit check
			boolean alreadyTaken = distributionLogRepository.existsByRationCardAndGrainAndDistributionMonthAndStatus(
					rationCard, grain, distributionMonth, DistributionStatus.SUCCESS);
			if (alreadyTaken) {
				throw new ResourceNotFoundException(
						grain + " has already been taken for this month (" + distributionMonth + ")");
			}

			// b. Monthly entitlement
			MonthlyEntitlement entitlement = monthlyEntitlementRepository
					.findByGrain(grain)
					.orElseThrow(() -> new ResourceNotFoundException(
							"Monthly entitlement not set for " + grain));

			// c. Calculate quantity
			Double requiredQuantity = entitlement.getQuantityPerPerson() * (rationCard.getFamilyMemberCount());

			// d. Check stock
			RationShopStock shopStock = rationShopStockRepository
					.findByShopAndGrain(shop, grain)
					.orElseThrow(() -> new ResourceNotFoundException("Stock not found for " + grain));

			if (shopStock.getAvailableStock().compareTo(requiredQuantity) < 0) {
				throw new ResourceNotFoundException(
						"Insufficient stock for " + grain + ". Available: " +
								shopStock.getAvailableStock() +
								" kg, Required: " + requiredQuantity + " kg");
			}

			// e. Create distribution log
			RationDistributionLog distributionLog = new RationDistributionLog();
			distributionLog.setRationCard(rationCard);
			distributionLog.setShop(shop);
			distributionLog.setGrain(grain);
			distributionLog.setQuantityGiven(requiredQuantity);
			distributionLog.setDistributionMonth(distributionMonth);
			distributionLog.setStatus(DistributionStatus.SUCCESS);
			distributionLog.setTransactionId(transactionId);

			RationDistributionLog savedLog = distributionLogRepository.save(distributionLog);

			// f. Update stock
			shopStock.setAvailableStock(shopStock.getAvailableStock() - (requiredQuantity));
			rationShopStockRepository.save(shopStock);

			// g. Collect info for response and email
			grainDetailsBuilder.append("- ").append(grain).append(": ").append(String.format("%.2f", requiredQuantity))
					.append(" kg\n");

			Map<String, Object> distInfo = new HashMap<>();
			distInfo.put("grain", grain.toString());
			distInfo.put("quantityGiven", requiredQuantity);
			distInfo.put("distributionId", savedLog.getDistributionId());
			distributions.add(distInfo);
		}

		// 6. Mark OTP as used
		otpEntry.setIsUsed(true);
		otpRepository.save(otpEntry);

		// 7. Send consolidated email
		try {
			emailService.sendDistributionSuccessEmail(
					citizen.getEmail(),
					citizen.getName(),
					rationCard.getHeadOfFamilyName(),
					rationCard.getCardNumber(),
					grainDetailsBuilder.toString(),
					distributionMonth,
					shop.getShopName(),
					shop.getLocation());
		} catch (Exception e) {
			System.err.println("Failed to send distribution success email: " + e.getMessage());
		}

		// 8. Response
		Map<String, Object> response = new HashMap<>();
		response.put("message", "Ration distributed successfully and confirmation email sent");
		response.put("citizenName", citizen.getName());
		response.put("headOfFamily", rationCard.getHeadOfFamilyName());
		response.put("cardNumber", rationCard.getCardNumber());
		response.put("distributions", distributions);
		response.put("distributionMonth", distributionMonth);

		return response;
	}

	@Override
	@Transactional
	public Map<String, Object> checkRationStatus(String cardNumber) {
		String currentMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

		// existing distribution check
		boolean isDistributed = distributionLogRepository.existsByRationCard_CardNumberAndDistributionMonth(cardNumber,
				currentMonth);

		// NEW: Payment check
		boolean isPaid = false;
		try {
			RationCard card = rationCardRepository.findById(cardNumber).orElse(null);
			if (card != null && card.getCitizen() != null) {
				String toEmail = card.getCitizen().getEmail();
				java.time.LocalDateTime now = java.time.LocalDateTime.now();
				java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
				java.time.LocalDateTime endOfMonth = now
						.withDayOfMonth(now.getMonth().length(now.toLocalDate().isLeapYear())).withHour(23)
						.withMinute(59).withSecond(59);
				long payCount = paymentRepository.countByCitizenEmailAndTimestampBetween(toEmail, startOfMonth,
						endOfMonth);
				if (payCount > 0)
					isPaid = true;
			}
		} catch (Exception e) {
			System.err.println("Error checking payment status in checkRationStatus: " + e.getMessage());
		}

		Map<String, Object> response = new HashMap<>();
		response.put("cardNumber", cardNumber);
		response.put("month", currentMonth);
		response.put("isDistributed", isDistributed || isPaid);
		// We set isDistributed to true if EITHER is true, so frontend blocks it.

		if (isDistributed) {
			response.put("message", "Ration for this month (" + currentMonth + ") has already been distributed.");
		} else if (isPaid) {
			response.put("message", "Payment for this month (" + currentMonth
					+ ") is already done. Complete OTP verification if pending.");
		} else {
			response.put("message", "Ration not yet taken for this month.");
		}
		return response;
	}

	@Override
	public Map<String, Object> generateOtp(GenerateOtpDto dto) {
		// Check if already distributed this month
		String currentMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
		if (distributionLogRepository.existsByRationCard_CardNumberAndDistributionMonth(dto.getCardNumber(),
				currentMonth)) {
			throw new ResourceNotFoundException(
					"Ration already distributed/paid for this month (" + currentMonth + ")");
		}

		String otpValue = String.format("%06d", new Random().nextInt(999999));

		// Create OTP entry
		Otp otp = new Otp();
		otp.setShopkeeperId(dto.getShopkeeperId());
		otp.setCitizenEmail(dto.getCitizenEmail());
		otp.setCardNumber(dto.getCardNumber());
		otp.setOtp(otpValue);
		otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
		otp.setIsUsed(false);

		otpRepository.save(otp);

		// Send OTP email
		try {
			emailService.sendOtpEmail(dto.getCitizenEmail(), otpValue);
		} catch (Exception e) {
			System.err.println("Failed to send OTP email: " + e.getMessage());
			// For testing/debugging when email fails, we might want to log the OTP
			System.out.println("DEBUG OTP (Email Failed): " + otpValue);
		}

		Map<String, Object> response = new HashMap<>();
		response.put("message", "OTP generated and sent successfully");
		return response;
	}

	@Override
	public Map<String, Object> deleteCitizen(Integer shopkeeperId, String citizenEmail) {
		// Verify shopkeeper has this shop
		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		// Get ration card
		RationCard rationCard = rationCardRepository.findByCitizenEmail(citizenEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Ration card not found"));

		// Compare shopId (Integer) with shopId (Integer)
		if (!rationCard.getShop().getShopId().equals(shop.getShopId())) {
			throw new ResourceNotFoundException("This citizen does not belong to your shop");
		}

		String findCitizenEmail = rationCard.getCitizen().getEmail();
		String headOfFamily = rationCard.getHeadOfFamilyName();

		// Delete ration card
		rationCardRepository.delete(rationCard);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Citizen deleted successfully");
		response.put("citizenEmail", citizenEmail);
		response.put("headOfFamily", headOfFamily);
		return response;
	}

	@Override
	public Map<String, Object> updateCitizen(Integer shopkeeperId, String cardNumber, UpdateCitizenDto dto) {
		// Verify shopkeeper has this shop
		RationShop shop = rationShopRepository.findByShopkeeperId(shopkeeperId)
				.orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

		// Get ration card
		RationCard rationCard = rationCardRepository.findById(cardNumber)
				.orElseThrow(() -> new ResourceNotFoundException("Ration card not found"));

		// Verify card belongs to this shop
		if (!rationCard.getShop().getShopId().equals(shop.getShopId())) {
			throw new ResourceNotFoundException("This citizen does not belong to your shop");
		}

		// Update details
		rationCard.setHeadOfFamilyName(dto.getHeadOfFamilyName());
		rationCard.setFamilyMemberCount(dto.getFamilyMemberCount());
		rationCard.setAddress(dto.getAddress());

		RationCard updatedCard = rationCardRepository.save(rationCard);

		// User citizen = userRepository.findByEmail(rationCard.u).orElse(null);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Citizen details updated successfully");

		Map<String, Object> cardData = new HashMap<>();
		cardData.put("cardNumber", updatedCard.getCardNumber());
		// cardData.put("citizenEmail", updatedCard.getCitizenEmail());
		// cardData.put("citizenName", citizen);
		cardData.put("headOfFamilyName", updatedCard.getHeadOfFamilyName());
		cardData.put("familyMemberCount", updatedCard.getFamilyMemberCount());
		cardData.put("address", updatedCard.getAddress());
		cardData.put("status", updatedCard.getStatus().toString());

		response.put("updatedCitizen", cardData);
		return response;
	}
}
