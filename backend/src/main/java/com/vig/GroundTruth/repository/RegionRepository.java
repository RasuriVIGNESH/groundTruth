package com.vig.GroundTruth.repository;

import com.vig.GroundTruth.dto.RegionDetailProjection;
import com.vig.GroundTruth.dto.RegionSummaryResponse;
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

    /**
     * Latest projection per region via correlated MAX(calculatedDate) subquery.
     * LEFT JOIN so regions with no projection yet (no news activity) still appear,
     * per PRD §8 risk mitigation ("transparently show no recent news").
     */
    @Query("""
    SELECT new com.vig.GroundTruth.dto.RegionSummaryRow(
        r.id, r.name, r.mandal, r.district, r.state, r.geometry, r.baseValue, r.baseValueUnit,
        p.projectedValueLow, p.projectedValueHigh, p.confidenceScore, p.calculatedDate
    )
    FROM Region r
    LEFT JOIN Projection p ON p.region = r
        AND p.calculatedDate = (
            SELECT MAX(p2.calculatedDate) FROM Projection p2 WHERE p2.region = r
        )
    WHERE (:state IS NULL OR r.state = :state)
      AND (:district IS NULL OR r.district = :district)
      AND (:minConfidence IS NULL OR p.confidenceScore >= :minConfidence)
    ORDER BY r.name ASC
    """)
    List<RegionSummaryRow> findRegionSummaries(
            @Param("state") String state,
            @Param("district") String district,
            @Param("minConfidence") BigDecimal minConfidence
    );

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