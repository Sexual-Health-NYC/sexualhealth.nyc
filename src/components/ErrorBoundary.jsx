import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-surface text-center">
          <div className="max-w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-base text-text-secondary mb-6">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            {this.state.error && (
              <details className="text-left mb-4 p-3 bg-surface rounded-md text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Error details
                </summary>
                <code className="block whitespace-pre-wrap break-words text-red-600">
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 bg-primary text-white border-none rounded-md text-base font-medium cursor-pointer"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
