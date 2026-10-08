package com.vig.GroundTruth.service;

import com.vig.GroundTruth.dto.InfrastructureResponse;
import com.vig.GroundTruth.entity.InfrastructureProject;
import com.vig.GroundTruth.repository.InfrastructureProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InfrastructureProjectService {

    private final InfrastructureProjectRepository repository;

    public List<InfrastructureResponse> getAll(UUID regionId, String state) {
        List<InfrastructureProject> projects;
        if (regionId != null) {
            projects = repository.findByRegion_IdOrderByNameAsc(regionId);
        } else if (state != null && !state.isBlank()) {
            projects = repository.findByRegion_StateIgnoreCaseOrderByNameAsc(state.trim());
        } else {
            projects = repository.findAllByOrderByNameAsc();
        }
        return projects.stream().map(project -> new InfrastructureResponse(
                project.getId(),
                project.getRegion().getId(),
                project.getName(),
                project.getType(),
                project.getStatus(),
                project.getOpeningYear(),
                project.getLatitude(),
                project.getLongitude(),
                project.getContributionLow(),
                project.getContributionHigh(),
                project.getConfidence(),
                project.getEmoji(),
                project.getSummary(),
                project.getSourceUrl()
        )).toList();
    }
}
