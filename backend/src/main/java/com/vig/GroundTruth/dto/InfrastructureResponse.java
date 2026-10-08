package com.vig.GroundTruth.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record InfrastructureResponse(
        UUID id,
        UUID regionId,
        String name,
        String type,
        String status,
        Integer openingYear,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal contributionLow,
        BigDecimal contributionHigh,
        BigDecimal confidence,
        String emoji,
        String summary,
        String sourceUrl
) {}
