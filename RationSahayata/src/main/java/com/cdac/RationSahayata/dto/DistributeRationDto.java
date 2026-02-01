package com.cdac.RationSahayata.dto;

import com.cdac.RationSahayata.Enums.GrainType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class DistributeRationDto {

    @NotBlank(message = "Card number is required")
    @Size(min = 12, max = 12)
    private String cardNumber;

    @NotNull(message = "Grain types are required")
    private java.util.List<GrainType> grains;

    private String otp;

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public java.util.List<GrainType> getGrains() {
        return grains;
    }

    public void setGrains(java.util.List<GrainType> grains) {
        this.grains = grains;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
