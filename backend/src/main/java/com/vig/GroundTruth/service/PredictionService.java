package com.vig.GroundTruth.service;

import com.vig.GroundTruth.dto.PredictionRequest;
import com.vig.GroundTruth.dto.PredictionResponse;
import com.vig.GroundTruth.entity.Projection;
import com.vig.GroundTruth.entity.Region;
import com.vig.GroundTruth.exception.ResourceNotFoundException;
import com.vig.GroundTruth.repository.ProjectionRepository;
import com.vig.GroundTruth.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PredictionService {
    private static final Set<Integer> SUPPORTED_HORIZONS = Set.of(12, 24, 36);
    private final RegionRepository regionRepository;
    private final ProjectionRepository projectionRepository;

    public PredictionResponse predict(PredictionRequest request) {
        if (!SUPPORTED_HORIZONS.contains(request.horizonMonths())) {
            throw new IllegalArgumentException("horizonMonths must be one of 12, 24, or 36");
        }

        Region region = regionRepository.findById(request.regionId())
                .orElseThrow(() -> ResourceNotFoundException.region(request.regionId()));
        Projection projection = projectionRepository
                .findTopByRegion_IdAndHorizonMonthsOrderByCalculatedDateDesc(region.getId(), request.horizonMonths())
                .orElseGet(() -> projectionRepository.findTopByRegion_IdOrderByCalculatedDateDesc(region.getId())
                        .orElseThrow(() -> new IllegalArgumentException("No projection is available for this region")));

        BigDecimal baseRegionValue = region.getBaseValue();
        BigDecimal lowGrowth = projection.getProjectedValueLow()
                .divide(baseRegionValue, 8, RoundingMode.HALF_UP)
                .subtract(BigDecimal.ONE);
        BigDecimal highGrowth = projection.getProjectedValueHigh()
                .divide(baseRegionValue, 8, RoundingMode.HALF_UP)
                .subtract(BigDecimal.ONE);

        BigDecimal low = request.currentValue().multiply(BigDecimal.ONE.add(lowGrowth))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal high = request.currentValue().multiply(BigDecimal.ONE.add(highGrowth))
                .setScale(0, RoundingMode.HALF_UP);
        String confidenceLabel = confidenceLabel(projection.getConfidenceScore());
        Instant dataAsOf = projection.getCalculatedDate() != null
                ? projection.getCalculatedDate()
                : region.getBaseValueUpdatedAt();

        return new PredictionResponse(
                low,
                high,
                request.horizonMonths(),
                request.propertyType(),
                projection.getConfidenceScore(),
                confidenceLabel,
                baseRegionValue,
                projection.getProjectedValueLow(),
                projection.getProjectedValueHigh(),
                region.getBaseValueUnit(),
                dataAsOf,
                "Baseline estimate scaled from the persisted regional projection; this is not an ML prediction.",
                "Informational estimate only. Verify values independently and consult a qualified professional before making a financial decision."
        );
    }

    private String confidenceLabel(BigDecimal score) {
        if (score == null) return "UNKNOWN";
        if (score.compareTo(BigDecimal.valueOf(0.75)) >= 0) return "HIGH";
        if (score.compareTo(BigDecimal.valueOf(0.50)) >= 0) return "MEDIUM";
        return "LOW";
    }
}
