package com.cdac.RationSahayata.service;

import java.util.List;
import java.util.Map;

import com.cdac.RationSahayata.Entities.Payment;

public interface PaymentService {

    void processPayment(Map<String, Object> data);

    List<Payment> getPaymentHistory(Integer shopkeeperId);

    List<Payment> getAllPayments();
}
