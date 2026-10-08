package com.vig.GroundTruth.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PredictionResponse(
        BigDecimal low,
        BigDecimal high,
        Integer horizonMonths,
        String propertyType,
        BigDecimal confidenceScore,
        String confidenceLabel,
        BigDecimal regionBaseValue,
        BigDecimal regionProjectedLow,
        BigDecimal regionProjectedHigh,
        String baseValueUnit,
        Instant dataAsOf,
        String methodology,
        String disclaimer
) {}
