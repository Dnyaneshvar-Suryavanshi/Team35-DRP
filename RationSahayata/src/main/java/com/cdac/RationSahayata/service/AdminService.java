package com.cdac.RationSahayata.service;

import java.util.List;
import java.util.Map;

import com.cdac.RationSahayata.dto.MonthlyEntitlementDto;
import com.cdac.RationSahayata.dto.ShopApprovalDto;
import com.cdac.RationSahayata.dto.StockAllocationDto;

public interface AdminService {

    // shopkeeper related all methods
    List<Map<String, Object>> getPendingShopkeepers();

    List<Map<String, Object>> getAllActiveShopkeepers();

    Map<String, Object> approveShopkeeper(Integer shopkeeperId);

    Map<String, Object> suspendShopkeeper(Integer shopkeeperId);

    // shop related
    Map<String, Object> createShopForShopkeeper(Integer shopkeeperId, ShopApprovalDto dto);

    List<Map<String, Object>> getAllShops();

    // stock Allocation
    Map<String, Object> allocateStock(StockAllocationDto dto);

    List<Map<String, Object>> getAllAllocations();

    // Montrhly Entitilment methods
    Map<String, Object> createEntitlement(MonthlyEntitlementDto dto);

    List<Map<String, Object>> getAllEntitlements();

    Map<String, Object> updateEntitlement(MonthlyEntitlementDto dto);

    Map<String, Object> deleteEntitlement(Integer entitlementId);

    // family

    List<Map<String, Object>> getAllFamilies();

    List<Map<String, Object>> getAllDistributionLogs();
}
