package io.dmtri.weblab.jwt;

import io.dmtri.weblab.auth.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.TemporalUnit;
import java.util.Date;

@Component
public class JwtUtils {
    private static final String TYPE_KEY        = "type";
    private static final String TYPE_ACCESS     = "access";
    // private static final int    ACCESS_EXPIRES  = 5 * 60; // 5 minutes
    private static final int    ACCESS_EXPIRES  = 10; // 10 seconds -- for testing
    private static final String TYPE_REFRESH    = "refresh";
    private static final int    REFRESH_EXPIRES = 30 * 24 * 60 * 60; // 30 days
    private final SecretKey key;

    public JwtUtils(@Value("${jwt.secret}") String secret) {
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateAccessToken(UserDetails user) {
        return buildToken((User) user, ACCESS_EXPIRES, TYPE_ACCESS);
    }

    public String generateRefreshToken(UserDetails user) {
        return buildToken((User) user, REFRESH_EXPIRES, TYPE_REFRESH);
    }

    private String buildToken(User user, int expiresInSeconds, String type) {
        return Jwts.builder()
                .setSubject(user.getId() + "|" + user.getUsername())
                .setExpiration(Date.from(Instant.now().plusSeconds(expiresInSeconds)))
                .claim(TYPE_KEY, type)
                .signWith(key)
                .compact();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, TYPE_ACCESS);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, TYPE_REFRESH);
    }

    private boolean validateToken(String token, String type) {
        try {
            Claims claims = getClaims(token);
            return claims.get(TYPE_KEY).toString().equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token).getBody();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject().split("\\|", 2)[1];
    }
}
