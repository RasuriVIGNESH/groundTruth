package com.vig.GroundTruth.repository;

import com.vig.GroundTruth.dto.LatestNewsResponse;
import com.vig.GroundTruth.dto.RegionNewsResponse;
import com.vig.GroundTruth.entity.ImpactScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ImpactScoreRepository extends JpaRepository<ImpactScore, UUID> {

    @Query("""
        SELECT new com.vig.GroundTruth.dto.RegionNewsResponse(
            a.id, a.title, a.source, a.url, a.publishedDate,
            isc.projectType, isc.impactMagnitude, isc.confidence
        )
        FROM ImpactScore isc
        JOIN isc.article a
        WHERE isc.region.id = :regionId
        ORDER BY a.publishedDate DESC
        """)
    Page<RegionNewsResponse> findNewsByRegionId(@Param("regionId") UUID regionId, Pageable pageable);

    @Query("""
        SELECT new com.vig.GroundTruth.dto.LatestNewsResponse(
            a.id, a.title, a.source, a.url, a.publishedDate,
            isc.projectType, isc.impactMagnitude, isc.confidence, r.name
        )
        FROM ImpactScore isc
        JOIN isc.article a
        JOIN isc.region r
        ORDER BY isc.extractedAt DESC
        """)
    Page<LatestNewsResponse> findLatestNews(Pageable pageable);
}