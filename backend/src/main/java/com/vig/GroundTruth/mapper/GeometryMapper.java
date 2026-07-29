package com.vig.GroundTruth.mapper;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GeometryMapper {

    private final GeoJsonWriter geoJsonWriter = new GeoJsonWriter();

    @SuppressWarnings("unchecked")
    public Map<String, Object> toGeoJson(Geometry geometry) {
        if (geometry == null) {
            return null;
        }
        String json = geoJsonWriter.write(geometry);
        return new org.springframework.boot.json.JacksonJsonParser().parseMap(json);
    }
}