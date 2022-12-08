package io.dmtri.weblab.points;

import java.util.List;

public record PagedPointsResponse (List<PointAttempt> points, int pageNum, int pageCount, long totalPointsCount){
}
