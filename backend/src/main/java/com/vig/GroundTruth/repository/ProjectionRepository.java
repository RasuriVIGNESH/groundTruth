package com.vig.GroundTruth.repository;

import com.vig.GroundTruth.dto.ContributingArticleResponse;
import com.vig.GroundTruth.entity.Projection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectionRepository extends JpaRepository<Projection, UUID> {

    /**
     * Explanation trail: articles tied to this projection, enriched with
     * projectType/impactMagnitude from ImpactScore (article+region pair).
     * Single query, no loop.
     */
    @Query("""
        SELECT new com.vig.GroundTruth.dto.ContributingArticleResponse(
            a.id, a.title, a.source, a.url, a.publishedDate, isc.projectType, isc.impactMagnitude
        )
        FROM Projection p
        JOIN p.contributingArticles a
        JOIN ImpactScore isc ON isc.article = a AND isc.region = p.region
        WHERE p.id = :projectionId
        ORDER BY a.publishedDate DESC
        """)
    List<ContributingArticleResponse> findContributingArticles(@Param("projectionId") UUID projectionId);
}