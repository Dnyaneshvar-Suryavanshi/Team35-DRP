package com.cdac.RationSahayata.Entities;

import java.time.LocalDateTime;

import com.cdac.RationSahayata.Enums.GrainType;
import com.cdac.RationSahayata.Enums.ShopStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "ration_shop_stocks")
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class RationShopStock {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private RationShop shop;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrainType  grain;

    @Column(nullable = false)
    private Double availableStock;

    @Column(nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();

}
