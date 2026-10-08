package com.vig.GroundTruth.repository;

import com.vig.GroundTruth.dto.RegionDetailProjection;
import com.vig.GroundTruth.dto.RegionSummaryRow;
import com.vig.GroundTruth.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {

    @Query("SELECT DISTINCT r.state FROM Region r WHERE r.state IS NOT NULL AND TRIM(r.state) <> '' ORDER BY r.state ASC")
    List<String> findAvailableStates();

    String REGION_SUMMARY = """
        SELECT new com.vig.GroundTruth.dto.RegionSummaryRow(
            r.id, r.name, r.mandal, r.district, r.state, r.geometry, r.baseValue, r.baseValueUnit,
            p.projectedValueLow, p.projectedValueHigh, p.confidenceScore, p.calculatedDate
        )
        FROM Region r
        LEFT JOIN Projection p ON p.region = r
            AND p.calculatedDate = (
                SELECT MAX(p2.calculatedDate) FROM Projection p2 WHERE p2.region = r
            )
        """;

    @Query(REGION_SUMMARY + " ORDER BY r.name ASC")
    List<RegionSummaryRow> findRegionSummaries();

    @Query(REGION_SUMMARY + " WHERE LOWER(r.state) = LOWER(:state) ORDER BY r.name ASC")
    List<RegionSummaryRow> findRegionSummariesByState(@Param("state") String state);

    @Query(REGION_SUMMARY + " WHERE LOWER(r.district) = LOWER(:district) ORDER BY r.name ASC")
    List<RegionSummaryRow> findRegionSummariesByDistrict(@Param("district") String district);

    @Query(REGION_SUMMARY + " WHERE p.confidenceScore >= :minConfidence ORDER BY r.name ASC")
    List<RegionSummaryRow> findRegionSummariesByMinConfidence(@Param("minConfidence") BigDecimal minConfidence);

    @Query("""
        SELECT new com.vig.GroundTruth.dto.RegionDetailProjection(
            r.id, r.name, r.mandal, r.district, r.geometry, r.baseValue, r.baseValueUnit,
            p.id, p.projectedValueLow, p.projectedValueHigh, p.confidenceScore, p.calculatedDate
        )
        FROM Region r
        LEFT JOIN Projection p ON p.region = r
            AND p.calculatedDate = (
                SELECT MAX(p2.calculatedDate) FROM Projection p2 WHERE p2.region = r
            )
        WHERE r.id = :regionId
        """)
    Optional<RegionDetailProjection> findRegionDetailById(@Param("regionId") UUID regionId);
}
