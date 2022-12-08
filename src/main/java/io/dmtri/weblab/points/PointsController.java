package io.dmtri.weblab.points;

import io.dmtri.weblab.areas.Area;
import io.dmtri.weblab.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import io.dmtri.weblab.points.CompoundPointRequest;

@RestController
@RequestMapping("/api/points")
public class PointsController {
    private final Area checker;
    private final PointAttemptRepository repository;

    @Autowired
    public PointsController(PointAttemptRepository repository, Area checker) {
        this.repository = repository;
        this.checker = checker;
    }

    @GetMapping
    public PagedPointsResponse getPoints(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "false") boolean owned) {
        final PageRequest pr = PageRequest.of(page, 10, Sort.by("attemptTime").descending());
        Page<PointAttempt> pageResult;
        // Find all or only attempts owned by current user
        if (owned) {
            final User user = (User) SecurityContextHolder.getContext().getAuthentication().getDetails();
            pageResult = repository.findAllByUser(user, pr);
        } else {
            pageResult = repository.findAll(pr);
        }

        return new PagedPointsResponse(pageResult.getContent(), page, pageResult.getTotalPages(), pageResult.getTotalElements());
    }

    @PostMapping
    public Iterable<PointAttempt> submitPoints(
            @RequestBody
            CompoundPointRequest cpr
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getDetails();

        Iterator<Point> it = cpr.getIterator();
        List<PointAttempt> results = new LinkedList<>();

        while (it.hasNext()) {
            Point p = it.next();
            PointAttempt attempt = new PointAttempt(p, checker);
            attempt.setUser(user);
            results.add(repository.save(attempt));
        }

        return results;
    }
}
