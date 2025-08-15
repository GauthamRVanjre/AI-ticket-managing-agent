import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.email}!`);
        navigate("/");
      } else {
        toast.error(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      toast.error(
        "Something went wrong. Please check your connection and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center p-12 border-r border-neutral-800 bg-gradient-to-b from-sky-900/20 to-neutral-900">
        <div className="max-w-md">
          <div className="mx-auto mb-6 h-12 w-12 rounded-lg bg-gradient-to-br from-sky-600 to-cyan-500" />
          <h1 className="text-2xl font-semibold text-center">Atlas Helpdesk</h1>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
              AI helpful notes on each ticket
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
              Priority assignment and status tracking
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
              Role-based dashboards for users, moderators, and admins
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Login to your account
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 card p-6">
            <div>
              <label className="mb-2 block text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="primary w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm text-neutral-400">
              Don't have an account?{" "}
              <Link className="hover:text-white" to="/signUp">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
