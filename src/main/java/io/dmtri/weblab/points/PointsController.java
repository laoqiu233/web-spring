package io.dmtri.weblab.points;

import io.dmtri.weblab.areas.Area;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import io.dmtri.weblab.points.CompoundPointRequest;

@RestController
@RequestMapping("/points")
public class PointsController {
    private final Area checker;
    private final PointAttemptRepository repository;

    @Autowired
    public PointsController(PointAttemptRepository repository, Area checker) {
        this.repository = repository;
        this.checker = checker;
    }

    @PostMapping("")
    public Iterable<PointAttempt> test(
            @RequestBody
            CompoundPointRequest cpr
    ) {
        Iterator<Point> it = cpr.getIterator();

        while (it.hasNext()) {
            Point p = it.next();
            PointAttempt attempt = new PointAttempt(p, checker);
            repository.save(attempt);
        }

        return repository.findAll();
    }
}
