package com.webii.repository;

import com.webii.entity.Client;
import com.webii.entity.User;
import com.webii.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(Long userId);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}
