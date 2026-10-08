package com.vig.GroundTruth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "infrastructure_project", indexes = {
        @Index(name = "idx_infrastructure_region_id", columnList = "region_id"),
        @Index(name = "idx_infrastructure_status", columnList = "status")
})
public class InfrastructureProject extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false, foreignKey = @ForeignKey(name = "fk_infrastructure_region"))
    private Region region;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "opening_year")
    private Integer openingYear;

    @Column(name = "contribution_low", precision = 5, scale = 2)
    private BigDecimal contributionLow;

    @Column(name = "contribution_high", precision = 5, scale = 2)
    private BigDecimal contributionHigh;

    @Column(precision = 4, scale = 3)
    private BigDecimal confidence;

    @Column(nullable = false, length = 8)
    private String emoji;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @Version
    @Column(nullable = false)
    private Long version;
}
