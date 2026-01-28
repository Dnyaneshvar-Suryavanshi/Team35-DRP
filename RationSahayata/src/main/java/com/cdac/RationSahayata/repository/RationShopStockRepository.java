package com.cdac.RationSahayata.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.RationSahayata.Entities.RationShop;
import com.cdac.RationSahayata.Entities.RationShopStock;
import com.cdac.RationSahayata.Enums.GrainType;

public interface RationShopStockRepository extends JpaRepository<RationShopStock, Integer> {
	Optional<RationShopStock> findByShopAndGrain(RationShop shop, GrainType grain);

}
