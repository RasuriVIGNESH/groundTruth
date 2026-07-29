package com.vig.GroundTruth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.locationtech.jts.geom.Polygon;

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
        name = "region",
        indexes = {
                @Index(name = "idx_region_district", columnList = "district"),
                @Index(name = "idx_region_mandal", columnList = "mandal"),
                @Index(name = "idx_region_state", columnList = "state")
        }
)
public class Region extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "mandal", nullable = false, length = 150)
    private String mandal;

    @Column(name = "district", nullable = false, length = 150)
    private String district;

    @Column(name = "geometry", nullable = false, columnDefinition = "geometry(Polygon,4326)")
    private Polygon geometry;

    @Column(name = "base_value", nullable = false, precision = 14, scale = 2)
    private BigDecimal baseValue;

    @Column(name = "base_value_unit", nullable = false, length = 30)
    private String baseValueUnit;

    @Column(name = "base_value_updated_at")
    private Instant baseValueUpdatedAt;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}