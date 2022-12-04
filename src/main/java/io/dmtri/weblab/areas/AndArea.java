package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;

/**
 * Returns true if all of the underlaying areas returned true.
 */
public class AndArea extends AbstractArea {
    private final Area[] decoratedAreas;

    public AndArea(Area ...areas) {
        this.decoratedAreas = areas;
    }

    @Override
    public boolean checkPoint(Point point) {
        for (Area area : decoratedAreas) {
            if (!area.checkPoint(point)) return false;
        }
        return true;
    }
}
