import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0F] text-white font-inter animate-fade-in">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold mb-2 gradient-text">404</h1>
        <p className="text-2xl text-[#E0E0E0] mb-4">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-full bg-[#00C896] hover:bg-[#00BFFF] text-black font-semibold text-lg shadow-lg transition-all duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
