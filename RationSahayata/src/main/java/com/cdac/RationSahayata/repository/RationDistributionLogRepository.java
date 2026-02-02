package com.cdac.RationSahayata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.RationSahayata.Entities.RationDistributionLog;
import com.cdac.RationSahayata.Entities.RationShop;

public interface RationDistributionLogRepository extends JpaRepository<RationDistributionLog, Integer> {
	List<RationDistributionLog> findByShopOrderByDistributionDateDesc(RationShop shop);

	List<RationDistributionLog> findByRationCard_CardNumberOrderByDistributionDateDesc(String cardNumber);

	List<RationDistributionLog> findByShop_ShopIdOrderByDistributionDateDesc(Integer shopId);

	boolean existsByRationCardAndGrainAndDistributionMonthAndStatus(
			com.cdac.RationSahayata.Entities.RationCard rationCard,
			com.cdac.RationSahayata.Enums.GrainType grain,
			String distributionMonth,
			com.cdac.RationSahayata.Enums.DistributionStatus status);

	boolean existsByRationCard_CardNumberAndDistributionMonth(String cardNumber, String distributionMonth);

}
