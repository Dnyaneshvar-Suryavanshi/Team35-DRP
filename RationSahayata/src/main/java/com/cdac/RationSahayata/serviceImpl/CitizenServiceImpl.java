package com.cdac.RationSahayata.serviceImpl;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.cdac.RationSahayata.Entities.MonthlyEntitlement;
import com.cdac.RationSahayata.Entities.RationCard;
import com.cdac.RationSahayata.Entities.RationDistributionLog;
import com.cdac.RationSahayata.Entities.RationShop;
import com.cdac.RationSahayata.exception.ResourceNotFoundException;
import com.cdac.RationSahayata.repository.MonthlyEntitlementRepository;
import com.cdac.RationSahayata.repository.RationCardRepository;
import com.cdac.RationSahayata.repository.RationDistributionLogRepository;
import com.cdac.RationSahayata.repository.RationShopRepository;
import com.cdac.RationSahayata.service.CitizenService;

import org.springframework.stereotype.Service;

@Service
public class CitizenServiceImpl implements CitizenService {

	@Autowired
	private RationCardRepository rationCardRepository;

	@Autowired
	private RationShopRepository rationShopRepository;

	@Autowired
	private MonthlyEntitlementRepository monthlyEntitlementRepository;

	@Autowired
	private RationDistributionLogRepository rationDistributionLogRepository;

	@Override
	public Map<String, Object> getMyRationCard(String email) {
		RationCard rationCard = rationCardRepository.findByCitizenEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Ration card not found for this user"));

		RationShop shop = rationCard.getShop();

		Map<String, Object> response = new HashMap<>();
		response.put("cardNumber", rationCard.getCardNumber());
		response.put("headOfFamilyName", rationCard.getHeadOfFamilyName());
		response.put("familyMemberCount", rationCard.getFamilyMemberCount());
		response.put("address", rationCard.getAddress());
		response.put("shopName", shop.getShopName());
		response.put("shopkeeperId", shop.getShopkeeperId());
		response.put("shopLocation", shop.getLocation());
		response.put("status", rationCard.getStatus().toString());
		response.put("issueDate", rationCard.getIssueDate());

		return response;
	}

	@Override
	public List<Map<String, Object>> getEntitlements() {
		List<MonthlyEntitlement> entitlements = monthlyEntitlementRepository.findAll();

		return entitlements.stream().map(e -> {
			Map<String, Object> map = new HashMap<>();
			map.put("entitlementId", e.getEntitlementId());
			map.put("grainType", e.getGrain().toString());
			map.put("quantityPerPerson", e.getQuantityPerPerson());
			return map;
		}).collect(Collectors.toList());
	}

	@Override

	public List<Map<String, Object>> getMyDistributions(String email) {
		// Verify card exists
		RationCard rationCard = rationCardRepository.findByCitizenEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Ration card not found for this user"));

		List<RationDistributionLog> history = rationDistributionLogRepository
				.findByRationCard_CardNumberOrderByDistributionDateDesc(rationCard.getCardNumber());

		return history.stream().map(d -> {
			RationShop shop = d.getShop();

			Map<String, Object> map = new HashMap<>();
			map.put("distributionId", d.getDistributionId());
			map.put("grain", d.getGrain().toString());
			map.put("quantityGiven", d.getQuantityGiven());
			map.put("distributionMonth", d.getDistributionMonth());
			map.put("distributionDate", d.getDistributionDate());
			map.put("shopName", shop.getShopName());
			map.put("shopkeeperId", shop.getShopkeeperId());
			map.put("transactionId", d.getTransactionId());
			map.put("status", d.getStatus().toString());
			return map;
		}).collect(Collectors.toList());
	}

}
