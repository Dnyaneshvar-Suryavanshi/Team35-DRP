package com.cdac.RationSahayata.dto;

import com.cdac.RationSahayata.Enums.GrainType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class MonthlyEntitlementDto {
	@NotNull(message = "Grain type is required")
	private GrainType grain;

	@NotNull(message = "Quantity per person is required")
	@DecimalMin(value = "0.1", message = "Quantity must be at least 0.1")
	private Double quantityPerPerson;

	private Double pricePerKg;
}
