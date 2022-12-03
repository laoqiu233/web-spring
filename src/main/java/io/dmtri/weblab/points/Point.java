package io.dmtri.weblab.points;

public class Point {
    private final float x;
    private final float y;
    private final float r;

    public Point(float x, float y, float r) {
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
