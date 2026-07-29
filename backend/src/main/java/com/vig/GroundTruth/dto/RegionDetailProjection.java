package com.vig.GroundTruth.dto;

import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Raw query-result shape for the region-detail JPQL — NOT the final API response.
 * projectionId is nullable (region may have no projection yet); mapped to
 * RegionDetailResponse in the service layer.
 */
public record RegionDetailProjection(
        UUID regionId,
        String name,
        String mandal,
        String district,
        Polygon geometry,
        BigDecimal baseValue,
        String baseValueUnit,
        UUID projectionId,
        BigDecimal projectedValueLow,
        BigDecimal projectedValueHigh,
        BigDecimal confidenceScore,
        Instant calculatedDate
) {}
