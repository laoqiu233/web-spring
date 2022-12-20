package io.dmtri.weblab;

import io.dmtri.weblab.areas.Area;
import io.dmtri.weblab.areas.CircleArea;
import io.dmtri.weblab.areas.OrArea;
import io.dmtri.weblab.areas.QuadrantArea;
import io.dmtri.weblab.areas.RectangleArea;
import io.dmtri.weblab.areas.RotatedArea;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class WeblabApplication {
	public static void main(String[] args) {
		// Generate key
		// System.out.println(Encoders.BASE64.encode(Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded()));
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
