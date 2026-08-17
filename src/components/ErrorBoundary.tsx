import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level crash guard — without this, a render error shows a blank white screen (or, in dev,
 * an overlay with a full stack trace). Sits outside the router, so recovery is a plain reload/
 * link rather than client-side navigation (safest after a render crash — component state may be
 * corrupted).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-soft px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-2xl font-extrabold text-navy mb-3">Something went wrong</p>
          <p className="text-navy/60 leading-relaxed mb-6">
            We've hit an unexpected error. Try reloading the page — if it keeps happening, get in
            touch and we'll sort it out.
          </p>
          {import.meta.env.DEV && (
            <pre className="text-left text-xs bg-white border border-border rounded-2xl p-4 mb-6 overflow-auto text-alert">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center font-semibold rounded-full px-6 py-3 text-[0.95rem] bg-white text-navy border-2 border-navy/15 hover:border-teal hover:text-teal-deep transition-colors"
            >
              Back to home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center font-semibold rounded-full px-6 py-3 text-[0.95rem] gradient-brand text-white cursor-pointer"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
