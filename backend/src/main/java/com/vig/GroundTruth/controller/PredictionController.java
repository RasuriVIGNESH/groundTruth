package com.vig.GroundTruth.controller;

import com.vig.GroundTruth.dto.PredictionRequest;
import com.vig.GroundTruth.dto.PredictionResponse;
import com.vig.GroundTruth.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    @PostMapping
    public PredictionResponse predict(@Valid @RequestBody PredictionRequest request) {
        return predictionService.predict(request);
    }
}
