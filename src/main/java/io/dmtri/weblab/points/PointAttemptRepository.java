package io.dmtri.weblab.points;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointAttemptRepository extends JpaRepository<PointAttempt, Long> {
    Page<PointAttempt> findAllByUsername(String username, Pageable pageable);
}
