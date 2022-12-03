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

    public Iterator<PointRequest> getIterator() {
        return new Iterator<>() {
            private int xi = 0;
            private int yi = 0;
            private int ri = 0;

            @Override
            public boolean hasNext() {
                return xi < xs.length && yi < ys.length && ri < rs.length;
            }

            @Override
            public PointRequest next() {
                PointRequest pr = new PointRequest(xs[xi], ys[yi], rs[ri]);
                ri++;
                yi += ri / rs.length;
                ri %= rs.length;
                xi += yi / ys.length;
                yi %= ys.length;
                return pr;
            }
        };
    }

    public static class PointRequest {
        private final float x;
        private final float y;
        private final float r;

        private PointRequest(float x, float y, float r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }

        public float getX() {
            return x;
        }

        public float getY() {
            return y;
        }

        public float getR() {
            return r;
        }
    }
}
