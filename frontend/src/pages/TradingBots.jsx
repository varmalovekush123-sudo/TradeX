
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Bot,
  Play,
  Pause,
  Settings,
  Trash2,
  TrendingUp,
  DollarSign,
  Activity,
  X,
  SlidersHorizontal,
} from "lucide-react";
import "./TradingBots.css";

function TradingBots() {

  const API_URL = "http://localhost:8182/api/trading-bots";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newBot, setNewBot] = useState({
    name: "",
    pair: "BTC/USDT",
    strategy: "Scalping",
    investment: "",
  });

  /*
   * Get logged-in user ID
   */
  const userId = localStorage.getItem("userId");

  /*
   * Load user's trading bots
   */
  useEffect(() => {

    if (!userId) {
      console.log("User ID not found");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/user/${userId}`)
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to load trading bots");
        }

        return response.json();
      })
      .then((data) => {

        setBots(data);
        setLoading(false);
      })
      .catch((error) => {

        console.error("Trading bot loading error:", error);
        setLoading(false);
      });

  }, [userId]);

  /*
   * Start / Stop trading bot
   */
  const toggleBot = async (id, currentStatus) => {

    const newStatus =
      currentStatus === "Running"
        ? "Stopped"
        : "Running";

    try {

      const response = await fetch(
        `${API_URL}/${id}/status?status=${newStatus}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bot status");
      }

      const updatedBot = await response.json();

      setBots((prev) =>
        prev.map((bot) =>
          bot.id === id ? updatedBot : bot
        )
      );

    } catch (error) {

      console.error("Status update error:", error);

      alert("Bot status update nahi hua.");
    }
  };

  /*
   * Delete trading bot
   */
  const deleteBot = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bot?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bot");
      }

      setBots((prev) =>
        prev.filter((bot) => bot.id !== id)
      );

    } catch (error) {

      console.error("Delete bot error:", error);

      alert("Bot delete nahi hua.");
    }
  };

  /*
   * Create trading bot
   */
  const createBot = async (e) => {

    e.preventDefault();

    if (!userId) {
      alert("User not logged in.");
      return;
    }

    if (
      !newBot.name.trim() ||
      Number(newBot.investment) <= 0
    ) {
      alert("Please enter valid bot name and investment amount.");
      return;
    }

    setCreating(true);

    const botData = {
      userId: userId,
      name: newBot.name.trim(),
      pair: newBot.pair,
      strategy: newBot.strategy,
      investment: Number(newBot.investment),
      status: "Stopped",
      profit: 0,
      trades: 0,
    };

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(botData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create bot");
      }

      const createdBot = await response.json();

      /*
       * Add newly created bot immediately
       * to TradingBots card list
       */
      setBots((prev) => [
        ...prev,
        createdBot,
      ]);

      setNewBot({
        name: "",
        pair: "BTC/USDT",
        strategy: "Scalping",
        investment: "",
      });

      setShowModal(false);

    } catch (error) {

      console.error("Create bot error:", error);

      alert(
        "Bot create nahi hua. Backend check karein."
      );

    } finally {

      setCreating(false);
    }
  };

  /*
   * Search + filter
   */
  const filteredBots = bots.filter((bot) => {

    const searchText = search.toLowerCase();

    const botName = (bot.name || "").toLowerCase();
    const botPair = (bot.pair || "").toLowerCase();

    const matchesSearch =
      botName.includes(searchText) ||
      botPair.includes(searchText);

    const matchesFilter =
      filter === "All" ||
      bot.status === filter;

    return matchesSearch && matchesFilter;
  });

  /*
   * Statistics
   */
  const totalInvestment = bots.reduce(
    (sum, bot) =>
      sum + Number(bot.investment || 0),
    0
  );

  const totalProfit = bots.reduce(
    (sum, bot) =>
      sum + Number(bot.profit || 0),
    0
  );

  const runningBots = bots.filter(
    (bot) => bot.status === "Running"
  ).length;

  const totalTrades = bots.reduce(
    (sum, bot) =>
      sum + Number(bot.trades || 0),
    0
  );

  return (
    <div className="trading-bots-page">

      <div className="bots-header">

        <div>
          <h1>Trading Bots</h1>

          <p>
            Manage, monitor and control your automated trading bots.
          </p>
        </div>

        <button
          className="create-bot-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create New Bot
        </button>

      </div>

      <div className="bots-stats">

        <div className="bot-stat-card">

          <div className="stat-icon purple">
            <Bot size={22} />
          </div>

          <div>
            <p>Total Bots</p>
            <h2>{bots.length}</h2>
          </div>

        </div>

        <div className="bot-stat-card">

          <div className="stat-icon green">
            <Activity size={22} />
          </div>

          <div>
            <p>Running Bots</p>
            <h2>{runningBots}</h2>
          </div>

        </div>

        <div className="bot-stat-card">

          <div className="stat-icon blue">
            <DollarSign size={22} />
          </div>

          <div>
            <p>Total Investment</p>

            <h2>
              ${totalInvestment.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="bot-stat-card">

          <div className="stat-icon orange">
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Total Profit/Loss</p>

            <h2
              className={
                totalProfit >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {totalProfit >= 0 ? "+" : "-"}$
              {Math.abs(totalProfit).toFixed(2)}
            </h2>
          </div>

        </div>

      </div>

      <div className="bots-toolbar">

        <div className="bots-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search bots or trading pairs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="bots-filter">

          <SlidersHorizontal size={17} />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Bots
            </option>

            <option value="Running">
              Running
            </option>

            <option value="Stopped">
              Stopped
            </option>
          </select>

        </div>

      </div>

      <div className="bots-section-heading">

        <h2>My Bots</h2>

        <span>
          {filteredBots.length} bots found
        </span>

      </div>

      {loading ? (

        <div className="bots-empty">

          <Bot size={40} />

          <h3>Loading bots...</h3>

          <p>
            Please wait while your bots are loading.
          </p>

        </div>

      ) : (

        <div className="bots-grid">

          {filteredBots.map((bot) => (

            <div
              className="trading-bot-card"
              key={bot.id}
            >

              <div className="bot-card-top">

                <div className="bot-title-icon">
                  <Bot size={23} />
                </div>

                <span
                  className={`bot-status ${
                    bot.status === "Running"
                      ? "running"
                      : "stopped"
                  }`}
                >
                  <span className="status-dot"></span>

                  {bot.status}

                </span>

              </div>

              <h3>{bot.name}</h3>

              <p className="bot-pair">
                {bot.pair}
              </p>

              <div className="bot-strategy">

                <span>Strategy</span>

                <strong>
                  {bot.strategy}
                </strong>

              </div>

              <div className="bot-details">

                <div>

                  <span>
                    Investment
                  </span>

                  <strong>
                    $
                    {Number(
                      bot.investment || 0
                    ).toLocaleString()}
                  </strong>

                </div>

                <div>

                  <span>
                    Profit / Loss
                  </span>

                  <strong
                    className={
                      Number(bot.profit || 0) >= 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {Number(bot.profit || 0) >= 0
                      ? "+"
                      : "-"}
                    $
                    {Math.abs(
                      Number(bot.profit || 0)
                    ).toFixed(2)}
                  </strong>

                </div>

                <div>

                  <span>
                    Total Trades
                  </span>

                  <strong>
                    {bot.trades || 0}
                  </strong>

                </div>

              </div>

              <div className="bot-card-actions">

                <button
                  className={
                    bot.status === "Running"
                      ? "bot-stop-btn"
                      : "bot-start-btn"
                  }
                  onClick={() =>
                    toggleBot(
                      bot.id,
                      bot.status
                    )
                  }
                >

                  {bot.status === "Running" ? (

                    <>
                      <Pause size={16} />
                      Stop Bot
                    </>

                  ) : (

                    <>
                      <Play size={16} />
                      Start Bot
                    </>

                  )}

                </button>

                <button
                  className="bot-icon-btn"
                  title="Settings"
                  onClick={() =>
                    alert(
                      "Bot settings will be added later."
                    )
                  }
                >
                  <Settings size={17} />
                </button>

                <button
                  className="bot-icon-btn delete"
                  title="Delete Bot"
                  onClick={() =>
                    deleteBot(bot.id)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {!loading &&
        filteredBots.length === 0 && (

          <div className="bots-empty">

            <Bot size={40} />

            <h3>No bots found</h3>

            <p>
              Try another search or create a new
              trading bot.
            </p>

          </div>

        )}

      {showModal && (

        <div
          className="bot-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="bot-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="bot-modal-header">

              <div>

                <h2>
                  Create New Bot
                </h2>

                <p>
                  Configure your new trading bot.
                </p>

              </div>

              <button
                className="bot-modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={21} />
              </button>

            </div>

            <form onSubmit={createBot}>

              <label>
                Bot Name
              </label>

              <input
                type="text"
                placeholder="Enter bot name"
                value={newBot.name}
                onChange={(e) =>
                  setNewBot({
                    ...newBot,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>
                Trading Pair
              </label>

              <select
                value={newBot.pair}
                onChange={(e) =>
                  setNewBot({
                    ...newBot,
                    pair: e.target.value,
                  })
                }
              >

                <option value="BTC/USDT">
                  BTC/USDT
                </option>

                <option value="ETH/USDT">
                  ETH/USDT
                </option>

                <option value="SOL/USDT">
                  SOL/USDT
                </option>

                <option value="BNB/USDT">
                  BNB/USDT
                </option>

              </select>

              <label>
                Trading Strategy
              </label>

              <select
                value={newBot.strategy}
                onChange={(e) =>
                  setNewBot({
                    ...newBot,
                    strategy: e.target.value,
                  })
                }
              >

                <option value="Scalping">
                  Scalping
                </option>

                <option value="Grid Trading">
                  Grid Trading
                </option>

                <option value="Trend Following">
                  Trend Following
                </option>

                <option value="DCA">
                  DCA
                </option>

              </select>

              <label>
                Investment Amount (USD)
              </label>

              <input
                type="number"
                min="1"
                step="any"
                placeholder="Enter investment amount"
                value={newBot.investment}
                onChange={(e) =>
                  setNewBot({
                    ...newBot,
                    investment: e.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                className="create-bot-submit"
                disabled={creating}
              >

                <Plus size={18} />

                {creating
                  ? "Creating..."
                  : "Create Bot"}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default TradingBots;
