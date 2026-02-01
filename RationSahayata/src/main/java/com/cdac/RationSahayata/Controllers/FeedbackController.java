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

import com.cdac.RationSahayata.Entities.Feedback;
import com.cdac.RationSahayata.repository.FeedbackRepository;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }

    @GetMapping("/shop/{shopkeeperId}")
    public ResponseEntity<List<Feedback>> getShopFeedback(@PathVariable Integer shopkeeperId) {
        return ResponseEntity.ok(feedbackRepository.findByShopkeeperId(shopkeeperId));
    }
}
