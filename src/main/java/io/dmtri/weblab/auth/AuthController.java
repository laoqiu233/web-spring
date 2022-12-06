package io.dmtri.weblab.auth;

import io.dmtri.weblab.jwt.JwtPair;
import io.dmtri.weblab.jwt.JwtRefreshToken;
import io.dmtri.weblab.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService service;
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwt;

    @Autowired
    public AuthController(UserService service, UserRepository repository, PasswordEncoder encoder, JwtUtils jwt) {
        this.service = service;
        this.repository = repository;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @GetMapping("/users")
    public Iterable<User> getAllUsers() {
        return repository.findAll();
    }

    @GetMapping("/users/{username}")
    public User getUserInfo(@PathVariable String username) {
        try {
            return (User) service.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    @PostMapping("/login")
    public JwtPair login(@RequestBody AuthRequest request) {
        // Load user or throw exception
        UserDetails user;
        try {
            user = service.loadUserByUsername(request.username());
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect username or password");
        }

        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect username or password");
        }

        return new JwtPair(
                jwt.generateAccessToken(user),
                jwt.generateRefreshToken(user)
        );
    }

    @PostMapping("/refresh")
    public JwtPair refresh(@RequestBody JwtRefreshToken refreshToken) {
        if (jwt.validateRefreshToken(refreshToken.refreshToken())) {
            try {
                UserDetails user = service.loadUserByUsername(jwt.getClaims(refreshToken.refreshToken()).getSubject());
                return new JwtPair(
                    jwt.generateAccessToken(user),
                    jwt.generateRefreshToken(user)
                );
            } catch (UsernameNotFoundException ignored) {}
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
    }

    @PostMapping("/register")
    public JwtPair register(@RequestBody AuthRequest request) {
        // Validate
        if (!request.username().matches("^[a-zA-Z0-9_]{3,10}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad username");
        }

        if (!request.password().matches("^[a-zA-Z0-9_]{3,10}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad password");
        }

        if (repository.existsById(request.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A user with the same username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(encoder.encode(request.password()));
        repository.save(user);

        return new JwtPair(
                jwt.generateAccessToken(user),
                jwt.generateRefreshToken(user)
        );
    }
}
