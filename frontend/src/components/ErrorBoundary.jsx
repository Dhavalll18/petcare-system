import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xl max-w-md text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">!</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">System Error</h1>
            <p className="text-slate-500 mb-6 text-sm">
              The application encountered an unexpected runtime failure. Please refresh or contact support.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl text-left mb-6 overflow-hidden">
               <p className="text-[10px] font-mono text-rose-500 truncate">{this.state.error?.toString()}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all"
            >
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
