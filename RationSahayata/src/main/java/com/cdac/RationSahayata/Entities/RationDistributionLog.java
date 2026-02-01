package com.cdac.RationSahayata.Entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.cdac.RationSahayata.Enums.DistributionStatus;
import com.cdac.RationSahayata.Enums.GrainType;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ration_distribution_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RationDistributionLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer distributionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "card_number", nullable = false)
	private RationCard rationCard;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shop_id", nullable = false)
	private RationShop shop;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private GrainType grain;

	@Column(nullable = false)
	private Double quantityGiven;

	@Column(nullable = false)
	private String distributionMonth;

	@CreationTimestamp
	private LocalDateTime distributionDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DistributionStatus status;

	@Column(length = 50)
	private String transactionId;

	public Integer getDistributionId() {
		return distributionId;
	}

	public void setDistributionId(Integer distributionId) {
		this.distributionId = distributionId;
	}

	public RationCard getRationCard() {
		return rationCard;
	}

	public void setRationCard(RationCard rationCard) {
		this.rationCard = rationCard;
	}

	public RationShop getShop() {
		return shop;
	}

	public void setShop(RationShop shop) {
		this.shop = shop;
	}

	public GrainType getGrain() {
		return grain;
	}

	public void setGrain(GrainType grain) {
		this.grain = grain;
	}

	public Double getQuantityGiven() {
		return quantityGiven;
	}

	public void setQuantityGiven(Double quantityGiven) {
		this.quantityGiven = quantityGiven;
	}

	public String getDistributionMonth() {
		return distributionMonth;
	}

	public void setDistributionMonth(String distributionMonth) {
		this.distributionMonth = distributionMonth;
	}

	public LocalDateTime getDistributionDate() {
		return distributionDate;
	}

	public void setDistributionDate(LocalDateTime distributionDate) {
		this.distributionDate = distributionDate;
	}

	public DistributionStatus getStatus() {
		return status;
	}

	public void setStatus(DistributionStatus status) {
		this.status = status;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
}
