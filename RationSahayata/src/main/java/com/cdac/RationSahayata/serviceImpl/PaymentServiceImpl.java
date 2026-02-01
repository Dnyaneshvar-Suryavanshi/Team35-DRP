package com.cdac.RationSahayata.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.RationSahayata.Entities.Payment;
import com.cdac.RationSahayata.Enums.PaymentMethod;
import com.cdac.RationSahayata.repository.PaymentRepository;
import com.cdac.RationSahayata.service.EmailService;
import com.cdac.RationSahayata.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public void processPayment(Map<String, Object> data) {
        String toEmail = (String) data.get("citizenEmail");
        String citizenName = (String) data.get("citizenName");

        // Handle amount (could be Integer or Double depending on JSON parsing)
        Double amount = 0.0;
        if (data.get("amount") instanceof Number) {
            amount = ((Number) data.get("amount")).doubleValue();
        }

        String transactionId = (String) data.get("transactionId");

        // Save Payment Logic
        try {
            // Get shopkeeperId if provided
            Object skIdObj = data.get("shopkeeperId");
            Integer shopkeeperId = null;
            if (skIdObj != null) {
                shopkeeperId = Integer.parseInt(skIdObj.toString());
            } else {
                System.out.println("Warning: Shopkeeper ID missing in payment data");
            }

            if (shopkeeperId != null) {
                Payment payment = new Payment();
                payment.setTransactionId(transactionId);
                payment.setAmount(amount);
                payment.setCitizenEmail(toEmail);
                payment.setCitizenName(citizenName);
                payment.setShopkeeperId(shopkeeperId);
                payment.setTimestamp(LocalDateTime.now());

                String method = (String) data.getOrDefault("paymentMethod", "UPI");
                try {
                    payment.setPaymentMethod(PaymentMethod.valueOf(method.toUpperCase()));
                } catch (Exception e) {
                    payment.setPaymentMethod(PaymentMethod.UPI);
                }

                paymentRepository.save(payment);
            }
        } catch (Exception e) {
            System.err.println("Error saving payment record: " + e.getMessage());
        }

        emailService.sendPaymentSuccessMail(toEmail, citizenName, amount, transactionId);
    }

    @Override
    public List<Payment> getPaymentHistory(Integer shopkeeperId) {
        return paymentRepository.findByShopkeeperIdOrderByTimestampDesc(shopkeeperId);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByTimestampDesc();
    }

}
