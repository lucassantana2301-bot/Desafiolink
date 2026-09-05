'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import WebGLFallback from './WebGLFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    if (error) {
      // Intentionally acknowledge error object for ErrorBoundary state derivation
    }
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NEXUS WebGL Error Boundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <WebGLFallback />;
    }

    return this.props.children;
  }
}
