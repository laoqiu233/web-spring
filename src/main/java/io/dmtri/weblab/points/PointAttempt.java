package io.dmtri.weblab.points;

import io.dmtri.weblab.areas.Area;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="point_attempts")
public class PointAttempt {
    @Id
    @GeneratedValue
    private long id;
    private double x;
    private double y;
    private double r;
    @Column(name="attempt_time", nullable=false)
    private long attemptTime;
    @Column(name="process_time", nullable = false)
    private double processTime;
    @Column(nullable = false)
    private boolean success;

    public PointAttempt() {}

    public PointAttempt(Point point, Area checker) {
        this();

        long start = System.nanoTime();
        setPoint(point);
        setSuccess(checker.checkPoint(point));
        setAttemptTime(System.currentTimeMillis());
        setProcessTime((System.nanoTime() - start) / 1000.0d);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Point getPoint() {
        return new Point(x, y, r);
    }

    public void setPoint(Point point) {
        x = point.x();
        y = point.y();
        r = point.r();
    }

    public long getAttemptTime() {
        return attemptTime;
    }

    public void setAttemptTime(long attemptTime) {
        this.attemptTime = attemptTime;
    }

    public double getProcessTime() {
        return processTime;
    }

    public void setProcessTime(double processTime) {
        this.processTime = processTime;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
