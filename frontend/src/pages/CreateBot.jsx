
import React, { useState } from "react";
import {
    ArrowLeft,
    Bot,
    Check,
    CircleDollarSign,
    ShieldCheck,
    Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CreateBot.css";

function CreateBot() {
    const navigate = useNavigate();

    const [botName, setBotName] = useState("");
    const [market, setMarket] = useState("Crypto");
    const [pair, setPair] = useState("BTC/USDT");
    const [strategy, setStrategy] = useState("Scalping");
    const [timeframe, setTimeframe] = useState("15m");
    const [investment, setInvestment] = useState("");
    const [stopLoss, setStopLoss] = useState("2");
    const [takeProfit, setTakeProfit] = useState("5");
    const [risk, setRisk] = useState("Medium");
    const [maxTrades, setMaxTrades] = useState("3");
    const [autoStart, setAutoStart] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const pairOptions = {
        Crypto: [
            "BTC/USDT",
            "ETH/USDT",
            "SOL/USDT",
            "BNB/USDT",
            "XRP/USDT"
        ],
        Forex: [
            "EUR/USD",
            "GBP/USD",
            "USD/JPY",
            "USD/INR"
        ],
        Stocks: [
            "AAPL",
            "TSLA",
            "NVDA",
            "MSFT"
        ]
    };

    const handleMarketChange = (value) => {
        setMarket(value);
        setPair(pairOptions[value][0]);
    };

    const createBot = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        const userId = localStorage.getItem("userId");

        console.log("Current User ID:", userId);

        if (!userId) {
            setMessage(
                "User login information not found. Please login again."
            );
            return;
        }

        if (!botName.trim()) {
            setMessage("Please enter a bot name.");
            return;
        }

        if (!investment || Number(investment) <= 0) {
            setMessage("Please enter a valid investment amount.");
            return;
        }

        if (Number(stopLoss) < 0 || Number(stopLoss) > 100) {
            setMessage("Stop Loss must be between 0 and 100.");
            return;
        }

        if (Number(takeProfit) < 0 || Number(takeProfit) > 100) {
            setMessage("Take Profit must be between 0 and 100.");
            return;
        }

        if (Number(maxTrades) < 1 || Number(maxTrades) > 50) {
            setMessage(
                "Maximum trades must be between 1 and 50."
            );
            return;
        }

        /*
         * IMPORTANT:
         * Ye fields exactly TradingBot.java ke fields
         * ke according bheje ja rahe hain.
         */
        const newBot = {
            userId: userId,
            name: botName.trim(),
            pair: pair,
            strategy: strategy,
            investment: Number(investment),
            status: autoStart ? "Running" : "Stopped",
            profit: 0,
            trades: 0
        };

        console.log("=================================");
        console.log("CREATE TRADING BOT");
        console.log("=================================");
        console.log("User ID:", userId);
        console.log("Bot data being sent:", newBot);

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:8182/api/trading-bots",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newBot)
                }
            );

            console.log(
                "Create Bot Response Status:",
                response.status
            );

            const responseText = await response.text();

            console.log(
                "Create Bot Raw Response:",
                responseText
            );

            if (!response.ok) {
                throw new Error(
                    `Backend returned ${response.status}: ${responseText}`
                );
            }

            let savedBot;

            try {
                savedBot = JSON.parse(responseText);
            } catch (error) {
                throw new Error(
                    "Backend returned invalid JSON response."
                );
            }

            console.log(
                "Trading Bot saved in MongoDB:",
                savedBot
            );

            /*
             * Verify that backend actually returned
             * the current user's bot.
             */
            if (!savedBot || !savedBot.id) {
                throw new Error(
                    "Bot was not saved correctly. Backend did not return bot ID."
                );
            }

            if (savedBot.userId !== userId) {
                console.error(
                    "USER ID MISMATCH:",
                    savedBot.userId,
                    userId
                );

                throw new Error(
                    "Bot saved with incorrect user ID."
                );
            }

            setMessage(
                autoStart
                    ? "Bot created and started successfully."
                    : "Bot created successfully."
            );

            /*
             * Small delay so success message can be seen.
             */
            setTimeout(() => {
                navigate("/trading-bots");
            }, 800);

        } catch (error) {
            console.error(
                "================================="
            );

            console.error(
                "CREATE BOT ERROR:",
                error
            );

            console.error(
                "================================="
            );

            setMessage(
                "Unable to create bot. Please check backend console."
            );

            setLoading(false);
        }
    };

    return (
        <div className="create-bot-page">

            <div className="create-bot-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="create-bot-heading">

                    <div className="heading-icon">
                        <Bot size={28} />
                    </div>

                    <div>
                        <h1>Create New Bot</h1>

                        <p>
                            Configure your automated trading strategy
                        </p>
                    </div>

                </div>

                <form
                    className="create-bot-form"
                    onSubmit={createBot}
                >

                    <section className="bot-form-section">

                        <div className="section-title">

                            <Bot size={19} />

                            <div>

                                <h2>
                                    Basic Configuration
                                </h2>

                                <p>
                                    Give your trading bot a name and select
                                    the market.
                                </p>

                            </div>

                        </div>

                        <div className="form-grid">

                            <div className="form-group full-width">

                                <label>
                                    Bot Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: My BTC Scalper"
                                    value={botName}
                                    onChange={(e) =>
                                        setBotName(e.target.value)
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Market
                                </label>

                                <select
                                    value={market}
                                    onChange={(e) =>
                                        handleMarketChange(e.target.value)
                                    }
                                >

                                    <option value="Crypto">
                                        Crypto
                                    </option>

                                    <option value="Forex">
                                        Forex
                                    </option>

                                    <option value="Stocks">
                                        Stocks
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Trading Pair
                                </label>

                                <select
                                    value={pair}
                                    onChange={(e) =>
                                        setPair(e.target.value)
                                    }
                                >

                                    {pairOptions[market].map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </section>

                    <section className="bot-form-section">

                        <div className="section-title">

                            <Zap size={19} />

                            <div>

                                <h2>
                                    Trading Strategy
                                </h2>

                                <p>
                                    Select how your bot should trade.
                                </p>

                            </div>

                        </div>

                        <div className="strategy-grid">

                            {[
                                {
                                    name: "Scalping",
                                    description:
                                        "Frequent short-term trades"
                                },
                                {
                                    name: "Grid Trading",
                                    description:
                                        "Buy and sell within price levels"
                                },
                                {
                                    name: "Trend Following",
                                    description:
                                        "Follow the current market trend"
                                },
                                {
                                    name: "Momentum",
                                    description:
                                        "Trade based on price momentum"
                                },
                                {
                                    name: "DCA",
                                    description:
                                        "Invest gradually over time"
                                }
                            ].map((item) => (

                                <button
                                    type="button"
                                    key={item.name}
                                    className={`strategy-card ${
                                        strategy === item.name
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setStrategy(item.name)
                                    }
                                >

                                    <div className="strategy-check">

                                        {strategy === item.name && (
                                            <Check size={14} />
                                        )}

                                    </div>

                                    <strong>
                                        {item.name}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>

                                </button>

                            ))}

                        </div>

                        <div className="form-grid strategy-settings">

                            <div className="form-group">

                                <label>
                                    Timeframe
                                </label>

                                <select
                                    value={timeframe}
                                    onChange={(e) =>
                                        setTimeframe(e.target.value)
                                    }
                                >

                                    <option value="1m">
                                        1 Minute
                                    </option>

                                    <option value="5m">
                                        5 Minutes
                                    </option>

                                    <option value="15m">
                                        15 Minutes
                                    </option>

                                    <option value="1h">
                                        1 Hour
                                    </option>

                                    <option value="4h">
                                        4 Hours
                                    </option>

                                    <option value="1d">
                                        1 Day
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Maximum Open Trades
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={maxTrades}
                                    onChange={(e) =>
                                        setMaxTrades(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </section>

                    <section className="bot-form-section">

                        <div className="section-title">

                            <ShieldCheck size={19} />

                            <div>

                                <h2>
                                    Risk Management
                                </h2>

                                <p>
                                    Control your potential losses and
                                    trading exposure.
                                </p>

                            </div>

                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Investment Amount
                                </label>

                                <div className="input-with-icon">

                                    <CircleDollarSign size={17} />

                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        placeholder="1000"
                                        value={investment}
                                        onChange={(e) =>
                                            setInvestment(e.target.value)
                                        }
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Risk Level
                                </label>

                                <select
                                    value={risk}
                                    onChange={(e) =>
                                        setRisk(e.target.value)
                                    }
                                >

                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Stop Loss %
                                </label>

                                <div className="percentage-input">

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={stopLoss}
                                        onChange={(e) =>
                                            setStopLoss(e.target.value)
                                        }
                                    />

                                    <span>
                                        %
                                    </span>

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Take Profit %
                                </label>

                                <div className="percentage-input">

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={takeProfit}
                                        onChange={(e) =>
                                            setTakeProfit(e.target.value)
                                        }
                                    />

                                    <span>
                                        %
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>

                    <section className="bot-start-section">

                        <div>

                            <strong>
                                Automatically start bot
                            </strong>

                            <p>
                                Start executing the strategy immediately
                                after creation.
                            </p>

                        </div>

                        <button
                            type="button"
                            className={`toggle-button ${
                                autoStart ? "active" : ""
                            }`}
                            onClick={() =>
                                setAutoStart(!autoStart)
                            }
                        >
                            <span></span>
                        </button>

                    </section>

                    {message && (
                        <div className="bot-success-message">

                            <Check size={17} />

                            {message}

                        </div>
                    )}

                    <div className="bot-summary">

                        <div>

                            <span>
                                Bot
                            </span>

                            <strong>
                                {botName || "Unnamed Bot"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Market
                            </span>

                            <strong>
                                {pair}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Strategy
                            </span>

                            <strong>
                                {strategy}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Risk
                            </span>

                            <strong>
                                {risk}
                            </strong>

                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-button"
                            disabled={loading}
                        >

                            <Bot size={18} />

                            {loading
                                ? "Creating..."
                                : "Create Bot"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateBot;
