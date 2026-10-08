package com.vig.GroundTruth.service;

import com.vig.GroundTruth.dto.PredictionRequest;
import com.vig.GroundTruth.dto.PredictionResponse;
import com.vig.GroundTruth.exception.ResourceNotFoundException;
import com.vig.GroundTruth.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final RegionRepository regionRepository;

    public PredictionResponse predict(PredictionRequest request) {
        if (!regionRepository.existsById(request.regionId())) {
            throw ResourceNotFoundException.region(request.regionId());
        }

        double horizonFactor = Math.min(Math.max(request.horizonMonths() / 24.0, 0.25), 2.5);
        double typeFactor = switch (request.propertyType()) {
            case "Commercial" -> 1.12;
            case "Plot" -> 1.06;
            case "Independent house" -> 0.98;
            default -> 1.0;
        };

        // Replace these two values with database projection fields when the scoring pipeline is live.
        double lowRate = 0.04 * horizonFactor * typeFactor;
        double highRate = 0.11 * horizonFactor * typeFactor;
        BigDecimal base = request.currentValue();
        BigDecimal low = base.multiply(BigDecimal.valueOf(1 + lowRate)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal high = base.multiply(BigDecimal.valueOf(1 + highRate)).setScale(0, RoundingMode.HALF_UP);

        return new PredictionResponse(low, high, request.horizonMonths(), request.propertyType(),
                "Backend demo estimate. Replace the demo rates with the persisted region projection and scoring output when the AI pipeline is connected.");
    }
}
