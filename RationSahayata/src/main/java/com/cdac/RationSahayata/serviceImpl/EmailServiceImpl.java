package com.cdac.RationSahayata.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cdac.RationSahayata.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

        @Autowired
        private JavaMailSender mailSender;

        @Override
        public void sendOtpEmail(String toEmail, String otp) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Ration Distribution OTP");
                message.setText("Your 6-digit OTP for ration distribution is: " + otp
                                + "\n\nThis OTP is valid for 5 minutes." + "\n\nDo not Share this Otp.");
                message.setFrom("noreply@rationsahayata.com");

                mailSender.send(message);

        }

        @Override
        public void sendDistributionSuccessEmail(String toEmail, String citizenName, String headOfFamily,
                        String cardNumber,
                        String grainDetails, String month, String shopName, String shopLocation) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Ration Distributed Successfully - Ration Sahayata");

                String emailBody = String.format(
                                "Dear %s,\n\n" +
                                                "Your ration has been successfully distributed!\n\n" +
                                                "=== DISTRIBUTION DETAILS ===\n\n" +
                                                "Ration Card Number: %s\n" +
                                                "Head of Family: %s\n" +
                                                "Grains Distributed:\n%s\n" +
                                                "Distribution Month: %s\n\n" +
                                                "=== SHOP DETAILS ===\n\n" +
                                                "Shop Name: %s\n" +
                                                "Shop Location: %s\n\n" +
                                                "Thank you for using Ration Sahayata!\n\n" +
                                                "For any queries, please contact your local ration shop.\n\n" +
                                                "Best Regards,\n" +
                                                "Ration Sahayata Team",
                                citizenName,
                                cardNumber,
                                headOfFamily,
                                grainDetails,
                                month,
                                shopName,
                                shopLocation);

                message.setText(emailBody);
                message.setFrom("noreply@rationsahayata.com");

                mailSender.send(message);

        }

        @Override
        public void sendPaymentSuccessMail(String toEmail, String citizenName, Double amount, String transactionId) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Payment Successful - Ration Sahayata");

                String emailBody = String.format(
                                "Dear %s,\n\n" +
                                                "We have received a payment of ₹%.2f for your ration distribution.\n\n"
                                                +
                                                "Transaction ID: %s\n\n" +
                                                "Your OTP will be generated shortly to complete the distribution.\n\n" +
                                                "Thank you,\n" +
                                                "Ration Sahayata Team",
                                citizenName,
                                amount,
                                transactionId);

                message.setText(emailBody);
                message.setFrom("noreply@rationsahayata.com");

                mailSender.send(message);
        }

}
