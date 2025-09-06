import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

type ErrorState = { error: Error | null }

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{unknown}>,
  ErrorState
> {
  constructor(props: React.PropsWithChildren<{unknown}>) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: unknown): ErrorState {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Log to console for developer diagnostics
    console.error('Unhandled error caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-2xl w-full">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              An unexpected error occurred. The details are shown below — check
              the browser console for a full stack trace.
            </p>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded text-sm">
              {this.state.error.toString()}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
)
