import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-lg mx-4 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
            <AlertCircle className="relative h-16 w-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist.
          <br />
          It may have been moved or deleted.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 px-6 py-2.5 mx-auto rounded-lg bg-[#ff6b35] text-white hover:opacity-90 transition-opacity"
        >
          <Home size={16} />
          Go Home
        </button>
      </div>
    </div>
  );
}