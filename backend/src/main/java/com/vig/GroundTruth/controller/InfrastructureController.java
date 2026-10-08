package com.vig.GroundTruth.controller;

import com.vig.GroundTruth.dto.InfrastructureResponse;
import com.vig.GroundTruth.service.InfrastructureProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/infrastructure")
@RequiredArgsConstructor
public class InfrastructureController {

    private final InfrastructureProjectService service;

    @GetMapping
    public List<InfrastructureResponse> getInfrastructure(
            @RequestParam(required = false) UUID regionId,
            @RequestParam(required = false) String state) {
        return service.getAll(regionId, state);
    }
}
