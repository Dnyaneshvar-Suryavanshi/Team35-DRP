package com.cdac.RationSahayata.Entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cdac.RationSahayata.Enums.GrainType;
import com.cdac.RationSahayata.Enums.ShopStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "monthly_entitlements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEntitlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer entitlementId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrainType grain;

    @Column(nullable = false)
    private Double quantityPerPerson;

    @Column(nullable = false)
    private Double pricePerKg = 0.0;

    public Integer getEntitlementId() {
        return entitlementId;
    }

    public void setEntitlementId(Integer entitlementId) {
        this.entitlementId = entitlementId;
    }

    public GrainType getGrain() {
        return grain;
    }

    public void setGrain(GrainType grain) {
        this.grain = grain;
    }

    public Double getQuantityPerPerson() {
        return quantityPerPerson;
    }

    public void setQuantityPerPerson(Double quantityPerPerson) {
        this.quantityPerPerson = quantityPerPerson;
    }
}
