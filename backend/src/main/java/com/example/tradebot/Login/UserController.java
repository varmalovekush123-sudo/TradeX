package com.example.tradebot.Login;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public UserController(
            UserRepository userRepository,
            MongoTemplate mongoTemplate
    ) {
        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {

        System.out.println("LOGIN REQUEST RECEIVED");
        System.out.println("Email: " + user.getEmail());

        User savedUser = userRepository.save(user);

        System.out.println("SAVED ID: " + savedUser.getId());

        System.out.println("Mongo Database: "
                + mongoTemplate.getDb().getName());

        System.out.println("Mongo Collection: "
                + mongoTemplate.getCollectionName(User.class));

        System.out.println("Total users: "
                + userRepository.count());

        User checkUser =
                userRepository.findById(savedUser.getId()).orElse(null);

        if (checkUser != null) {
            System.out.println(
                    "VERIFY SUCCESS: " + checkUser.getEmail()
            );
        } else {
            System.out.println("VERIFY FAILED");
        }

        return savedUser;
    }
    @GetMapping("/mongo-debug")
    public String mongoDebug() {

        return "Database = " + mongoTemplate.getDb().getName();
    }
}