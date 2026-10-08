CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS region (
                                      id UUID PRIMARY KEY,
                                      name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    mandal VARCHAR(150) NOT NULL,
    district VARCHAR(150) NOT NULL,
    geometry geometry(Polygon, 4326) NOT NULL,
    base_value NUMERIC(14,2) NOT NULL CHECK (base_value > 0),
    base_value_unit VARCHAR(30) NOT NULL,
    base_value_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_region_identity UNIQUE (state, district, mandal, name)
    );
CREATE INDEX IF NOT EXISTS idx_region_state ON region(state);
CREATE INDEX IF NOT EXISTS idx_region_district ON region(district);
CREATE INDEX IF NOT EXISTS idx_region_mandal ON region(mandal);
CREATE INDEX IF NOT EXISTS idx_region_geometry_gist ON region USING GIST(geometry);

CREATE TABLE IF NOT EXISTS news_article (
                                            id UUID PRIMARY KEY,
                                            url VARCHAR(1000) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    source VARCHAR(150) NOT NULL,
    published_date TIMESTAMPTZ,
    content_snippet TEXT,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
CREATE INDEX IF NOT EXISTS idx_news_article_published_date ON news_article(published_date);

CREATE TABLE IF NOT EXISTS projection (
                                          id UUID PRIMARY KEY,
                                          region_id UUID NOT NULL REFERENCES region(id),
    projected_value_low NUMERIC(14,2) NOT NULL,
    projected_value_high NUMERIC(14,2) NOT NULL,
    confidence_score NUMERIC(4,3) NOT NULL,
    calculated_date TIMESTAMPTZ NOT NULL,
    horizon_months INTEGER NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT ck_projection_range CHECK (projected_value_low > 0 AND projected_value_high >= projected_value_low),
    CONSTRAINT ck_projection_confidence CHECK (confidence_score BETWEEN 0 AND 1),
    CONSTRAINT ck_projection_horizon CHECK (horizon_months BETWEEN 0 AND 120)
    );
CREATE INDEX IF NOT EXISTS idx_projection_region_horizon_date ON projection(region_id, horizon_months, calculated_date DESC);

CREATE TABLE IF NOT EXISTS infrastructure_project (
                                                      id UUID PRIMARY KEY,
                                                      region_id UUID NOT NULL REFERENCES region(id),
    name VARCHAR(180) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(40) NOT NULL,
    latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    opening_year INTEGER,
    contribution_low NUMERIC(5,2),
    contribution_high NUMERIC(5,2),
    confidence NUMERIC(4,3) CHECK (confidence BETWEEN 0 AND 1),
    emoji VARCHAR(8) NOT NULL,
    summary TEXT,
    source_url VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
    );
CREATE INDEX IF NOT EXISTS idx_infrastructure_region_id ON infrastructure_project(region_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_status ON infrastructure_project(status);

CREATE TABLE IF NOT EXISTS impact_score (
                                            id UUID PRIMARY KEY,
                                            region_id UUID NOT NULL REFERENCES region(id),
    article_id UUID NOT NULL REFERENCES news_article(id),
    project_type VARCHAR(50) NOT NULL,
    impact_magnitude NUMERIC(4,3) NOT NULL,
    timeline_months INTEGER,
    confidence NUMERIC(4,3) NOT NULL,
    extracted_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_impact_magnitude CHECK (impact_magnitude BETWEEN -1 AND 1),
    CONSTRAINT ck_impact_confidence CHECK (confidence BETWEEN 0 AND 1),
    CONSTRAINT uq_impact_region_article UNIQUE (region_id, article_id)
    );
CREATE INDEX IF NOT EXISTS idx_impact_score_region_id ON impact_score(region_id);
CREATE INDEX IF NOT EXISTS idx_impact_score_article_id ON impact_score(article_id);

CREATE TABLE IF NOT EXISTS projection_contributing_article (
                                                               projection_id UUID NOT NULL REFERENCES projection(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES news_article(id) ON DELETE CASCADE,
    PRIMARY KEY (projection_id, article_id)
    );
