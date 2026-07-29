package com.vig.GroundTruth.dto;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** GET /news/latest row — same as RegionNewsResponse + regionName per API_SPEC. */
public record LatestNewsResponse(
        UUID id,
        String title,
        String source,
        String url,
        Instant publishedDate,
        String projectType,
        BigDecimal impactMagnitude,
        BigDecimal confidence,
        String regionName
) {}