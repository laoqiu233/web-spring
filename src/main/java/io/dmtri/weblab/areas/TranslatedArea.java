package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;
/**
 * Translates the underlaying area by dx and dy units (in terms of R).
 */
public class TranslatedArea extends AbstractArea {
    private final double dx;
    private final double dy; 
    private final Area decoratedArea;

    public TranslatedArea(double dx, double dy, Area decoratedArea) {
        this.dx = dx;
        this.dy = dy;
        this.decoratedArea = decoratedArea;
    }

    @Override
    public boolean checkPoint(Point point) {
        // De-translate the point and pass to next checker
        return decoratedArea.checkPoint(new Point(point.x() - dx * point.r(), point.y() - dy * point.r(), point.r()));
    }
}
