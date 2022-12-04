package io.dmtri.weblab.areas;

import io.dmtri.weblab.points.Point;

public abstract class AbstractArea implements Area {
    /**
     * Generates a square image of the area.
     * This bitmap's x and y axis takes values relative to the R value.
     * Both axes' value range from -1.5r to 1.5r;
     * 
     * @param resolution Amount of pixels on each side
     * @return The generated bitmap
     */
    public boolean[][] generateBitmap(int resolution) {
        boolean[][] bitmap = new boolean[resolution][resolution];

        for (int i = 0; i < resolution; i++) {
            for (int j = 0; j < resolution; j++) {
                final double x = (((double)j / resolution) - 0.5) * 3;
                final double y = (((double)i / resolution) - 0.5) * -3;

                bitmap[i][j] = checkPoint(new Point(x, y, 1));
            }
        }

        return bitmap;
    }
}
