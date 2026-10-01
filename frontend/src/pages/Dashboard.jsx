
import React, { useEffect, useMemo, useState } from "react";

import {
    LayoutDashboard,
    Bot,
    CandlestickChart,
    Search,
    Compass,
    FlaskConical,
    ShieldCheck,
    Wallet,
    KeyRound,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Activity,
    CircleDollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    MoreHorizontal,
    Zap,
    Clock3,
    ChevronDown,
    Globe,
    BriefcaseBusiness,
    RefreshCw
} from "lucide-react";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


const portfolioData = [
    { time: "09:00", value: 22000 },
    { time: "10:00", value: 22400 },
    { time: "11:00", value: 22100 },
    { time: "12:00", value: 23100 },
    { time: "13:00", value: 22800 },
    { time: "14:00", value: 23900 },
    { time: "15:00", value: 23400 },
    { time: "16:00", value: 25430 }
];


/*
 * Same crypto markets used in TradingTerminal.jsx
 */
const tradingMarkets = [
    {
        name: "Bitcoin",
        symbol: "BTC/USDT",
        binanceSymbol: "BTCUSDT"
    },
    {
        name: "Ethereum",
        symbol: "ETH/USDT",
        binanceSymbol: "ETHUSDT"
    },
    {
        name: "Solana",
        symbol: "SOL/USDT",
        binanceSymbol: "SOLUSDT"
    },
    {
        name: "BNB",
        symbol: "BNB/USDT",
        binanceSymbol: "BNBUSDT"
    },
    {
        name: "XRP",
        symbol: "XRP/USDT",
        binanceSymbol: "XRPUSDT"
    }
];


/*
 * Original dashboard market data
 * kept so the existing dashboard layout remains intact.
 */
const marketData = {
    Crypto: [
        {
            name: "Bitcoin",
            symbol: "BTC/USDT",
            binanceSymbol: "BTCUSDT",
            price: "67,842.50",
            change: "Live",
            up: true
        },
        {
            name: "Ethereum",
            symbol: "ETH/USDT",
            binanceSymbol: "ETHUSDT",
            price: "3,542.20",
            change: "Live",
            up: true
        },
        {
            name: "Solana",
            symbol: "SOL/USDT",
            binanceSymbol: "SOLUSDT",
            price: "182.45",
            change: "Live",
            up: true
        },
        {
            name: "BNB",
            symbol: "BNB/USDT",
            binanceSymbol: "BNBUSDT",
            price: "598.30",
            change: "Live",
            up: true
        },
        {
            name: "XRP",
            symbol: "XRP/USDT",
            binanceSymbol: "XRPUSDT",
            price: "0.00",
            change: "Live",
            up: true
        }
    ],

    Stocks: [
        {
            name: "Apple",
            symbol: "AAPL",
            price: "228.50",
            change: "+1.25%",
            up: true
        },
        {
            name: "Tesla",
            symbol: "TSLA",
            price: "342.80",
            change: "-0.80%",
            up: false
        },
        {
            name: "NVIDIA",
            symbol: "NVDA",
            price: "142.60",
            change: "+2.10%",
            up: true
        },
        {
            name: "Microsoft",
            symbol: "MSFT",
            price: "428.30",
            change: "+0.65%",
            up: true
        }
    ],

    Forex: [
        {
            name: "EUR/USD",
            symbol: "EUR/USD",
            price: "1.0842",
            change: "+0.12%",
            up: true
        },
        {
            name: "GBP/USD",
            symbol: "GBP/USD",
            price: "1.2935",
            change: "-0.08%",
            up: false
        },
        {
            name: "USD/JPY",
            symbol: "USD/JPY",
            price: "149.82",
            change: "+0.32%",
            up: true
        },
        {
            name: "USD/INR",
            symbol: "USD/INR",
            price: "83.95",
            change: "+0.04%",
            up: true
        }
    ],

    Commodities: [
        {
            name: "Gold",
            symbol: "XAU/USD",
            price: "2,685.40",
            change: "+0.55%",
            up: true
        },
        {
            name: "Silver",
            symbol: "XAG/USD",
            price: "31.25",
            change: "-0.20%",
            up: false
        },
        {
            name: "Crude Oil",
            symbol: "WTI",
            price: "71.80",
            change: "+1.10%",
            up: true
        },
        {
            name: "Natural Gas",
            symbol: "NG",
            price: "3.12",
            change: "-0.35%",
            up: false
        }
    ]
};


