package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;
/**
 * Constraints an area in the specified quadrants.
 */
public class QuadrantArea extends AbstractArea {
    public static final int UPPER_RIGHT = 1;
    public static final int UPPER_LEFT  = 1 << 1;
    public static final int LOWER_LEFT  = 1 << 2;
    public static final int LOWER_RIGHT = 1 << 3;

    private final int quadrants;
    private final Area decoratedArea;

    public QuadrantArea(int quadrants, Area decoratedArea) {
        this.quadrants = quadrants;
        this.decoratedArea = decoratedArea;
    }

    @Override
    public boolean checkPoint(Point point) {
        if ((quadrants & UPPER_RIGHT) > 0 && point.x() >= 0 && point.y() >= 0) return decoratedArea.checkPoint(point);
        else if ((quadrants & UPPER_LEFT) > 0 && point.x() <= 0 && point.y() >= 0) return decoratedArea.checkPoint(point);
        else if ((quadrants & LOWER_LEFT) > 0 && point.x() <= 0 && point.y() <= 0) return decoratedArea.checkPoint(point);
        else if ((quadrants & LOWER_RIGHT) > 0 && point.x() >= 0 && point.y() <= 0) return decoratedArea.checkPoint(point);

        return false;
    }
}
