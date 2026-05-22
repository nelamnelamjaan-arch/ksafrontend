import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="font-display text-xl font-bold text-white">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/55">
            This page could not load. Try refreshing or return home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Reload
            </button>
            <Link
              to="/"
              className="rounded-2xl border border-neon-cyan/40 bg-neon-cyan/15 px-5 py-2.5 text-sm font-semibold text-neon-cyan"
            >
              Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
