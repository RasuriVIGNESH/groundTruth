package com.vig.GroundTruth.controller;


import com.vig.GroundTruth.dto.RegionDetailResponse;
import com.vig.GroundTruth.dto.RegionNewsResponse;
import com.vig.GroundTruth.dto.RegionSummaryResponse;
import com.vig.GroundTruth.service.RegionService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/regions")
@RequiredArgsConstructor
@Validated
public class RegionController {

    private final RegionService regionService;


    @Operation(summary = "Full detail for one region, including geometry and latest projection")
    @GetMapping("/{id}")
    public RegionDetailResponse getRegionById(@PathVariable UUID id) {
        return regionService.getRegionById(id);
    }

    @Operation(summary = "News articles tagged to a region, most recent first")
    @GetMapping("/{id}/news")
    public List<RegionNewsResponse> getRegionNews(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<RegionNewsResponse> result = regionService.getRegionNews(
                id, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedDate"))
        );
        return result.getContent();
    }
    @GetMapping
    public List<RegionSummaryResponse> getRegions(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) @DecimalMin("0.0") @DecimalMax("1.0") BigDecimal minConfidence
    ) {
        return regionService.getRegions(state, district, minConfidence);
    }

}