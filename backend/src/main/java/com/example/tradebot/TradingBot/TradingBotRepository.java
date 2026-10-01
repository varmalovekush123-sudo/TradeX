package com.example.tradebot.TradingBot;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TradingBotRepository extends MongoRepository<TradingBot, String> {

    List<TradingBot> findByUserId(String userId);
}
