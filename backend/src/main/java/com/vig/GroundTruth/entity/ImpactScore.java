package com.vig.GroundTruth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "impact_score",
        indexes = {
                @Index(name = "idx_impact_score_region_id", columnList = "region_id"),
                @Index(name = "idx_impact_score_article_id", columnList = "article_id")
        }
)
public class ImpactScore extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // FetchType.LAZY always — Rule 6. Load via JOIN FETCH in JPQL when the
    // parent Region/NewsArticle is actually needed, not by default traversal.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false, foreignKey = @ForeignKey(name = "fk_impact_score_region"))
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "article_id", nullable = false, foreignKey = @ForeignKey(name = "fk_impact_score_article"))
    private NewsArticle article;

    @Column(name = "project_type", nullable = false, length = 50)
    private String projectType;

    @Column(name = "impact_magnitude", nullable = false, precision = 4, scale = 3)
    private BigDecimal impactMagnitude; // -1.000 to 1.000, enforced via DB CHECK constraint in migration

    @Column(name = "timeline_months")
    private Integer timelineMonths;

    @Column(name = "confidence", nullable = false, precision = 4, scale = 3)
    private BigDecimal confidence; // 0.000 to 1.000, DB CHECK constraint

    @Column(name = "extracted_at", nullable = false)
    private Instant extractedAt;
}