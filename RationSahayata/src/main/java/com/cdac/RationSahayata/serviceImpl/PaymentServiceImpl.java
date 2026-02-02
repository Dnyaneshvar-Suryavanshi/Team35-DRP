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

        // Prevent duplicate payment entry by Transaction ID
        if (paymentRepository.existsByTransactionId(transactionId)) {
            System.out.println("Duplicate Payment Transaction Ignored: " + transactionId);
            return;
        }

        // Check if ANY payment exists for this citizen this month
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.getMonth().length(now.toLocalDate().isLeapYear()))
                .withHour(23).withMinute(59).withSecond(59);

        long paymentsThisMonth = paymentRepository.countByCitizenEmailAndTimestampBetween(toEmail, startOfMonth,
                endOfMonth);

        System.out.println("DEBUG: Checking payments for " + toEmail);
        System.out.println("DEBUG: From " + startOfMonth + " to " + endOfMonth);
        System.out.println("DEBUG: Found " + paymentsThisMonth + " payments");

        if (paymentsThisMonth > 0) {
            System.out.println("Payment already exists for citizen " + toEmail + " in month " + now.getMonth());
            throw new com.cdac.RationSahayata.exception.ResourceNotFoundException(
                    "Payment already done for this month (" + now.getMonth() + ")");
        }

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

        try {
            emailService.sendPaymentSuccessMail(toEmail, citizenName, amount, transactionId);
        } catch (Exception e) {
            System.err.println("Failed to send payment success email: " + e.getMessage());
            // Consume error so it doesn't fail the request.
            // The payment is already recorded.
        }
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
