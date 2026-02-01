package com.cdac.RationSahayata.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.RationSahayata.Entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByShopkeeperIdOrderByTimestampDesc(Integer shopkeeperId);

    List<Payment> findAllByOrderByTimestampDesc();
}