const initialBots = [
    {
        id: 1,
        name: "Alpha Scalper",
        pair: "BTC/USDT",
        strategy: "Scalping",
        pnl: "+$124.50",
        active: true
    },
    {
        id: 2,
        name: "BTC Grid Bot",
        pair: "BTC/USDT",
        strategy: "Grid Trading",
        pnl: "+$82.30",
        active: true
    },
    {
        id: 3,
        name: "Forex Trend",
        pair: "EUR/USD",
        strategy: "Trend Following",
        pnl: "+$45.80",
        active: false
    },
    {
        id: 4,
        name: "ETH Momentum",
        pair: "ETH/USDT",
        strategy: "Momentum",
        pnl: "-$12.40",
        active: true
    }
];


const initialTrades = [
    {
        id: 1,
        time: "10:42:18",
        bot: "Alpha Scalper",
        asset: "BTC/USDT",
        type: "BUY",
        price: "$67,842.50",
        pnl: "+$24.50"
    },
    {
        id: 2,
        time: "10:38:45",
        bot: "BTC Grid Bot",
        asset: "BTC/USDT",
        type: "SELL",
        price: "$67,810.20",
        pnl: "+$12.30"
    },
    {
        id: 3,
        time: "10:31:12",
        bot: "ETH Momentum",
        asset: "ETH/USDT",
        type: "BUY",
        price: "$3,542.20",
        pnl: "-$8.40"
    },
    {
        id: 4,
        time: "10:24:09",
        bot: "Forex Trend",
        asset: "EUR/USD",
        type: "SELL",
        price: "1.0842",
        pnl: "+$18.20"
    }
];


const navItems = [
    {
        label: "Overview",
        icon: LayoutDashboard
    },
    {
        label: "Trading Bots",
        icon: Bot
    },
    {
        label: "Trading Terminal",
        icon: CandlestickChart
    },
    {
        label: "Market Explorer",
        icon: Compass
    },
    {
        label: "Backtesting",
        icon: FlaskConical
    },
    {
        label: "Risk Management",
        icon: ShieldCheck
    },
    {
        label: "Portfolio",
        icon: Wallet
    },
    {
        label: "API Keys",
        icon: KeyRound
    },
    {
        label: "Alerts",
        icon: Bell
    },
    {
        label: "Settings",
        icon: Settings
    }
];


