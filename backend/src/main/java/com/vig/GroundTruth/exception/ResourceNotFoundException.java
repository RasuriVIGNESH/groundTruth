package com.vig.GroundTruth.exception;

import java.util.UUID;

public class ResourceNotFoundException extends BaseException {
    public ResourceNotFoundException(String errorCode, String message) {
        super(errorCode, message);
    }

    public static ResourceNotFoundException region(UUID id) {
        return new ResourceNotFoundException(
                "REGION_NOT_FOUND",
                "No region with id " + id
        );
    }
}