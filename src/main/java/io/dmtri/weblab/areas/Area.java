package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;

public interface Area {
    boolean checkPoint(Point point);
    boolean[][] generateBitmap(int resolution);
}