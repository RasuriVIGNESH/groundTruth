package com.vig.GroundTruth.dto;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/** Final GET /regions/{id} response. geometry is a GeoJSON-shaped Map (see GeometryMapper). */
public record RegionDetailResponse(
        UUID id,
        String name,
        String mandal,
        String district,
        Map<String, Object> geometry,
        BigDecimal baseValue,
        String baseValueUnit,
        ProjectionResponse projection
) {}