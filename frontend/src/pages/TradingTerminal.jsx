
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  Activity,
  ChevronDown,
} from "lucide-react";

import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";

import "./TradingTerminal.css";

/*
 * Demo orders
 */
const initialOrders = [
  {
    id: 1,
    pair: "BTC/USDT",
    type: "Limit",
    side: "Buy",
    price: 67000,
    amount: 0.05,
    status: "Open",
  },
  {
    id: 2,
    pair: "ETH/USDT",
    type: "Limit",
    side: "Sell",
    price: 3250,
    amount: 0.12,
    status: "Open",
  },
  {
    id: 3,
    pair: "SOL/USDT",
    type: "Market",
    side: "Buy",
    price: 142.67,
    amount: 1.5,
    status: "Filled",
  },
];

/*
 * Real crypto markets
 *
 * pair    = UI me dikhne wala real market pair
 * symbol  = Binance API/WebSocket symbol
 * name    = actual cryptocurrency name
 */
const marketData = [
  {
    pair: "BTC/USDT",
    symbol: "BTCUSDT",
    name: "Bitcoin",
    price: 0,
    change: "Live",
  },
  {
    pair: "ETH/USDT",
    symbol: "ETHUSDT",
    name: "Ethereum",
    price: 0,
    change: "Live",
  },
  {
    pair: "SOL/USDT",
    symbol: "SOLUSDT",
    name: "Solana",
    price: 0,
    change: "Live",
  },
  {
    pair: "BNB/USDT",
    symbol: "BNBUSDT",
    name: "BNB",
    price: 0,
    change: "Live",
  },
  {
    pair: "XRP/USDT",
    symbol: "XRPUSDT",
    name: "XRP",
    price: 0,
    change: "Live",
  },
];

const orderBookAsks = [
  { price: 67486.21, amount: 0.152 },
  { price: 67485.76, amount: 0.321 },
  { price: 67484.92, amount: 0.487 },
  { price: 67483.7, amount: 0.215 },
  { price: 67482.91, amount: 0.367 },
];

const orderBookBids = [
  { price: 67481.98, amount: 0.472 },
  { price: 67481.45, amount: 0.692 },
  { price: 67480.76, amount: 0.287 },
  { price: 67479.32, amount: 0.521 },
  { price: 67478.55, amount: 0.403 },
];

const recentTrades = [
  {
    price: 67482.32,
    amount: 0.0123,
    time: "10:47:12",
    side: "Buy",
  },
  {
    price: 67481.98,
    amount: 0.0456,
    time: "10:47:11",
    side: "Sell",
  },
  {
    price: 67482.45,
    amount: 0.0321,
    time: "10:47:10",
    side: "Buy",
  },
  {
    price: 67482.32,
    amount: 0.0789,
    time: "10:47:08",
    side: "Buy",
  },
  {
    price: 67480.76,
    amount: 0.0214,
    time: "10:47:05",
    side: "Sell",
  },
];