function Dashboard() {

    const navigate = useNavigate();

    const [activeNav, setActiveNav] =
        useState("Overview");

    const [marketType, setMarketType] =
        useState("Crypto");

    const [chartRange, setChartRange] =
        useState("1D");

    const [bots, setBots] =
        useState(initialBots);

    const [search, setSearch] =
        useState("");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [livePrices, setLivePrices] =
        useState({});

    const [selectedMarket, setSelectedMarket] =
        useState(null);


    /*
     * Get previously selected market
     */
    useEffect(() => {

        const savedMarket =
            localStorage.getItem(
                "selectedTradingMarket"
            );

        if (savedMarket) {

            try {

                const saved =
                    JSON.parse(savedMarket);

                const found =
                    tradingMarkets.find(
                        market =>
                            market.symbol ===
                            saved.symbol
                    );

                if (found) {
                    setSelectedMarket(found);
                    return;
                }

            } catch (error) {

                console.error(
                    "Saved market error:",
                    error
                );

            }
        }

        setSelectedMarket(
            tradingMarkets[0]
        );

    }, []);


    /*
     * Get live prices from Binance
     */
    useEffect(() => {

        let cancelled = false;

        const loadPrices = async () => {

            try {

                const requests =
                    tradingMarkets.map(
                        async market => {

                            const response =
                                await fetch(
                                    `https://api.binance.com/api/v3/ticker/price?symbol=${market.binanceSymbol}`
                                );

                            if (!response.ok) {
                                throw new Error(
                                    "Price request failed"
                                );
                            }

                            const data =
                                await response.json();

                            return {
                                symbol:
                                    market.binanceSymbol,
                                price:
                                    Number(
                                        data.price
                                    )
                            };
                        }
                    );

                const results =
                    await Promise.all(
                        requests
                    );

                if (cancelled) {
                    return;
                }

                const prices = {};

                results.forEach(item => {

                    prices[item.symbol] =
                        item.price;

                });

                setLivePrices(prices);

            } catch (error) {

                console.error(
                    "Live market price error:",
                    error
                );

            }

        };

        loadPrices();

        const interval =
            setInterval(
                loadPrices,
                5000
            );

        return () => {

            cancelled = true;

            clearInterval(
                interval
            );

        };

    }, []);


    /*
     * Select market
     */
    const selectMarket = market => {

        setSelectedMarket(market);

        localStorage.setItem(
            "selectedTradingMarket",
            JSON.stringify(market)
        );

        setSearch("");

    };


    /*
     * Search result list
     */
    const searchedMarkets =
        useMemo(() => {

            const value =
                search
                    .trim()
                    .toLowerCase();

            if (!value) {
                return [];
            }

            return tradingMarkets.filter(
                market =>
                    market.name
                        .toLowerCase()
                        .includes(value) ||
                    market.symbol
                        .toLowerCase()
                        .includes(value) ||
                    market.binanceSymbol
                        .toLowerCase()
                        .includes(value)
            );

        }, [search]);


    /*
     * Current selected market price
     */
    const selectedMarketPrice =
        selectedMarket
            ? livePrices[
                  selectedMarket
                      .binanceSymbol
              ]
            : null;


    const activeCount =
        bots.filter(
            bot => bot.active
        ).length;


    const toggleBot = id => {

        setBots(prev =>
            prev.map(bot =>
                bot.id === id
                    ? {
                          ...bot,
                          active:
                              !bot.active
                      }
                    : bot
            )
        );

    };


    const logout = () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "userEmail"
        );

        localStorage.removeItem(
            "selectedTradingMarket"
        );

        navigate("/");

    };


    /*
     * Existing market table search
     */
    const filteredMarkets =
        (marketData[marketType] || []).filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                item.symbol
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );


    /*
     * Open selected market in terminal
     */
    const openTradingTerminal =
        market => {

            selectMarket(market);

            navigate(
                "/trading-terminal"
            );

        };


    /*
     * Sidebar navigation
     */
    const handleNavigation =
        label => {

            setActiveNav(label);

            setSidebarOpen(false);

            if (
                label ===
                "Trading Bots"
            ) {

                navigate(
                    "/trading-bots"
                );

            } else if (
                label ===
                "Trading Terminal"
            ) {

                navigate(
                    "/trading-terminal"
                );

            }

        };


    return (

        <div className="dashboard-layout">


            {/* SIDEBAR */}

            <aside
                className={`sidebar ${
                    sidebarOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >

                <div className="sidebar-brand">

                    <div className="sidebar-logo">

                        <TrendingUp
                            size={25}
                        />

                    </div>

                    <div>

                        <h2>
                            TradeX
                        </h2>

                        <span>
                            Trading Platform
                        </span>

                    </div>

                    <button
                        className="mobile-close"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                    >

                        <X size={20} />

                    </button>

                </div>


                <div className="sidebar-section-label">
                    MAIN MENU
                </div>


                <nav className="sidebar-nav">

                    {navItems.map(item => {

                        const Icon =
                            item.icon;

                        return (

                            <button
                                key={
                                    item.label
                                }
                                className={`nav-item ${
                                    activeNav ===
                                    item.label
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleNavigation(
                                        item.label
                                    )
                                }
                            >

                                <Icon
                                    size={19}
                                />

                                <span>
                                    {
                                        item.label
                                    }
                                </span>

                            </button>

                        );

                    })}

                </nav>


                <div className="sidebar-bottom">

                    <div className="upgrade-card">

                        <div className="upgrade-icon">

                            <Zap size={20} />

                        </div>

                        <h4>
                            Trading Pro
                        </h4>

                        <p>
                            Manage your automated
                            trading strategies.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/trading-bots"
                                )
                            }
                        >

                            Explore Bots

                            <ArrowUpRight
                                size={15}
                            />

                        </button>

                    </div>


                    <button
                        className="nav-item logout-item"
                        onClick={logout}
                    >

                        <LogOut
                            size={19}
                        />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {sidebarOpen && (

                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(
                            false
                        )
                    }
                />

            )}


            {/* MAIN */}

            <main className="dashboard-main">


                {/* TOPBAR */}

                <header className="dashboard-topbar">

                    <div className="topbar-left">

                        <button
                            className="mobile-menu"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                        >

                            <Menu size={22} />

                        </button>


                        <div>

                            <div className="breadcrumb">

                                Workspace

                                <span>
                                    /
                                </span>

                                {activeNav}

                            </div>

                            <h1>
                                {activeNav}
                            </h1>

                        </div>

                    </div>


                    <div className="topbar-right">


                        {/* MARKET SEARCH */}

                        <div className="global-search">

                            <Search
                                size={17}
                            />

                            <input
                                placeholder="Search markets..."
                                value={
                                    search
                                }
                                onChange={e =>
                                    setSearch(
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <span className="search-shortcut">
                                /
                            </span>


                            {search.trim() && (

                                <div className="market-search-dropdown">

                                    {searchedMarkets.length >
                                    0 ? (

                                        searchedMarkets.map(
                                            market => {

                                                const price =
                                                    livePrices[
                                                        market
                                                            .binanceSymbol
                                                    ];

                                                return (

                                                    <button
                                                        key={
                                                            market.symbol
                                                        }
                                                        className="market-search-result"
                                                        onClick={() =>
                                                            selectMarket(
                                                                market
                                                            )
                                                        }
                                                    >

                                                        <div className="market-search-left">

                                                            <div className="market-search-icon">

                                                                {
                                                                    market.name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                }

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        market.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        market.symbol
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>


                                                        <strong>

                                                            {price
                                                                ? `$${price.toLocaleString(
                                                                      "en-US",
                                                                      {
                                                                          maximumFractionDigits: 4
                                                                      }
                                                                  )}`
                                                                : "--"}

                                                        </strong>

                                                    </button>

                                                );

                                            }
                                        )

                                    ) : (

                                        <div className="market-search-empty">

                                            No matching
                                            market found.

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>


                        <div className="market-status">

                            <span className="status-dot"></span>

                            Markets

                        </div>


                        <button
                            className="icon-button"
                            title="Refresh"
                            onClick={() =>
                                window.location.reload()
                            }
                        >

                            <RefreshCw
                                size={18}
                            />

                        </button>


                        <button className="icon-button notification-button">

                            <Bell size={19} />

                            <span></span>

                        </button>


                        <div className="topbar-profile">

                            <div className="profile-avatar">
                                U
                            </div>

                            <div className="profile-info">

                                <strong>
                                    User
                                </strong>

                                <span>
                                    Trader Account
                                </span>

                            </div>

                            <ChevronDown
                                size={15}
                            />

                        </div>

                    </div>

                </header>


                <div className="dashboard-content">


                    {/* WELCOME */}

                    <div className="welcome-row">

                        <div>

                            <h2>
                                Welcome back,
                                Trader <span>👋</span>
                            </h2>

                            <p>

                                {selectedMarket
                                    ? `Viewing ${selectedMarket.name} (${selectedMarket.symbol})`
                                    : "Here's what's happening with your trading portfolio today."}

                            </p>

                        </div>


                        <button
                            className="primary-action"
                            onClick={() =>
                                navigate(
                                    "/create-bot"
                                )
                            }
                        >

                            <Plus size={18} />

                            Create New Bot

                        </button>

                    </div>


                    {/* SELECTED MARKET */}

                    {selectedMarket && (

                        <section className="panel selected-market-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Selected Market
                                    </h3>

                                    <p>
                                        Market selected
                                        from search
                                    </p>

                                </div>


                                <button
                                    className="view-all-button"
                                    onClick={() =>
                                        openTradingTerminal(
                                            selectedMarket
                                        )
                                    }
                                >

                                    Open Terminal

                                    <ArrowUpRight
                                        size={16}
                                    />

                                </button>

                            </div>


                            <div className="selected-market-content">

                                <div className="asset-name">

                                    <div className="asset-icon asset-0">

                                        {
                                            selectedMarket.name
                                                .charAt(
                                                    0
                                                )
                                        }

                                    </div>

                                    <div>

                                        <strong>
                                            {
                                                selectedMarket.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                selectedMarket.symbol
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <span>
                                        Live Price
                                    </span>

                                    <h3>

                                        {selectedMarketPrice
                                            ? `$${selectedMarketPrice.toLocaleString(
                                                  "en-US",
                                                  {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 4
                                                  }
                                              )}`
                                            : "--"}

                                    </h3>

                                </div>


                                <div>

                                    <span className="positive">

                                        <span className="status-dot"></span>

                                        Live

                                    </span>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* STATS */}

                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-top">

                                <span>
                                    Total Balance
                                </span>

                                <div className="stat-icon green">

                                    <Wallet
                                        size={20}
                                    />

                                </div>

                            </div>

                            <h3>
                                $25,430.80
                            </h3>

                            <div className="stat-bottom">

                                <span className="positive">

                                    <TrendingUp
                                        size={15}
                                    />

                                    +2.45%

                                </span>

                                <span>
                                    vs. last 24h
                                </span>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <span>
                                    Daily P&L
                                </span>

                                <div className="stat-icon blue">

                                    <Activity
                                        size={20}
                                    />

                                </div>

                            </div>

                            <h3 className="positive">
                                +$450.50
                            </h3>

                            <div className="stat-bottom">

                                <span className="positive">

                                    <TrendingUp
                                        size={15}
                                    />

                                    +1.78%

                                </span>

                                <span>
                                    today
                                </span>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <span>
                                    Active Capital
                                </span>

                                <div className="stat-icon purple">

                                    <CircleDollarSign
                                        size={20}
                                    />

                                </div>

                            </div>

                            <h3>
                                $18,200.00
                            </h3>

                            <div className="stat-bottom">

                                <span className="neutral">
                                    71.5%
                                </span>

                                <span>
                                    of total balance
                                </span>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <span>
                                    Selected Market
                                </span>

                                <div className="stat-icon orange">

                                    <TrendingUp
                                        size={20}
                                    />

                                </div>

                            </div>

                            <h3>

                                {selectedMarket
                                    ? selectedMarket.symbol
                                    : "--"}

                            </h3>

                            <div className="stat-bottom">

                                <span className="positive">

                                    {selectedMarketPrice
                                        ? `$${selectedMarketPrice.toLocaleString(
                                              "en-US",
                                              {
                                                  maximumFractionDigits: 4
                                              }
                                          )}`
                                        : "--"}

                                </span>

                                <span>
                                    Live Price
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* CHART + BOT */}

                    <section className="main-grid">


                        <div className="panel portfolio-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Portfolio Performance
                                    </h3>

                                    <p>
                                        Track your portfolio
                                        equity over time
                                    </p>

                                </div>

                                <button className="more-button">

                                    <MoreHorizontal
                                        size={21}
                                    />

                                </button>

                            </div>


                            <div className="portfolio-value-row">

                                <div>

                                    <h2>
                                        $25,430.80
                                    </h2>

                                    <span className="positive">

                                        <ArrowUpRight
                                            size={16}
                                        />

                                        +$2,430.80
                                        (12.8%)

                                    </span>

                                </div>


                                <div className="range-tabs">

                                    {[
                                        "1D",
                                        "1W",
                                        "1M",
                                        "1Y",
                                        "ALL"
                                    ].map(
                                        range => (

                                            <button
                                                key={
                                                    range
                                                }
                                                className={
                                                    chartRange ===
                                                    range
                                                        ? "selected"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setChartRange(
                                                        range
                                                    )
                                                }
                                            >

                                                {
                                                    range
                                                }

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>


                            <div className="portfolio-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <AreaChart
                                        data={
                                            portfolioData
                                        }
                                        margin={{
                                            top: 15,
                                            right: 8,
                                            left: -15,
                                            bottom: 0
                                        }}
                                    >

                                        <defs>

                                            <linearGradient
                                                id="portfolioGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >

                                                <stop
                                                    offset="0%"
                                                    stopColor="#00D084"
                                                    stopOpacity={
                                                        0.25
                                                    }
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#00D084"
                                                    stopOpacity={
                                                        0
                                                    }
                                                />

                                            </linearGradient>

                                        </defs>


                                        <CartesianGrid
                                            stroke="#1E293B"
                                            strokeDasharray="4 4"
                                            vertical={
                                                false
                                            }
                                        />


                                        <XAxis
                                            dataKey="time"
                                            stroke="#66758B"
                                            tickLine={
                                                false
                                            }
                                            axisLine={
                                                false
                                            }
                                            fontSize={
                                                11
                                            }
                                        />


                                        <YAxis
                                            stroke="#66758B"
                                            tickLine={
                                                false
                                            }
                                            axisLine={
                                                false
                                            }
                                            fontSize={
                                                11
                                            }
                                            tickFormatter={
                                                value =>
                                                    `$${(
                                                        value /
                                                        1000
                                                    ).toFixed(
                                                        0
                                                    )}k`
                                            }
                                        />


                                        <Tooltip
                                            contentStyle={{
                                                background:
                                                    "#101927",
                                                border:
                                                    "1px solid #29364A",
                                                borderRadius:
                                                    "10px",
                                                color:
                                                    "#fff"
                                            }}
                                            formatter={
                                                value => [
                                                    `$${value.toLocaleString()}`,
                                                    "Balance"
                                                ]
                                            }
                                        />


                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#00D084"
                                            strokeWidth={
                                                2.5
                                            }
                                            fill="url(#portfolioGradient)"
                                            activeDot={{
                                                r: 5,
                                                fill:
                                                    "#00D084"
                                            }}
                                        />

                                    </AreaChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        {/* BOT BOARD */}

                        <div className="panel bots-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Bot Quick Controls
                                    </h3>

                                    <p>
                                        Manage your automated
                                        strategies
                                    </p>

                                </div>

                                <span className="bot-count">

                                    {activeCount}/
                                    {bots.length}
                                    {" "}Active

                                </span>

                            </div>


                            <div className="bot-list">

                                {bots.map(bot => (

                                    <div
                                        className="bot-row"
                                        key={
                                            bot.id
                                        }
                                    >

                                        <div
                                            className={`bot-avatar ${
                                                bot.active
                                                    ? "bot-active"
                                                    : ""
                                            }`}
                                        >

                                            <Bot
                                                size={
                                                    21
                                                }
                                            />

                                        </div>


                                        <div className="bot-info">

                                            <strong>
                                                {
                                                    bot.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    bot.pair
                                                }{" "}
                                                ·{" "}
                                                {
                                                    bot.strategy
                                                }
                                            </span>

                                            <span
                                                className={
                                                    bot.pnl.startsWith(
                                                        "+"
                                                    )
                                                        ? "positive"
                                                        : "negative"
                                                }
                                            >

                                                {
                                                    bot.pnl
                                                }

                                            </span>

                                        </div>


                                        <button
                                            className={`bot-toggle ${
                                                bot.active
                                                    ? "on"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleBot(
                                                    bot.id
                                                )
                                            }
                                            aria-label={`${bot.active ? "Stop" : "Start"} ${bot.name}`}
                                        >

                                            <span></span>

                                        </button>

                                    </div>

                                ))}

                            </div>


                            <button
                                className="view-all-button"
                                onClick={() =>
                                    navigate(
                                        "/trading-bots"
                                    )
                                }
                            >

                                View All Bots

                                <ArrowUpRight
                                    size={16}
                                />

                            </button>

                        </div>

                    </section>


                    {/* MARKETS */}

                    <section className="panel markets-panel">

                        <div className="panel-header">

                            <div>

                                <h3>
                                    Market Overview
                                </h3>

                                <p>
                                    Explore prices across
                                    different asset classes
                                </p>

                            </div>

                            <button
                                className="view-all-button"
                                onClick={() =>
                                    setActiveNav(
                                        "Market Explorer"
                                    )
                                }
                            >

                                Explore Markets

                                <ArrowUpRight
                                    size={16}
                                />

                            </button>

                        </div>


                        <div className="market-tabs">

                            {[
                                {
                                    name: "Crypto",
                                    icon: CircleDollarSign
                                },
                                {
                                    name: "Stocks",
                                    icon: BriefcaseBusiness
                                },
                                {
                                    name: "Forex",
                                    icon: Globe
                                },
                                {
                                    name: "Commodities",
                                    icon: Activity
                                }
                            ].map(item => {

                                const Icon =
                                    item.icon;

                                return (

                                    <button
                                        key={
                                            item.name
                                        }
                                        className={
                                            marketType ===
                                            item.name
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setMarketType(
                                                item.name
                                            )
                                        }
                                    >

                                        <Icon
                                            size={16}
                                        />

                                        {
                                            item.name
                                        }

                                    </button>

                                );

                            })}

                        </div>


                        <div className="market-table-wrap">

                            <table className="market-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Asset
                                        </th>

                                        <th>
                                            Symbol
                                        </th>

                                        <th>
                                            Last Price
                                        </th>

                                        <th>
                                            24h Change
                                        </th>

                                        <th>
                                            Trend
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredMarkets.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const livePrice =
                                                item.binanceSymbol
                                                    ? livePrices[
                                                          item
                                                              .binanceSymbol
                                                      ]
                                                    : null;

                                            return (

                                                <tr
                                                    key={
                                                        item.symbol
                                                    }
                                                    onClick={() => {

                                                        const tradingMarket =
                                                            tradingMarkets.find(
                                                                market =>
                                                                    market.symbol ===
                                                                    item.symbol
                                                            );

                                                        if (
                                                            tradingMarket
                                                        ) {
                                                            selectMarket(
                                                                tradingMarket
                                                            );
                                                        }

                                                    }}
                                                    style={{
                                                        cursor:
                                                            item.binanceSymbol
                                                                ? "pointer"
                                                                : "default"
                                                    }}
                                                >

                                                    <td>

                                                        <div className="asset-name">

                                                            <div
                                                                className={`asset-icon asset-${index}`}
                                                            >

                                                                {
                                                                    item.name.slice(
                                                                        0,
                                                                        1
                                                                    )
                                                                }

                                                            </div>

                                                            <strong>
                                                                {
                                                                    item.name
                                                                }
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    <td className="muted-cell">

                                                        {
                                                            item.symbol
                                                        }

                                                    </td>


                                                    <td className="price-cell">

                                                        {livePrice
                                                            ? `$${livePrice.toLocaleString(
                                                                  "en-US",
                                                                  {
                                                                      maximumFractionDigits: 4
                                                                  }
                                                              )}`
                                                            : `$${item.price}`}

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                item.up
                                                                    ? "change-pill up"
                                                                    : "change-pill down"
                                                            }
                                                        >

                                                            {item.up ? (
                                                                <ArrowUpRight
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            ) : (
                                                                <ArrowDownRight
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            )}

                                                            {
                                                                item.change
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div
                                                            className={`mini-trend ${
                                                                item.up
                                                                    ? "trend-up"
                                                                    : "trend-down"
                                                            }`}
                                                        >

                                                            {item.up ? (
                                                                <TrendingUp
                                                                    size={
                                                                        26
                                                                    }
                                                                />
                                                            ) : (
                                                                <TrendingDown
                                                                    size={
                                                                        26
                                                                    }
                                                                />
                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>


                            {filteredMarkets.length ===
                                0 && (

                                <div className="empty-state">

                                    No matching
                                    markets found.

                                </div>

                            )}

                        </div>

                    </section>


                    {/* RECENT TRADES + ALERTS */}

                    <section className="bottom-grid">


                        <div className="panel trades-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Recent Bot Executions
                                    </h3>

                                    <p>
                                        Your latest automated
                                        trades
                                    </p>

                                </div>

                                <button
                                    className="view-all-button"
                                    onClick={() =>
                                        navigate(
                                            "/trading-terminal"
                                        )
                                    }
                                >

                                    View All

                                    <ArrowUpRight
                                        size={15}
                                    />

                                </button>

                            </div>


                            <div className="trade-table-wrap">

                                <table className="trade-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                Bot / Asset
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                P&L
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {initialTrades.map(
                                            trade => (

                                                <tr
                                                    key={
                                                        trade.id
                                                    }
                                                >

                                                    <td className="muted-cell">

                                                        {
                                                            trade.time
                                                        }

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                trade.bot
                                                            }
                                                        </strong>

                                                        <span className="table-subtitle">

                                                            {
                                                                trade.asset
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`trade-type ${trade.type.toLowerCase()}`}
                                                        >

                                                            {
                                                                trade.type
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>
                                                        {
                                                            trade.price
                                                        }
                                                    </td>


                                                    <td
                                                        className={
                                                            trade.pnl.startsWith(
                                                                "+"
                                                            )
                                                                ? "positive"
                                                                : "negative"
                                                        }
                                                    >

                                                        {
                                                            trade.pnl
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* ALERTS */}

                        <div className="panel alerts-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Live Alerts
                                    </h3>

                                    <p>
                                        Recent bot activity
                                        and signals
                                    </p>

                                </div>

                                <button className="more-button">

                                    <MoreHorizontal
                                        size={21}
                                    />

                                </button>

                            </div>


                            <div className="alert-list">

                                <div className="alert-item">

                                    <div className="alert-icon alert-green">

                                        <ArrowUpRight
                                            size={18}
                                        />

                                    </div>

                                    <div className="alert-content">

                                        <strong>
                                            Buy signal executed
                                        </strong>

                                        <p>
                                            Alpha Scalper bought
                                            BTC/USDT
                                        </p>

                                        <span>

                                            <Clock3
                                                size={12}
                                            />

                                            10:42 AM

                                        </span>

                                    </div>

                                </div>


                                <div className="alert-item">

                                    <div className="alert-icon alert-blue">

                                        <Activity
                                            size={18}
                                        />

                                    </div>

                                    <div className="alert-content">

                                        <strong>
                                            Target reached
                                        </strong>

                                        <p>
                                            BTC Grid Bot completed
                                            a grid level
                                        </p>

                                        <span>

                                            <Clock3
                                                size={12}
                                            />

                                            10:38 AM

                                        </span>

                                    </div>

                                </div>


                                <div className="alert-item">

                                    <div className="alert-icon alert-orange">

                                        <ShieldCheck
                                            size={18}
                                        />

                                    </div>

                                    <div className="alert-content">

                                        <strong>
                                            Risk check completed
                                        </strong>

                                        <p>
                                            Portfolio risk is within
                                            configured limits
                                        </p>

                                        <span>

                                            <Clock3
                                                size={12}
                                            />

                                            10:30 AM

                                        </span>

                                    </div>

                                </div>


                                <div className="alert-item">

                                    <div className="alert-icon alert-purple">

                                        <Bot
                                            size={18}
                                        />

                                    </div>

                                    <div className="alert-content">

                                        <strong>
                                            Bot started
                                        </strong>

                                        <p>
                                            ETH Momentum is now
                                            running
                                        </p>

                                        <span>

                                            <Clock3
                                                size={12}
                                            />

                                            10:15 AM

                                        </span>

                                    </div>

                                </div>

                            </div>


                            <button className="view-all-button alerts-view">

                                View All Alerts

                                <ArrowUpRight
                                    size={15}
                                />

                            </button>

                        </div>

                    </section>


                    {/* FOOTER */}

                    <footer className="dashboard-footer">

                        <span>
                            © 2026 TradeX.
                            All rights reserved.
                        </span>

                        <span className="demo-notice">
                            Live market prices ·
                            Trading in Demo Mode
                        </span>

                    </footer>

                </div>

            </main>

        </div>

    );
}


export default Dashboard;
