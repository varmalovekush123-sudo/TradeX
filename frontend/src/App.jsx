import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TradingBots from "./pages/TradingBots";
import TradingTerminal from "./pages/TradingTerminal";
import CreateBot from "./pages/CreateBot";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
                <Route 
                path="/trading-bots" 
                element={<TradingBots />}
                 />
                 <Route
  path="/trading-terminal"
  element={<TradingTerminal />}
/>
<Route
    path="/create-bot"
    element={<CreateBot />}
/>


            </Routes>

        </BrowserRouter>
    );
}

export default App;