function LiveCandlestickChart({
  symbol,
  timeframe,
  onPrice,
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const [connectionStatus, setConnectionStatus] =
    useState("Connecting...");

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const container =
      chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 290,

      layout: {
        background: {
          color: "#0a1526",
        },
        textColor: "#94a3b8",
      },

      grid: {
        vertLines: {
          color: "#1e2d42",
        },
        horzLines: {
          color: "#1e2d42",
        },
      },

      rightPriceScale: {
        borderColor: "#263449",
      },

      timeScale: {
        borderColor: "#263449",
        timeVisible: true,
        secondsVisible: false,
      },

      crosshair: {
        mode: 0,
      },
    });

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#10b981",
          downColor: "#fb7185",
          borderUpColor: "#10b981",
          borderDownColor: "#fb7185",
          wickUpColor: "#10b981",
          wickDownColor: "#fb7185",
        }
      );

    chartRef.current = chart;

    candleSeriesRef.current =
      candleSeries;

    const resizeObserver =
      new ResizeObserver(() => {
        if (container.clientWidth > 0) {
          chart.applyOptions({
            width:
              container.clientWidth,
          });
        }
      });

    resizeObserver.observe(container);

    let socket = null;
    let cancelled = false;

    const loadCandles = async () => {
      try {
        setConnectionStatus(
          "Connecting..."
        );

        const response =
          await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=300`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load candle data"
          );
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        const candles =
          data.map((item) => ({
            time: Math.floor(
              item[0] / 1000
            ),
            open: Number(item[1]),
            high: Number(item[2]),
            low: Number(item[3]),
            close: Number(item[4]),
          }));

        candleSeries.setData(
          candles
        );

        chart
          .timeScale()
          .fitContent();

        if (candles.length > 0) {
          onPrice?.(
            candles[
              candles.length - 1
            ].close
          );
        }

        const stream =
          `${symbol.toLowerCase()}@kline_${timeframe}`;

        socket =
          new WebSocket(
            `wss://stream.binance.com:9443/ws/${stream}`
          );

        socket.onopen = () => {
          if (!cancelled) {
            setConnectionStatus(
              "Live"
            );
          }
        };

        socket.onmessage = (
          event
        ) => {
          if (cancelled) {
            return;
          }

          try {
            const message =
              JSON.parse(
                event.data
              );

            const kline =
              message.k;

            if (!kline) {
              return;
            }

            const candle = {
              time: Math.floor(
                kline.t / 1000
              ),
              open: Number(
                kline.o
              ),
              high: Number(
                kline.h
              ),
              low: Number(
                kline.l
              ),
              close: Number(
                kline.c
              ),
            };

            candleSeries.update(
              candle
            );

            onPrice?.(
              candle.close
            );
          } catch (error) {
            console.error(
              "WebSocket message error:",
              error
            );
          }
        };

        socket.onerror = () => {
          if (!cancelled) {
            setConnectionStatus(
              "Connection error"
            );
          }
        };

        socket.onclose = () => {
          if (!cancelled) {
            setConnectionStatus(
              "Disconnected"
            );
          }
        };
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Live chart error:",
            error
          );

          setConnectionStatus(
            "Unable to connect"
          );
        }
      }
    };

    loadCandles();

    return () => {
      cancelled = true;

      resizeObserver.disconnect();

      if (socket) {
        socket.close();
      }

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current =
        null;
    };
  }, [symbol, timeframe, onPrice]);

  return (
    <div className="live-chart-wrapper">

      <div className="live-chart-status">

        <span
          className={`terminal-live-dot ${
            connectionStatus === "Live"
              ? "is-live"
              : "is-offline"
          }`}
        />

        {connectionStatus}

      </div>

      <div
        ref={chartContainerRef}
        className="live-candlestick-chart"
      />

    </div>
  );
}

