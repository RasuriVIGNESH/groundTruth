INSERT INTO region (id, name, state, mandal, district, geometry, base_value, base_value_unit, base_value_updated_at)
VALUES (
           '11111111-1111-1111-1111-111111111111',
           'Warangal Urban', 'Telangana', 'Hanamkonda', 'Hanamkonda',
           ST_GeomFromText('POLYGON((79.50 17.90,79.68 17.90,79.68 18.08,79.50 18.08,79.50 17.90))', 4326),
           2450.00, 'per sq yd', CURRENT_TIMESTAMP
       )
    ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
                            geometry = EXCLUDED.geometry,
                            base_value = EXCLUDED.base_value,
                            base_value_unit = EXCLUDED.base_value_unit,
                            base_value_updated_at = EXCLUDED.base_value_updated_at,
                            updated_at = CURRENT_TIMESTAMP;

INSERT INTO projection (id, region_id, projected_value_low, projected_value_high, confidence_score, calculated_date, horizon_months)
VALUES
    ('22222222-2222-2222-2222-222222222012','11111111-1111-1111-1111-111111111111',2500,2580,0.76,CURRENT_TIMESTAMP,12),
    ('22222222-2222-2222-2222-222222222024','11111111-1111-1111-1111-111111111111',2580,2810,0.71,CURRENT_TIMESTAMP,24),
    ('22222222-2222-2222-2222-222222222036','11111111-1111-1111-1111-111111111111',2700,3050,0.64,CURRENT_TIMESTAMP,36)
    ON CONFLICT (id) DO UPDATE SET
    projected_value_low = EXCLUDED.projected_value_low,
                            projected_value_high = EXCLUDED.projected_value_high,
                            confidence_score = EXCLUDED.confidence_score,
                            calculated_date = EXCLUDED.calculated_date,
                            horizon_months = EXCLUDED.horizon_months,
                            updated_at = CURRENT_TIMESTAMP;

INSERT INTO infrastructure_project (id, region_id, name, type, status, latitude, longitude, opening_year, contribution_low, contribution_high, confidence, emoji, summary, source_url)
VALUES ('33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','Warangal regional mobility upgrade','Transit','Announced',17.9784000,79.5941000,2029,2.00,4.00,0.71,'🚇','A regional mobility upgrade can widen access to jobs and services around the urban core.','https://www.telangana.gov.in/')
    ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
                            opening_year = EXCLUDED.opening_year,
                            contribution_low = EXCLUDED.contribution_low,
                            contribution_high = EXCLUDED.contribution_high,
                            confidence = EXCLUDED.confidence,
                            summary = EXCLUDED.summary,
                            source_url = EXCLUDED.source_url,
                            updated_at = CURRENT_TIMESTAMP;

INSERT INTO news_article (id, url, title, source, published_date, content_snippet, fetched_at)
VALUES ('44444444-4444-4444-4444-444444444444','https://www.telangana.gov.in/','Regional mobility planning update for Warangal','Government of Telangana',CURRENT_TIMESTAMP,'Public infrastructure planning signal used for the regional baseline projection.',CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
                            source = EXCLUDED.source,
                            published_date = EXCLUDED.published_date,
                            content_snippet = EXCLUDED.content_snippet,
                            fetched_at = EXCLUDED.fetched_at,
                            updated_at = CURRENT_TIMESTAMP;

INSERT INTO impact_score (id, region_id, article_id, project_type, impact_magnitude, timeline_months, confidence, extracted_at)
VALUES ('55555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','44444444-4444-4444-4444-444444444444','Transit',0.120,36,0.710,CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
    impact_magnitude = EXCLUDED.impact_magnitude,
                            timeline_months = EXCLUDED.timeline_months,
                            confidence = EXCLUDED.confidence,
                            extracted_at = EXCLUDED.extracted_at,
                            updated_at = CURRENT_TIMESTAMP;

INSERT INTO projection_contributing_article (projection_id, article_id)
VALUES ('22222222-2222-2222-2222-222222222024','44444444-4444-4444-4444-444444444444')
    ON CONFLICT DO NOTHING;
