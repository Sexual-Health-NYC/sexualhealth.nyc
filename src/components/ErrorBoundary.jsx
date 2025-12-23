import { Component } from "react";
import theme from "../theme";

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: theme.spacing[6],
            backgroundColor: theme.colors.surface,
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              padding: theme.spacing[6],
              backgroundColor: "white",
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.lg,
            }}
          >
            <h1
              style={{
                fontSize: theme.fonts.size["2xl"],
                fontWeight: theme.fonts.weight.bold,
                color: theme.colors.error,
                marginBottom: theme.spacing[4],
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing[6],
              }}
            >
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            {this.state.error && (
              <details
                style={{
                  textAlign: "left",
                  marginBottom: theme.spacing[4],
                  padding: theme.spacing[3],
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.fonts.size.sm,
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: theme.fonts.weight.medium,
                    marginBottom: theme.spacing[2],
                  }}
                >
                  Error details
                </summary>
                <code
                  style={{
                    display: "block",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: theme.colors.error,
                  }}
                >
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                backgroundColor: theme.colors.primary,
                color: "white",
                border: "none",
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.base,
                fontWeight: theme.fonts.weight.medium,
                cursor: "pointer",
              }}
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
