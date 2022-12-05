package io.dmtri.weblab.points;

import io.dmtri.weblab.areas.Area;
import io.dmtri.weblab.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public Iterable<PointAttempt> getPoints() {
        return repository.findAll();
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
