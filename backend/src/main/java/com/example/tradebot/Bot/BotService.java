package com.example.tradebot.Bot;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BotService {

    private final BotRepository botRepository;

    public BotService(BotRepository botRepository) {
        this.botRepository = botRepository;
    }

    public Bot createBot(Bot bot) {

        bot.setCreatedAt(LocalDateTime.now());

        return botRepository.save(bot);
    }

    public List<Bot> getAllBots() {

        return botRepository.findAll();
    }

    public Bot getBotById(String id) {

        return botRepository.findById(id).orElse(null);
    }

    public Bot startBot(String id) {

        Bot bot = botRepository.findById(id).orElse(null);

        if (bot == null) {
            return null;
        }

        bot.setActive(true);

        return botRepository.save(bot);
    }

    public Bot stopBot(String id) {

        Bot bot = botRepository.findById(id).orElse(null);

        if (bot == null) {
            return null;
        }

        bot.setActive(false);

        return botRepository.save(bot);
    }

    public void deleteBot(String id) {

        botRepository.deleteById(id);
    }
}