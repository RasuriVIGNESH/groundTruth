package com.vig.GroundTruth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "projection", indexes = {
        @Index(name = "idx_projection_region_horizon_date", columnList = "region_id,horizon_months,calculated_date")
})
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

    @Column(name = "horizon_months", nullable = false)
    @Builder.Default
    private Integer horizonMonths = 24;

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "projection_contributing_article",
            joinColumns = @JoinColumn(name = "projection_id", foreignKey = @ForeignKey(name = "fk_pca_projection")),
            inverseJoinColumns = @JoinColumn(name = "article_id", foreignKey = @ForeignKey(name = "fk_pca_article")))
    private Set<NewsArticle> contributingArticles = new HashSet<>();

    @Version
    @Column(nullable = false)
    private Long version;
}
