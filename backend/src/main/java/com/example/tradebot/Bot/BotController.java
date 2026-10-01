package com.example.tradebot.Bot;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bots")
@CrossOrigin(origins = "http://localhost:5173")
public class BotController {

    private final BotService botService;

    public BotController(BotService botService) {
        this.botService = botService;
    }

    @PostMapping
    public ResponseEntity<Bot> createBot(
            @RequestBody Bot bot) {

        Bot savedBot = botService.createBot(bot);

        return ResponseEntity.ok(savedBot);
    }

    @GetMapping
    public ResponseEntity<List<Bot>> getAllBots() {

        return ResponseEntity.ok(
                botService.getAllBots()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bot> getBotById(
            @PathVariable String id) {

        Bot bot = botService.getBotById(id);

        if (bot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bot);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<Bot> startBot(
            @PathVariable String id) {

        Bot bot = botService.startBot(id);

        if (bot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bot);
    }

    @PutMapping("/{id}/stop")
    public ResponseEntity<Bot> stopBot(
            @PathVariable String id) {

        Bot bot = botService.stopBot(id);

        if (bot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBot(
            @PathVariable String id) {

        botService.deleteBot(id);

        return ResponseEntity.ok(
                "Bot deleted successfully"
        );
    }
}