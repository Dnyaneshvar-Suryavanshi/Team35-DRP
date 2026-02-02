package com.cdac.RationSahayata.service;

import com.cdac.RationSahayata.dto.*;

import java.util.List;
import java.util.Map;

public interface ShopkeeperService {

	Map<String, Object> getMyShop(Integer shopkeeperId);

	Map<String, Object> addCitizen(Integer shopkeeperId, AddCitizenDto dto);

	List<Map<String, Object>> getCitizens(Integer shopkeeperId);

	Map<String, Object> deleteCitizen(Integer shopkeeperId, String citizenEmail);

	Map<String, Object> updateCitizen(Integer shopkeeperId, String cardNumber, UpdateCitizenDto dto);

	List<Map<String, Object>> getStockAllocations(Integer shopkeeperId);

	List<Map<String, Object>> viewCurrentStock(Integer shopId);

	Map<String, Object> generateOtp(GenerateOtpDto dto);

	List<Map<String, Object>> distributionHistory(Integer shopkeeperId);

	Map<String, Object> distributeRation(DistributeRationDto dto);

	Map<String, Object> checkRationStatus(String cardNumber);
}
