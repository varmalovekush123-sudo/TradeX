# TradeX MongoDB Setup

TradeX uses MongoDB as its database.

## Database

Database name:

```text
test


MongoDB runs locally on the default port:
27017

Spring Boot connection:
mongodb://localhost:27017/test

Collections

The TradeX backend currently uses three MongoDB collections:
users
bots
trading_bots


1. users

Java model:

com.example.tradebot.Login.User

MongoDB collection:

users

Fields:

_id
email
password

The password is stored as a BCrypt hash by the application.

2. bots

Java model:

com.example.tradebot.Bot.Bot

MongoDB collection:

bots

Fields:

_id
name
market
pair
strategy
timeframe
investment
stopLoss
takeProfit
risk
maxTrades
active
profit
createdAt
3. trading_bots

Java model:

com.example.tradebot.TradingBot.TradingBot

MongoDB collection:

trading_bots

Fields:

_id
userId
name
pair
strategy
status
investment
profit
trades
Local MongoDB Setup

Install and start MongoDB locally.

Open MongoDB Shell:

mongosh

Create/select the TradeX database:

use test

Check collections:

show collections

Expected collections:

users
bots
trading_bots
