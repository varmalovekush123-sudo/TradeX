package com.example.tradebot.Bot;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BotRepository extends MongoRepository<Bot, String> {
}