package com.vig.GroundTruth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "news_article",
        indexes = {
                @Index(name = "idx_news_article_url", columnList = "url", unique = true),
                @Index(name = "idx_news_article_published_date", columnList = "published_date")
        }
)
public class NewsArticle extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "url", nullable = false, unique = true, length = 1000)
    private String url;

    @Column(name = "title", nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(name = "source", nullable = false, length = 150)
    private String source;

    @Column(name = "published_date")
    private Instant publishedDate;

    @Column(name = "content_snippet", columnDefinition = "TEXT")
    private String contentSnippet;

    @Column(name = "fetched_at", nullable = false)
    private Instant fetchedAt;
}