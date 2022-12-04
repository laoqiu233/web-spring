package io.dmtri.weblab.points;

import java.util.Iterator;

public class CompoundPointRequest {
    private float[] xs;
    private float[] ys;
    private float[] rs;

    public void setX(float[] x) {
        xs = x;
    }

    public void setY(float[] y) {
        ys = y;
    }

    public void setR(float[] r) {
        rs = r;
    }

    public Iterator<Point> getIterator() {
        return new Iterator<>() {
            private int xi = 0;
            private int yi = 0;
            private int ri = 0;

            @Override
            public boolean hasNext() {
                return xi < xs.length && yi < ys.length && ri < rs.length;
            }

            @Override
            public Point next() {
                Point point = new Point(xs[xi], ys[yi], rs[ri]);
                ri++;
                yi += ri / rs.length;
                ri %= rs.length;
                xi += yi / ys.length;
                yi %= ys.length;
                return point;
            }
        };
    }
}
