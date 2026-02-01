package com.cdac.RationSahayata.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cdac.RationSahayata.Entities.Feedback;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByShopkeeperId(Integer shopkeeperId);
}
