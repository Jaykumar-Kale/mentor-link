import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashLink = !user
    ? "/login"
    : user.role === "admin"
      ? "/admin/dashboard"
      : user.role === "mentor"
        ? "/mentor/dashboard"
        : "/mentee/dashboard";

  const isActive = (path) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-white/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18"
        style={{ height: "72px" }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 flex-shrink-0"
          onClick={() => setOpen(false)}
        >
          <img
            src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-logo.jpg"
            alt="Mudita"
            className="h-12 w-12 rounded-full object-contain border border-gray-100 shadow-sm"
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=M&background=3730a3&color=fff&size=48";
            }}
          />
          <div className="hidden sm:block">
            <p
              className="font-bold text-sm leading-tight"
              style={{
                color: "#3730a3",
                fontFamily: "Plus Jakarta Sans,sans-serif",
              }}
            >
              MUDITA – AN ALLIANCE FOR GIVING
            </p>
            <p
              className="text-xs leading-tight font-medium"
              style={{ color: "#f59e0b" }}
            >
              Collaborate To Enable Individuals ★ Empower Our Communities
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/programmes", label: "Our Programmes" },
            { to: "/get-involved", label: "Get Involved" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive(to)
                  ? "text-indigo-700 bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashLink}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all"
              >
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 px-4 py-2.5 rounded-lg hover:bg-indigo-50 transition"
              >
                Login
              </Link>
              <Link
                to="/get-involved"
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                Donate Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-current transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${open ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/programmes", label: "Our Programmes" },
            { to: "/get-involved", label: "Get Involved" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition ${
                isActive(to)
                  ? "text-indigo-700 bg-indigo-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link
                  to={dashLink}
                  onClick={() => setOpen(false)}
                  className="block text-center bg-indigo-700 text-white py-3 px-4 rounded-lg font-bold text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center text-red-500 py-2 font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center border-2 border-indigo-700 text-indigo-700 py-2.5 px-4 rounded-lg font-bold text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/get-involved"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-amber-500 text-white py-3 px-4 rounded-lg font-bold text-sm"
                >
                  Donate Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
