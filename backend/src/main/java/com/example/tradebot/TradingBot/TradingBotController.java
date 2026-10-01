 package com.example.tradebot.TradingBot;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trading-bots")
@CrossOrigin(origins = "http://localhost:5173")
public class TradingBotController {

    private final TradingBotRepository tradingBotRepository;

    public TradingBotController(TradingBotRepository tradingBotRepository) {
        this.tradingBotRepository = tradingBotRepository;
    }

    @PostMapping
    public TradingBot createBot(@RequestBody TradingBot bot) {

        bot.setStatus("Stopped");
        bot.setProfit(0);
        bot.setTrades(0);

        return tradingBotRepository.save(bot);
    }

    @GetMapping("/user/{userId}")
    public List<TradingBot> getUserBots(@PathVariable String userId) {

        return tradingBotRepository.findByUserId(userId);
    }

    @PutMapping("/{id}/status")
    public TradingBot updateStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {

        if (!status.equals("Running") && !status.equals("Stopped")) {
            throw new RuntimeException("Invalid bot status");
        }

        TradingBot bot = tradingBotRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bot not found")
                );

        bot.setStatus(status);

        return tradingBotRepository.save(bot);
    }

    @DeleteMapping("/{id}")
    public String deleteBot(@PathVariable String id) {

        if (!tradingBotRepository.existsById(id)) {
            return "Bot not found";
        }

        tradingBotRepository.deleteById(id);

        return "Bot deleted successfully";
    }
}

