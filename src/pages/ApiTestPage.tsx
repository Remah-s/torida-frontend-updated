/**
 * API Integration Test Dashboard
 * Comprehensive UI for running and visualizing API test results
 * Access: /dev/api-tests (only available in development mode)
 */

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  runAllTests,
  runHealthCheck,
  runAuthTests,
  runInterceptorTests,
  runResponseFormatTests,
  runPublicTests,
  runProtectedTests,
  type ApiTestResult,
} from '@/utils/apiTests';
import { checkApiHealth, type HealthCheckResult } from '@/utils/apiHealth';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';

// ─── Status Badge Component ──────────────────────────────────

const StatusBadge: React.FC<{ status: ApiTestResult['status'] }> = ({ status }) => {
  const styles: Record<string, string> = {
    PASS: 'background: #059669; color: white;',
    FAIL: 'background: #DC2626; color: white;',
    WARN: 'background: #D97706; color: white;',
    SKIP: 'background: #6B7280; color: white;',
  };
  const labels: Record<string, string> = {
    PASS: '✓ PASS',
    FAIL: '✗ FAIL',
    WARN: '⚠ WARN',
    SKIP: '⏭ SKIP',
  };

  return (
    <span
      style={{
        ...Object.fromEntries(
          styles[status].split(';').filter(Boolean).map((s) => {
            const [k, v] = s.split(':').map((x) => x.trim());
            return [k.replace(/-([a-z])/g, (_, l) => l.toUpperCase()), v];
          })
        ),
        padding: '2px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        display: 'inline-block',
        minWidth: '70px',
        textAlign: 'center' as const,
      }}
    >
      {labels[status]}
    </span>
  );
};

// ─── Main Page Component ─────────────────────────────────────

const ApiTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string) => {
    setTestOutput((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  // Intercept console.log to capture test output
  const withConsoleCapture = useCallback(
    async (fn: () => Promise<ApiTestResult[]>) => {
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;

      console.log = (...args: unknown[]) => {
        originalLog(...args);
        addLog(args.map(String).join(' '));
      };
      console.warn = (...args: unknown[]) => {
        originalWarn(...args);
        addLog(`⚠ ${args.map(String).join(' ')}`);
      };
      console.error = (...args: unknown[]) => {
        originalError(...args);
        addLog(`❌ ${args.map(String).join(' ')}`);
      };

      try {
        return await fn();
      } finally {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
      }
    },
    [addLog]
  );

  const runTest = useCallback(
    async (name: string, fn: () => Promise<ApiTestResult[]>) => {
      setIsRunning(true);
      setActiveTest(name);
      setTestOutput([]);
      setTestResults([]);
      setHealthStatus(null);

      try {
        addLog(`🚀 Starting ${name}...`);
        addLog(`   Base URL: ${API_CONFIG.baseURL}`);
        addLog(`   Token: ${localStorage.getItem(STORAGE_KEYS.accessToken) ? 'Present' : 'Missing'}`);
        addLog('');

        // Run health check first for "Run All"
        if (name === 'Run All Tests') {
          const health = await checkApiHealth();
          setHealthStatus(health);
          addLog(`Health: ${health.healthy ? '✓ Healthy' : '✗ Unhealthy'}`);
        }

        const results = await withConsoleCapture(fn);
        setTestResults(results);
        addLog('');
        addLog(`✅ ${name} complete — ${results.length} tests executed`);
      } catch (error: unknown) {
        addLog(`❌ Fatal error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsRunning(false);
        setActiveTest(null);
      }
    },
    [addLog, withConsoleCapture]
  );

  const handleExportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      baseUrl: API_CONFIG.baseURL,
      healthStatus,
      testResults,
      logs: testOutput,
      summary: {
        total: testResults.length,
        passed: testResults.filter((r) => r.status === 'PASS').length,
        failed: testResults.filter((r) => r.status === 'FAIL').length,
        warned: testResults.filter((r) => r.status === 'WARN').length,
        skipped: testResults.filter((r) => r.status === 'SKIP').length,
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `torida-api-tests-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const passCount = testResults.filter((r) => r.status === 'PASS').length;
  const failCount = testResults.filter((r) => r.status === 'FAIL').length;
  const skipCount = testResults.filter((r) => r.status === 'SKIP').length;
  const warnCount = testResults.filter((r) => r.status === 'WARN').length;
  const total = testResults.length;
  const successRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : '0';

  // Inline styles for zero-dependency styling
  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '32px',
    } as React.CSSProperties,
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    } as React.CSSProperties,
    title: {
      fontSize: '32px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    } as React.CSSProperties,
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
      marginTop: '4px',
    } as React.CSSProperties,
    backBtn: {
      background: 'rgba(148, 163, 184, 0.1)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: '#94a3b8',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    } as React.CSSProperties,
    card: {
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
    } as React.CSSProperties,
    cardTitle: {
      fontSize: '18px',
      fontWeight: 700,
      marginBottom: '16px',
      color: '#f1f5f9',
    } as React.CSSProperties,
    btnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
    } as React.CSSProperties,
    btn: (color: string, disabled: boolean) =>
      ({
        background: disabled
          ? 'rgba(100, 116, 139, 0.3)'
          : `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: disabled ? '#64748b' : 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }) as React.CSSProperties,
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '16px',
    } as React.CSSProperties,
    statCard: (bg: string) =>
      ({
        background: bg,
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center' as const,
      }) as React.CSSProperties,
    statValue: {
      fontSize: '36px',
      fontWeight: 800,
      lineHeight: 1,
    } as React.CSSProperties,
    statLabel: {
      fontSize: '12px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginTop: '4px',
      opacity: 0.8,
    } as React.CSSProperties,
    progressBar: {
      width: '100%',
      height: '8px',
      background: 'rgba(148, 163, 184, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden' as const,
    } as React.CSSProperties,
    progressFill: (pct: number) =>
      ({
        height: '100%',
        width: `${pct}%`,
        background:
          pct >= 80
            ? 'linear-gradient(90deg, #059669, #34d399)'
            : pct >= 50
              ? 'linear-gradient(90deg, #d97706, #fbbf24)'
              : 'linear-gradient(90deg, #dc2626, #f87171)',
        borderRadius: '4px',
        transition: 'width 0.5s ease',
      }) as React.CSSProperties,
    resultRow: (status: string) =>
      ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '10px',
        marginBottom: '6px',
        background:
          status === 'PASS'
            ? 'rgba(5, 150, 105, 0.1)'
            : status === 'FAIL'
              ? 'rgba(220, 38, 38, 0.1)'
              : status === 'WARN'
                ? 'rgba(217, 119, 6, 0.1)'
                : 'rgba(107, 114, 128, 0.08)',
        borderLeft: `3px solid ${
          status === 'PASS'
            ? '#059669'
            : status === 'FAIL'
              ? '#dc2626'
              : status === 'WARN'
                ? '#d97706'
                : '#6b7280'
        }`,
      }) as React.CSSProperties,
    mono: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: '13px',
    } as React.CSSProperties,
    console: {
      background: '#0a0e14',
      borderRadius: '12px',
      padding: '20px',
      maxHeight: '400px',
      overflowY: 'auto' as const,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '12px',
      lineHeight: 1.6,
      color: '#4ade80',
      border: '1px solid rgba(74, 222, 128, 0.1)',
    } as React.CSSProperties,
    infoBar: {
      display: 'flex',
      gap: '24px',
      padding: '12px 20px',
      background: 'rgba(56, 189, 248, 0.08)',
      borderRadius: '10px',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      marginBottom: '24px',
      fontSize: '13px',
      color: '#94a3b8',
      flexWrap: 'wrap' as const,
    } as React.CSSProperties,
    spinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>🔬 API Integration Tests</h1>
            <p style={s.subtitle}>TORIDA B2B Marketplace — Development Testing Dashboard</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* Info Bar */}
        <div style={s.infoBar}>
          <span>
            <strong>Base URL:</strong>{' '}
            <code style={{ color: '#38bdf8' }}>{API_CONFIG.baseURL}</code>
          </span>
          <span>
            <strong>Auth:</strong>{' '}
            {localStorage.getItem(STORAGE_KEYS.accessToken) ? (
              <span style={{ color: '#4ade80' }}>✓ Logged In</span>
            ) : (
              <span style={{ color: '#fbbf24' }}>⚠ Not Authenticated</span>
            )}
          </span>
          <span>
            <strong>Mode:</strong> <span style={{ color: '#c084fc' }}>Development</span>
          </span>
        </div>

        {/* Test Controls */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Test Controls</h2>
          <div style={s.btnGrid}>
            <button
              style={s.btn('#2563eb', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Health Check', runHealthCheck)}
            >
              {isRunning && activeTest === 'Health Check' ? (
                <span style={s.spinner} />
              ) : (
                '🏥'
              )}{' '}
              Health Check
            </button>
            <button
              style={s.btn('#7c3aed', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Run All Tests', runAllTests)}
            >
              {isRunning && activeTest === 'Run All Tests' ? (
                <span style={s.spinner} />
              ) : (
                '🚀'
              )}{' '}
              Run All Tests
            </button>
            <button
              style={s.btn('#059669', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Public Tests', runPublicTests)}
            >
              {isRunning && activeTest === 'Public Tests' ? (
                <span style={s.spinner} />
              ) : (
                '🌐'
              )}{' '}
              Public Tests
            </button>
            <button
              style={s.btn('#d97706', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Auth Tests', runAuthTests)}
            >
              {isRunning && activeTest === 'Auth Tests' ? (
                <span style={s.spinner} />
              ) : (
                '🔐'
              )}{' '}
              Auth Tests
            </button>
            <button
              style={s.btn('#0891b2', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Interceptor Tests', runInterceptorTests)}
            >
              {isRunning && activeTest === 'Interceptor Tests' ? (
                <span style={s.spinner} />
              ) : (
                '🔄'
              )}{' '}
              Interceptor Tests
            </button>
            <button
              style={s.btn('#e11d48', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Response Format Tests', runResponseFormatTests)}
            >
              {isRunning && activeTest === 'Response Format Tests' ? (
                <span style={s.spinner} />
              ) : (
                '📦'
              )}{' '}
              Response Format
            </button>
            <button
              style={s.btn('#9333ea', isRunning)}
              disabled={isRunning}
              onClick={() => runTest('Protected Tests', runProtectedTests)}
            >
              {isRunning && activeTest === 'Protected Tests' ? (
                <span style={s.spinner} />
              ) : (
                '🔒'
              )}{' '}
              Protected Tests
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              style={{
                ...s.backBtn,
                opacity: isRunning || total === 0 ? 0.5 : 1,
                cursor: isRunning || total === 0 ? 'not-allowed' : 'pointer',
              }}
              disabled={isRunning || total === 0}
              onClick={() => {
                setTestResults([]);
                setHealthStatus(null);
                setTestOutput([]);
              }}
            >
              🗑 Clear Results
            </button>
            {total > 0 && (
              <button style={s.backBtn} onClick={handleExportResults}>
                📥 Export JSON
              </button>
            )}
          </div>
        </div>

        {/* Health Status */}
        {healthStatus && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Health Status</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Status</p>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: healthStatus.healthy ? '#4ade80' : '#f87171',
                  }}
                >
                  {healthStatus.healthy ? '✓ Healthy' : '✗ Unhealthy'}
                </p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Base URL</p>
                <p style={{ fontSize: '14px', fontFamily: 'monospace', color: '#38bdf8', wordBreak: 'break-all' }}>
                  {healthStatus.baseUrl}
                </p>
              </div>
              {healthStatus.errors.length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 600 }}>Errors:</p>
                  {healthStatus.errors.map((err, i) => (
                    <p key={i} style={{ color: '#fca5a5', fontSize: '13px', marginLeft: '12px' }}>
                      • {err}
                    </p>
                  ))}
                </div>
              )}
              {healthStatus.warnings.length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>Warnings:</p>
                  {healthStatus.warnings.map((w, i) => (
                    <p key={i} style={{ color: '#fde68a', fontSize: '13px', marginLeft: '12px' }}>
                      • {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Summary */}
        {total > 0 && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Test Summary</h2>
            <div style={s.statGrid}>
              <div style={s.statCard('rgba(56, 189, 248, 0.12)')}>
                <p style={{ ...s.statValue, color: '#38bdf8' }}>{total}</p>
                <p style={s.statLabel}>Total</p>
              </div>
              <div style={s.statCard('rgba(74, 222, 128, 0.12)')}>
                <p style={{ ...s.statValue, color: '#4ade80' }}>{passCount}</p>
                <p style={s.statLabel}>Passed</p>
              </div>
              <div style={s.statCard('rgba(248, 113, 113, 0.12)')}>
                <p style={{ ...s.statValue, color: '#f87171' }}>{failCount}</p>
                <p style={s.statLabel}>Failed</p>
              </div>
              <div style={s.statCard('rgba(251, 191, 36, 0.12)')}>
                <p style={{ ...s.statValue, color: '#fbbf24' }}>{skipCount + warnCount}</p>
                <p style={s.statLabel}>Skipped/Warn</p>
              </div>
            </div>
            <div style={s.progressBar}>
              <div style={s.progressFill(Number(successRate))} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
              Success Rate: <strong style={{ color: '#f1f5f9' }}>{successRate}%</strong> ({passCount}/{total})
            </p>
          </div>
        )}

        {/* Detailed Results */}
        {total > 0 && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Detailed Results</h2>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {testResults.map((result, idx) => (
                <div key={idx} style={s.resultRow(result.status)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge status={result.status} />
                      <span style={{ ...s.mono, color: '#e2e8f0' }}>
                        <span style={{ color: '#94a3b8' }}>{result.method}</span>{' '}
                        {result.endpoint}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginTop: '4px',
                        marginLeft: '82px',
                      }}
                    >
                      {result.message}
                    </p>
                    {result.error && result.status === 'FAIL' && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#fca5a5',
                          marginTop: '2px',
                          marginLeft: '82px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {result.error}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '60px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {result.responseTime ? `${result.responseTime.toFixed(0)}ms` : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Console Output */}
        {testOutput.length > 0 && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>📟 Console Output</h2>
            <div ref={logContainerRef} style={s.console}>
              {testOutput.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    color: log.includes('❌')
                      ? '#f87171'
                      : log.includes('⚠')
                        ? '#fbbf24'
                        : log.includes('✓') || log.includes('✅')
                          ? '#4ade80'
                          : '#94a3b8',
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 0',
            color: '#475569',
            fontSize: '12px',
          }}
        >
          TORIDA API Testing Dashboard — Development Only
          <br />
          This page is not included in production builds.
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
