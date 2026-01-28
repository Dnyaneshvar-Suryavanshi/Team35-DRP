package com.cdac.RationSahayata.Entities;

import java.time.LocalDateTime;


import com.cdac.RationSahayata.Enums.AllocationStatus;
import com.cdac.RationSahayata.Enums.GrainType;

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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@AllArgsConstructor
@RequiredArgsConstructor

@Entity
@Table(name = "stock_allocations")
public class StockAllocation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer allocationId;


	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private RationShop shop;   

	@Column(nullable = false)
	private String monthYear;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private GrainType grain;

	@Column(nullable = false)
	private Double quantityAllocated;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "allocated_by", nullable = false)
	private User admin; // This maps to 'AllocatedBy' FK

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AllocationStatus status;

	@Column(nullable = false)
	private LocalDateTime allocatedDate = LocalDateTime.now();

	
}
