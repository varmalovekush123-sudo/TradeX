import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8182/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Backend Response:", data);

            if (response.ok) {

                // Login information browser me save
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", data.email);

                if (data.id) {
                    localStorage.setItem("userId", data.id);
                }

                alert("Login successful!");

                navigate("/dashboard");

            } else {

                alert(
                    data.message ||
                    "Unable to login"
                );

            }

        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Unable to connect to Spring Boot backend."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleGoogleLogin = () => {

        alert(
            "Google login will be connected with backend later."
        );

    };

    const handleAppleLogin = () => {

        alert(
            "Apple login will be connected with backend later."
        );

    };

    return (
        <div className="login-page">

            {/* Animated Trading Background */}

            <div className="grid-background"></div>

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="price-line line-one"></div>
            <div className="price-line line-two"></div>

            <div className="floating-candle candle-one"></div>
            <div className="floating-candle candle-two"></div>
            <div className="floating-candle candle-three"></div>

            {/* Login Card */}

            <div className="login-card">

                <div className="brand">

                    <div className="brand-icon">
                        ₿
                    </div>

                    <div>
                        <h1>TradeX</h1>
                        <span>Smart Trading Platform</span>
                    </div>

                </div>

                <div className="login-heading">

                    <h2>Welcome Back</h2>

                    <p>
                        Login to access your trading dashboard
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="input-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="input-group">

                        <div className="password-label">

                            <label>Password</label>

                            <button
                                type="button"
                                className="forgot-password"
                                onClick={() =>
                                    alert(
                                        "Forgot password will be implemented later."
                                    )
                                }
                            >
                                Forgot Password?
                            </button>

                        </div>

                        <div className="password-box">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    <div className="remember-row">

                        <label className="remember">

                            <input type="checkbox" />

                            <span>
                                Remember me
                            </span>

                        </label>

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"}

                    </button>

                </form>

                <div className="divider">

                    <span>
                        OR CONTINUE WITH
                    </span>

                </div>

                {/* Social Login Buttons */}

                <div className="social-buttons">

                    <button
                        type="button"
                        className="social-button"
                        onClick={handleGoogleLogin}
                    >

                        <FcGoogle className="social-icon" />

                        <span>
                            Continue with Google
                        </span>

                    </button>

                    <button
                        type="button"
                        className="social-button"
                        onClick={handleAppleLogin}
                    >

                        <FaApple className="social-icon apple-icon" />

                        <span>
                            Continue with Apple
                        </span>

                    </button>

                </div>

                <div className="register-text">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                "Register page will be added next."
                            )
                        }
                    >
                        Create Account
                    </button>

                </div>

                <div className="security-text">

                    🔒 Your trading data is securely protected

                </div>

            </div>

        </div>
    );
}

export default Login;