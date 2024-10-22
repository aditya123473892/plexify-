import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        alert("Logged in successfully");
        // Redirect or further logic here
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side with logo */}
      <div className="hidden lg:flex w-1/2 bg-[#182610] items-center justify-center">
        <img
          src="/path-to-your-logo.png"
          alt="Plexify Logo"
          className="h-24 w-auto"
        />
      </div>

      {/* Right side with login form */}
      <div className="flex items-center justify-center lg:w-1/2 w-full p-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-black mb-6">Log in</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              className="p-3 border w-full mb-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className="p-3 border w-full mb-6 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#385723] text-white py-3 rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
          <p className="mt-4 text-sm text-black">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
