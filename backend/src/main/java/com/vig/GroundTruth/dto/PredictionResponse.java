package com.vig.GroundTruth.dto;

import java.math.BigDecimal;

public record PredictionResponse(
        BigDecimal low,
        BigDecimal high,
        Integer horizonMonths,
        String propertyType,
        String methodology
) {}
