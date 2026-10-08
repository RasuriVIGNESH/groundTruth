package com.vig.GroundTruth.repository;

import com.vig.GroundTruth.entity.InfrastructureProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InfrastructureProjectRepository extends JpaRepository<InfrastructureProject, UUID> {
    List<InfrastructureProject> findAllByOrderByNameAsc();
    List<InfrastructureProject> findByRegion_IdOrderByNameAsc(UUID regionId);
    List<InfrastructureProject> findByRegion_StateIgnoreCaseOrderByNameAsc(String state);
}
