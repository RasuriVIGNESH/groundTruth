package com.vig.GroundTruth.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record PredictionRequest(
        @NotNull UUID regionId,
        @NotNull @DecimalMin("0.01") BigDecimal currentValue,
        @NotBlank String propertyType,
        @NotNull @Min(1) Integer horizonMonths
) {}
