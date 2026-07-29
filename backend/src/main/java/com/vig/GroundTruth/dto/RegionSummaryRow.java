package com.vig.GroundTruth.dto;

import org.locationtech.jts.geom.Polygon;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RegionSummaryRow(
        UUID id,
        String name,
        String mandal,
        String district,
        String state,
        Polygon geometry,
        BigDecimal baseValue,
        String baseValueUnit,
        BigDecimal projectedValueLow,
        BigDecimal projectedValueHigh,
        BigDecimal confidenceScore,
        Instant lastUpdated
) {}