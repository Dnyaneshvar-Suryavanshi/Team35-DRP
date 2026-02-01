package com.cdac.RationSahayata.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.RationSahayata.Entities.Payment;
import com.cdac.RationSahayata.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<String> processPayment(@RequestBody Map<String, Object> data) {
        paymentService.processPayment(data);
        return ResponseEntity.ok("Payment processed and email sent");
    }

    @GetMapping("/history/{shopkeeperId}")
    public ResponseEntity<List<Payment>> getPaymentHistory(@PathVariable Integer shopkeeperId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(shopkeeperId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
