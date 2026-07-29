package com.vig.GroundTruth.controller;

import com.vig.GroundTruth.dto.LatestNewsResponse;
import com.vig.GroundTruth.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @Operation(summary = "Most recently ingested and analyzed articles across all regions")
    @GetMapping("/latest")
    public List<LatestNewsResponse> getLatestNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<LatestNewsResponse> result = newsService.getLatestNews(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "extractedAt"))
        );
        return result.getContent();
    }
}