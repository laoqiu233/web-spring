package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;

/**
 * Describes a reactangular area centered in the origin 
 * with specified width and height.
 */
public class RectangleArea extends AbstractArea {
    private final double width;
    private final double height;

    public RectangleArea(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public boolean checkPoint(Point point) {
        return Math.abs(point.x()) < width * point.r() / 2 && Math.abs(point.y()) < height * point.r() / 2;
    }
}
