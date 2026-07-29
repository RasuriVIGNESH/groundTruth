package com.vig.GroundTruth.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record RegionSummaryResponse(
        UUID id,
        String name,
        String mandal,
        String district,
        String state,
        Map<String, Object> geometry,
        BigDecimal baseValue,
        String baseValueUnit,
        BigDecimal projectedValueLow,
        BigDecimal projectedValueHigh,
        BigDecimal confidenceScore,
        Instant lastUpdated
) {}