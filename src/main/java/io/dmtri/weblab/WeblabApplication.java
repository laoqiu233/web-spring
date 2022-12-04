package io.dmtri.weblab;

import io.dmtri.weblab.areas.Area;
import io.dmtri.weblab.areas.CircleArea;
import io.dmtri.weblab.areas.OrArea;
import io.dmtri.weblab.areas.QuadrantArea;
import io.dmtri.weblab.areas.RectangleArea;
import io.dmtri.weblab.areas.RotatedArea;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;

@SpringBootApplication
public class WeblabApplication {
	public static void main(String[] args) {
		SpringApplication.run(WeblabApplication.class, args);
	}

	@Bean
	@Scope("singleton")
	public Area globalAreaChecker() {
		return new OrArea(
				new QuadrantArea(QuadrantArea.UPPER_RIGHT, new CircleArea(1)),
				new QuadrantArea(QuadrantArea.LOWER_RIGHT, new RotatedArea(Math.PI * 45 / 180, new RectangleArea(Math.sqrt(2), Math.sqrt(2)))),
				new QuadrantArea(QuadrantArea.LOWER_LEFT, new RectangleArea(1, 2))
		);
	}
}
