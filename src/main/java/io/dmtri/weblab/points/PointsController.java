package io.dmtri.weblab.points;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/points")
public class PointsController {
    @GetMapping("/?")
    public String getAllPoints() {
        return "haha";
    }

    @PostMapping(value={"/", ""})
    public String test(
            @RequestBody
            CompoundPointRequest cpr
    ) {
        List<CompoundPointRequest.PointRequest> l = new LinkedList<>();

        Iterator<CompoundPointRequest.PointRequest> it = cpr.getIterator();

        while (it.hasNext()) {
            l.add(it.next());
        }

        return "Total of " + l.size() + " points received";
    }
}
