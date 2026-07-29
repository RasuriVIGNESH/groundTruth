package com.vig.GroundTruth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "projection",
        indexes = {
                @Index(name = "idx_projection_region_id", columnList = "region_id"),
                @Index(name = "idx_projection_calculated_date", columnList = "calculated_date")
        }
)
public class Projection extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false, foreignKey = @ForeignKey(name = "fk_projection_region"))
    private Region region;

    @Column(name = "projected_value_low", nullable = false, precision = 14, scale = 2)
    private BigDecimal projectedValueLow;

    @Column(name = "projected_value_high", nullable = false, precision = 14, scale = 2)
    private BigDecimal projectedValueHigh;

    @Column(name = "confidence_score", nullable = false, precision = 4, scale = 3)
    private BigDecimal confidenceScore;

    @Column(name = "calculated_date", nullable = false)
    private Instant calculatedDate;

    /**
     * Join table modeled as @ManyToMany since ProjectionContributingArticle
     * has no columns beyond the two FKs (per 04_DATABASE_SCHEMA.md).
     * LAZY by default for @ManyToMany — never touch unless explanation trail is needed.
     */
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "projection_contributing_article",
            joinColumns = @JoinColumn(name = "projection_id", foreignKey = @ForeignKey(name = "fk_pca_projection")),
            inverseJoinColumns = @JoinColumn(name = "article_id", foreignKey = @ForeignKey(name = "fk_pca_article"))
    )
    private Set<NewsArticle> contributingArticles = new HashSet<>();

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}