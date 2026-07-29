package com.vig.GroundTruth.service;


import com.vig.GroundTruth.dto.LatestNewsResponse;
import com.vig.GroundTruth.repository.ImpactScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NewsService {

    private final ImpactScoreRepository impactScoreRepository;

    public Page<LatestNewsResponse> getLatestNews(Pageable pageable) {
        return impactScoreRepository.findLatestNews(pageable);
    }
}