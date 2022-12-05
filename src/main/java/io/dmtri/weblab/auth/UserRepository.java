package io.dmtri.weblab.auth;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, String> {}