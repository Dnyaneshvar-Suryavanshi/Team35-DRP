package com.cdac.RationSahayata.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.RationSahayata.dto.AddCitizenDto;
import com.cdac.RationSahayata.dto.DistributeRationDto;
import com.cdac.RationSahayata.dto.GenerateOtpDto;
import com.cdac.RationSahayata.dto.UpdateCitizenDto;
import com.cdac.RationSahayata.service.ShopkeeperService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/shopkeeper")
public class ShopkeeperController {

    private final ShopkeeperService shopkeeperService;

    public ShopkeeperController(ShopkeeperService service) {
        this.shopkeeperService = service;
    }

    @GetMapping("/{shopkeeperId}/shop")
    public Map<String, Object> getMyShop(@PathVariable Integer shopkeeperId) {
        return shopkeeperService.getMyShop(shopkeeperId);
    }

    @PostMapping("/{shopkeeperId}/add-citizen")
    public Map<String, Object> addCitizen(@PathVariable Integer shopkeeperId,
            @RequestBody AddCitizenDto dto) {

        return shopkeeperService.addCitizen(shopkeeperId, dto);
    }

    @DeleteMapping("/{shopkeeperId}/delete-citizen/{citizenEmail}")
    public ResponseEntity<Map<String, Object>> deleteCitizen(
            @PathVariable Integer shopkeeperId,
            @PathVariable String citizenEmail) {
        Map<String, Object> response = shopkeeperService.deleteCitizen(shopkeeperId, citizenEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{shopkeeperId}/update-citizen/{cardNumber}")
    public ResponseEntity<Map<String, Object>> updateCitizen(
            @PathVariable Integer shopkeeperId,
            @PathVariable String cardNumber,
            @Valid @RequestBody UpdateCitizenDto dto) {
        Map<String, Object> response = shopkeeperService.updateCitizen(shopkeeperId, cardNumber, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shopkeeperId}/citizens")
    public List<Map<String, Object>> getCitizens(@PathVariable Integer shopkeeperId) {
        return shopkeeperService.getCitizens(shopkeeperId);
    }

    @GetMapping("/stock-allocation/{shopkeeperId}")
    public List<Map<String, Object>> getStockAllocations(@PathVariable Integer shopkeeperId) {
        return shopkeeperService.getStockAllocations(shopkeeperId);
    }

    @GetMapping("/my-stock/{shopId}")
    public List<Map<String, Object>> viewCurrentStock(@PathVariable Integer shopId) {
        return shopkeeperService.viewCurrentStock(shopId);
    }

    @PostMapping("/distribute-ration")
    public Map<String, Object> distributeRation(@Valid @RequestBody DistributeRationDto dto) {
        return shopkeeperService.distributeRation(dto);
    }

    @PostMapping("/generate-otp")

    public ResponseEntity<Map<String, Object>> generateOtp(@Valid @RequestBody GenerateOtpDto dto) {
        Map<String, Object> response = shopkeeperService.generateOtp(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/distribution-history/{shopkeeperId}")
    public List<Map<String, Object>> getDistributionHistory(@PathVariable Integer shopkeeperId) {
        return shopkeeperService.distributionHistory(shopkeeperId);
    }
}
