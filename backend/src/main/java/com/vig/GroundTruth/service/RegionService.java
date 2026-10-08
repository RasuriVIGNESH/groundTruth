package com.vig.GroundTruth.service;


import com.vig.GroundTruth.dto.*;
import com.vig.GroundTruth.exception.ResourceNotFoundException;
import com.vig.GroundTruth.mapper.GeometryMapper;
import com.vig.GroundTruth.repository.ImpactScoreRepository;
import com.vig.GroundTruth.repository.ProjectionRepository;
import com.vig.GroundTruth.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegionService {

    private static final Logger log = LoggerFactory.getLogger(RegionService.class);

    private final RegionRepository regionRepository;
    private final ProjectionRepository projectionRepository;
    private final ImpactScoreRepository impactScoreRepository;
    private final GeometryMapper geometryMapper;

    public RegionDetailResponse getRegionById(UUID regionId) {
        log.debug("Fetching region detail id={}", regionId);

        RegionDetailProjection row = regionRepository.findRegionDetailById(regionId)
                .orElseThrow(() -> ResourceNotFoundException.region(regionId));

        return mapToDetailResponse(row);
    }
    public List<String> getAvailableStates() {
        return regionRepository.findAvailableStates();
    }

    public List<RegionSummaryResponse> getRegions(String state, String district, BigDecimal minConfidence) {
        List<RegionSummaryRow> rows;
        if (state != null && !state.isBlank()) {
            rows = regionRepository.findRegionSummariesByState(state.trim());
        } else if (district != null && !district.isBlank()) {
            rows = regionRepository.findRegionSummariesByDistrict(district.trim());
        } else if (minConfidence != null) {
            rows = regionRepository.findRegionSummariesByMinConfidence(minConfidence);
        } else {
            rows = regionRepository.findRegionSummaries();
        }
        return rows.stream().map(row -> new RegionSummaryResponse(
                        row.id(), row.name(), row.mandal(), row.district(), row.state(),
                        geometryMapper.toGeoJson(row.geometry()),
                        row.baseValue(), row.baseValueUnit(),
                        row.projectedValueLow(), row.projectedValueHigh(),
                        row.confidenceScore(), row.lastUpdated()
                ))
                .toList();
    }


    public Page<RegionNewsResponse> getRegionNews(UUID regionId, Pageable pageable) {
        log.debug("Fetching region news id={}", regionId);

        if (!regionRepository.existsById(regionId)) {
            throw ResourceNotFoundException.region(regionId);
        }
        return impactScoreRepository.findNewsByRegionId(regionId, pageable);
    }

    private RegionDetailResponse mapToDetailResponse(RegionDetailProjection row) {
        List<ContributingArticleResponse> contributingArticles = row.projectionId() != null
                ? projectionRepository.findContributingArticles(row.projectionId())
                : Collections.emptyList();

        ProjectionResponse projection = row.projectionId() != null
                ? new ProjectionResponse(
                row.projectedValueLow(),
                row.projectedValueHigh(),
                row.confidenceScore(),
                row.calculatedDate(),
                contributingArticles)
                : null;

        return new RegionDetailResponse(
                row.regionId(),
                row.name(),
                row.mandal(),
                row.district(),
                geometryMapper.toGeoJson(row.geometry()),
                row.baseValue(),
                row.baseValueUnit(),
                projection
        );
    }
}