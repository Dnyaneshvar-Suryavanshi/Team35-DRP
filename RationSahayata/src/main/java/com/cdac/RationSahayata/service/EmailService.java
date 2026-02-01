package com.cdac.RationSahayata.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);

    void sendDistributionSuccessEmail(
            String toEmail,
            String citizenName,
            String headOfFamily,
            String cardNumber,
            String grainDetails,
            String month,
            String shopName,
            String shopLocation);

    void sendPaymentSuccessMail(String toEmail, String citizenName, Double amount, String transactionId);
}
