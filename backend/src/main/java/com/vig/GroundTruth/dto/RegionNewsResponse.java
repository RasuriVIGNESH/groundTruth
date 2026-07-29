package com.vig.GroundTruth.dto;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** GET /regions/{id}/news row. */
public record RegionNewsResponse(
        UUID id,
        String title,
        String source,
        String url,
        Instant publishedDate,
        String projectType,
        BigDecimal impactMagnitude,
        BigDecimal confidence
) {}
