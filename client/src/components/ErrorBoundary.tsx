import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-[#f8f9fa]">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle size={48} className="text-red-500 mb-6 flex-shrink-0" />
            <h2 className="text-xl mb-4 text-[#2d3436]">An unexpected error occurred.</h2>
            <div className="p-4 w-full rounded bg-white overflow-auto mb-6 border border-[#dfe6e9]">
              <pre className="text-sm text-[#636e72] whitespace-break-spaces">
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b35] text-white hover:opacity-90 cursor-pointer"
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;