function TradingTerminal() {
  const [livePrices, setLivePrices] =
    useState({});

  const [pair, setPair] =
    useState("BTC/USDT");

  const [timeframe, setTimeframe] =
    useState("1h");

  const [side, setSide] =
    useState("Buy");

  const [orderType, setOrderType] =
    useState("Limit");

  const [price, setPrice] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("Open Orders");

  const [filter, setFilter] =
    useState("All");

  const [orders, setOrders] =
    useState(initialOrders);

  const [message, setMessage] =
    useState("");

  const selectedMarket =
    marketData.find(
      (item) => item.pair === pair
    ) || marketData[0];

  const currentLivePrice =
    livePrices[
      selectedMarket.symbol
    ];

  const displayPrice =
    currentLivePrice ??
    selectedMarket.price;

  const currentPrice =
    Number(price) || 0;

  const quantity =
    Number(amount) || 0;

  const total =
    currentPrice * quantity;

  const changePair = (newPair) => {
    setPair(newPair);

    const market =
      marketData.find(
        (item) =>
          item.pair === newPair
      );

    if (market) {
      const livePrice =
        livePrices[
          market.symbol
        ];

      setPrice(
        livePrice !== undefined
          ? String(livePrice)
          : ""
      );
    }

    setMessage("");
  };

  const handleLivePrice =
    useCallback(
      (newPrice) => {
        setLivePrices(
          (prev) => ({
            ...prev,
            [selectedMarket.symbol]:
              newPrice,
          })
        );

        /*
         * Market order ke liye
         * current live price automatically
         * price field me set hoga.
         */
        setPrice(
          (previousPrice) => {
            if (
              orderType === "Market"
            ) {
              return previousPrice;
            }

            if (
              !previousPrice ||
              Number(previousPrice) <= 0
            ) {
              return String(
                newPrice
              );
            }

            return previousPrice;
          }
        );
      },
      [
        selectedMarket.symbol,
        orderType,
      ]
    );

  const placeOrder = (e) => {
    e.preventDefault();

    const orderPrice =
      orderType === "Market"
        ? displayPrice
        : currentPrice;

    if (
      quantity <= 0 ||
      orderPrice <= 0
    ) {
      setMessage(
        "Please enter a valid price and quantity."
      );

      return;
    }

    const newOrder = {
      id: Date.now(),
      pair,
      type: orderType,
      side,
      price: orderPrice,
      amount: quantity,
      status: "Open",
    };

    setOrders((prev) => [
      newOrder,
      ...prev,
    ]);

    setActiveTab(
      "Open Orders"
    );

    setMessage(
      "Demo order created successfully."
    );

    setAmount("");
  };

  const cancelOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id &&
        order.status === "Open"
          ? {
              ...order,
              status: "Canceled",
            }
          : order
      )
    );
  };

  const visibleOrders =
    orders.filter((order) => {
      if (filter === "All") {
        return true;
      }

      return (
        order.status === filter
      );
    });

  return (
    <div className="terminal-page">

      <header className="terminal-header">

        <div className="terminal-brand">

          <div className="terminal-brand-icon">
            <Activity size={25} />
          </div>

          <div>
            <h1>
              Trading Terminal
            </h1>

            <p>
              Market Trading · Demo Mode
            </p>
          </div>

        </div>

        <div className="terminal-market-select">

          <select
            value={pair}
            onChange={(e) =>
              changePair(
                e.target.value
              )
            }
          >

            {marketData.map(
              (item) => (
                <option
                  key={item.pair}
                  value={item.pair}
                >
                  {item.name} ({item.pair})
                </option>
              )
            )}

          </select>

          <ChevronDown
            size={16}
          />

        </div>

        <div className="terminal-current-price">

          <strong>
            {displayPrice > 0
              ? displayPrice.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  }
                )
              : "--"}
          </strong>

          <span>
            {selectedMarket.name} ·{" "}
            {selectedMarket.change}
          </span>

        </div>

      </header>

      <div className="terminal-market-stats">

        <div>
          <span>
            Market
          </span>

          <strong>
            {selectedMarket.name}
          </strong>
        </div>

        <div>
          <span>
            Trading Pair
          </span>

          <strong>
            {selectedMarket.pair}
          </strong>
        </div>

        <div>
          <span>
            Symbol
          </span>

          <strong>
            {selectedMarket.symbol}
          </strong>
        </div>

        <div>
          <span>
            Current Price
          </span>

          <strong>
            {displayPrice > 0
              ? displayPrice.toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: 4,
                  }
                )
              : "--"}
          </strong>
        </div>

      </div>

      <div className="terminal-layout">

        <section className="terminal-panel terminal-chart-panel">

          <div className="terminal-panel-heading">

            <div>

              <h2>
                {selectedMarket.name}{" "}
                ({pair})
              </h2>

              <span className="terminal-live-label">

                <span className="terminal-live-dot"></span>

                Live Chart

              </span>

            </div>

            <div className="terminal-timeframes">

              {[
                {
                  label: "1m",
                  value: "1m",
                },
                {
                  label: "5m",
                  value: "5m",
                },
                {
                  label: "15m",
                  value: "15m",
                },
                {
                  label: "1h",
                  value: "1h",
                },
                {
                  label: "4h",
                  value: "4h",
                },
                {
                  label: "1D",
                  value: "1d",
                },
              ].map(
                (item) => (

                  <button
                    key={
                      item.value
                    }
                    className={
                      timeframe ===
                      item.value
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTimeframe(
                        item.value
                      )
                    }
                  >
                    {item.label}
                  </button>

                )
              )}

            </div>

          </div>

          <div className="terminal-chart-summary">

            <span>
              Open <b>Live</b>
            </span>

            <span>
              High <b>Live</b>
            </span>

            <span>
              Low <b>Live</b>
            </span>

            <span>
              Close{" "}
              <b className="terminal-green">
                {displayPrice > 0
                  ? displayPrice.toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 4,
                      }
                    )
                  : "--"}
              </b>
            </span>

          </div>

          <LiveCandlestickChart
            key={`${selectedMarket.symbol}-${timeframe}`}
            symbol={
              selectedMarket.symbol
            }
            timeframe={
              timeframe
            }
            onPrice={
              handleLivePrice
            }
          />

          <div className="terminal-chart-footer">

            <span>
              <Activity size={15} />
              Candlestick
            </span>

            <strong>
              Live Market Data
            </strong>

            <span className="terminal-muted">
              Binance WebSocket
            </span>

          </div>

        </section>

        <section className="terminal-panel terminal-orderbook-panel">

          <div className="terminal-panel-heading">

            <h2>
              Order Book
            </h2>

            <span className="terminal-muted">
              {selectedMarket.name}
            </span>

          </div>

          <div className="orderbook-columns">

            <span>
              Price
            </span>

            <span>
              Quantity
            </span>

            <span>
              Total
            </span>

          </div>

          <div className="orderbook-list asks">

            {orderBookAsks.map(
              (item, index) => (

                <div
                  className="orderbook-row"
                  key={index}
                >

                  <strong>
                    {item.price.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </strong>

                  <span>
                    {item.amount.toFixed(
                      3
                    )}
                  </span>

                  <span>
                    {(
                      item.price *
                      item.amount
                    ).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>

              )
            )}

          </div>

          <div className="orderbook-current">

            <strong className="terminal-green">

              {displayPrice > 0
                ? displayPrice.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    }
                  )
                : "--"}{" "}
              ↑

            </strong>

            <span>
              Current Market Price
            </span>

          </div>

          <div className="orderbook-list bids">

            {orderBookBids.map(
              (item, index) => (

                <div
                  className="orderbook-row"
                  key={index}
                >

                  <strong>
                    {item.price.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </strong>

                  <span>
                    {item.amount.toFixed(
                      3
                    )}
                  </span>

                  <span>
                    {(
                      item.price *
                      item.amount
                    ).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>

              )
            )}

          </div>

        </section>

        <section className="terminal-panel terminal-order-form-panel">

          <div className="terminal-panel-heading">

            <h2>
              Place Order
            </h2>

            <span className="terminal-demo-badge">
              Demo
            </span>

          </div>

          <div className="terminal-side-tabs">

            <button
              className={
                side === "Buy"
                  ? "buy active"
                  : ""
              }
              onClick={() =>
                setSide("Buy")
              }
            >
              Buy
            </button>

            <button
              className={
                side === "Sell"
                  ? "sell active"
                  : ""
              }
              onClick={() =>
                setSide("Sell")
              }
            >
              Sell
            </button>

          </div>

          <div className="terminal-order-types">

            {[
              "Limit",
              "Market",
              "Stop-Limit",
            ].map((type) => (

              <button
                key={type}
                className={
                  orderType === type
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setOrderType(
                    type
                  )
                }
              >
                {type}
              </button>

            ))}

          </div>

          <form
            onSubmit={
              placeOrder
            }
            className="terminal-order-form"
          >

            {orderType !==
              "Market" && (

              <>
                <label>
                  Price
                </label>

                <div className="terminal-input-wrap">

                  <input
                    type="number"
                    min="0.00000001"
                    step="any"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value
                      )
                    }
                    required
                  />

                  <span>
                    USDT
                  </span>

                </div>
              </>

            )}

            <label>
              Quantity
            </label>

            <div className="terminal-input-wrap">

              <input
                type="number"
                min="0.00000001"
                step="any"
                placeholder="Enter quantity"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                required
              />

              <span>
                {selectedMarket.name}
              </span>

            </div>

            <div className="terminal-amount-presets">

              {[25, 50, 75, 100].map(
                (percent) => (

                  <button
                    type="button"
                    key={percent}
                    onClick={() =>
                      setAmount(
                        String(
                          (percent /
                            100) *
                            0.1
                        )
                      )
                    }
                  >
                    {percent}%
                  </button>

                )
              )}

            </div>

            <div className="terminal-total-row">

              <span>
                Total Value
              </span>

              <strong>
                {total.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                USDT
              </strong>

            </div>

            <button
              type="submit"
              className={`terminal-submit-btn ${
                side === "Buy"
                  ? "buy"
                  : "sell"
              }`}
            >
              {side}{" "}
              {selectedMarket.name}
            </button>

            {message && (
              <div className="terminal-message">
                {message}
              </div>
            )}

            <div className="terminal-balance">

              <span>
                Available Balance
              </span>

              <strong>
                0.00 USDT
              </strong>

            </div>

          </form>

        </section>

      </div>

      <div className="terminal-bottom-layout">

        <section className="terminal-panel terminal-orders-panel">

          <div className="terminal-bottom-tabs">

            {[
              "Open Orders",
              "Order History",
              "Trade History",
            ].map((tab) => (

              <button
                key={tab}
                className={
                  activeTab === tab
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    tab
                  )
                }
              >
                {tab}
              </button>

            ))}

          </div>

          <div className="terminal-orders-filter">

            <span>
              {activeTab}
            </span>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Filled">
                Filled
              </option>

              <option value="Canceled">
                Canceled
              </option>

            </select>

          </div>

          <div className="terminal-table-scroll">

            <table className="terminal-table">

              <thead>

                <tr>
                  <th>Market</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {visibleOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                    >

                      <td>
                        {order.pair}
                      </td>

                      <td>
                        {order.type}
                      </td>

                      <td
                        className={
                          order.side ===
                          "Buy"
                            ? "terminal-green"
                            : "terminal-red"
                        }
                      >
                        {order.side}
                      </td>

                      <td>
                        {order.price.toLocaleString(
                          "en-US",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td>
                        {order.amount}
                      </td>

                      <td>

                        <span
                          className={`terminal-order-status ${order.status.toLowerCase()}`}
                        >
                          {
                            order.status
                          }
                        </span>

                      </td>

                      <td>

                        {order.status ===
                        "Open" ? (

                          <button
                            className="terminal-cancel-btn"
                            onClick={() =>
                              cancelOrder(
                                order.id
                              )
                            }
                          >
                            Cancel
                          </button>

                        ) : (

                          <span className="terminal-muted">
                            —
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        <section className="terminal-panel terminal-recent-panel">

          <div className="terminal-panel-heading">

            <h2>
              Recent Trades
            </h2>

          </div>

          <div className="terminal-recent-columns">

            <span>
              Price
            </span>

            <span>
              Quantity
            </span>

            <span>
              Time
            </span>

          </div>

          {recentTrades.map(
            (trade, index) => (

              <div
                className="terminal-recent-row"
                key={index}
              >

                <strong
                  className={
                    trade.side ===
                    "Buy"
                      ? "terminal-green"
                      : "terminal-red"
                  }
                >
                  {trade.price.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

                <span>
                  {trade.amount}
                </span>

                <span>
                  {trade.time}
                </span>

              </div>

            )
          )}

        </section>

        <section className="terminal-panel terminal-market-panel">

          <div className="terminal-panel-heading">

            <h2>
              Market Overview
            </h2>

          </div>

          <div className="terminal-market-columns">

            <span>
              Market
            </span>

            <span>
              Price
            </span>

            <span>
              24h
            </span>

          </div>

          {marketData.map(
            (market) => {

              const livePrice =
                livePrices[
                  market.symbol
                ] ??
                market.price;

              return (

                <button
                  className={`terminal-market-row ${
                    pair ===
                    market.pair
                      ? "selected"
                      : ""
                  }`}
                  key={
                    market.pair
                  }
                  onClick={() =>
                    changePair(
                      market.pair
                    )
                  }
                >

                  <div>

                    <strong>
                      {market.name}
                    </strong>

                    <small>
                      {market.pair}
                    </small>

                  </div>

                  <span>
                    {livePrice > 0
                      ? livePrice.toLocaleString(
                          "en-US",
                          {
                            maximumFractionDigits: 4,
                          }
                        )
                      : "--"}
                  </span>

                  <span className="terminal-green">
                    Live
                  </span>

                </button>

              );
            }
          )}

        </section>

      </div>

    </div>
  );
}

export default TradingTerminal;
