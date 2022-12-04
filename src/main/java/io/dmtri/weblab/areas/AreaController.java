package io.dmtri.weblab.areas;

import io.dmtri.weblab.utils.BitmapEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AreaController {
    private final static int BITMAP_RESOLUTION = 300;
    private final Area area;

    @Autowired
    public AreaController(Area area) {
        this.area = area;
    }

    @GetMapping("/area")
    public String getAreaBitmap() {
        return BitmapEncoder.encode(area.generateBitmap(BITMAP_RESOLUTION), BITMAP_RESOLUTION);
    }
}
