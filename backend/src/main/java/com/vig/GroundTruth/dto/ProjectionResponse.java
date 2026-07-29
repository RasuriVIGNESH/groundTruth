package com.vig.GroundTruth.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProjectionResponse(
        BigDecimal projectedValueLow,
        BigDecimal projectedValueHigh,
        BigDecimal confidenceScore,
        Instant calculatedDate,
        List<ContributingArticleResponse> contributingArticles
) {}