/**
 * API Health Check Utility
 * Tests backend availability and core functionality on app startup
 */

import { API_CONFIG } from '@/constants';

export interface HealthCheckResult {
  healthy: boolean;
  baseUrl: string;
  timestamp: string;
  errors: string[];
  warnings: string[];
}

const healthCheckResults: HealthCheckResult = {
  healthy: true,
  baseUrl: API_CONFIG.baseURL,
  timestamp: new Date().toISOString(),
  errors: [],
  warnings: [],
};

/**
 * Perform basic health check on API startup
 */
export async function checkApiHealth(): Promise<HealthCheckResult> {
  const results = healthCheckResults;
  results.timestamp = new Date().toISOString();
  results.healthy = true;

  try {
    console.log(`[API Health] Starting health check for ${API_CONFIG.baseURL}...`);

    // In development mode, use relative paths to benefit from Vite proxy
    // In production, use full URLs
    const useProxy = import.meta.env.DEV;
    const baseUrl = useProxy ? '' : API_CONFIG.baseURL;

    // Test basic connectivity
    try {
      const healthUrl = `${baseUrl}/health`;
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (healthResponse.status === 200) {
        console.log('[API Health] ✓ Backend health check passed');
      } else if (healthResponse.status === 404) {
        console.warn('[API Health] ⚠ /health endpoint not found, trying alternative checks');
        results.warnings.push('Health endpoint not available');
      } else {
        console.error(`[API Health] Health check returned ${healthResponse.status}`);
        results.errors.push(`Health check failed with status ${healthResponse.status}`);
        results.healthy = false;
      }
    } catch (err: any) {
      console.error('[API Health] Failed to reach health endpoint', err.message);
      results.warnings.push(`Health endpoint unreachable: ${err.message}`);
    }

    // Test basic API connectivity with a public endpoint
    try {
      const govUrl = `${baseUrl}/api/governorates`;
      const govResponse = await fetch(govUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (govResponse.status === 200) {
        console.log('[API Health] ✓ Public API endpoint accessible');
      } else if (govResponse.status === 404) {
        console.error('[API Health] Governorates endpoint not found');
        results.errors.push('Governorates endpoint not found');
        results.healthy = false;
      } else {
        console.error(`[API Health] Governorates endpoint returned ${govResponse.status}`);
        results.warnings.push(`Governorates endpoint returned ${govResponse.status}`);
      }
    } catch (err: any) {
      console.error('[API Health] Failed to access governorates endpoint', err.message);
      results.errors.push(`Cannot reach governorates endpoint: ${err.message}`);
      results.healthy = false;
    }

    console.log('[API Health] Health check complete', {
      healthy: results.healthy,
      errors: results.errors,
      warnings: results.warnings,
    });
  } catch (err: any) {
    console.error('[API Health] Unexpected error during health check', err);
    results.errors.push(`Unexpected error: ${err.message}`);
    results.healthy = false;
  }

  return results;
}

/**
 * Log detailed API error information for debugging
 */
export function logApiError(
  endpoint: string,
  error: any,
  additionalContext?: Record<string, any>
): void {
  const errorLog = {
    timestamp: new Date().toISOString(),
    endpoint,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    message: error?.message,
    data: error?.response?.data,
    config: {
      url: error?.config?.url,
      method: error?.config?.method,
      baseURL: error?.config?.baseURL,
      headers: error?.config?.headers,
    },
    ...additionalContext,
  };

  console.error(`[API Error] ${endpoint}:`, errorLog);
  console.table(errorLog);
}

/**
 * Verify response format matches expected API response structure
 */
export function validateApiResponse(response: any): { valid: boolean; error?: string } {
  if (!response) {
    return { valid: false, error: 'Response is null or undefined' };
  }

  // Check for expected response structure
  if (typeof response.success === 'undefined') {
    return { valid: false, error: 'Response missing "success" property' };
  }

  if (typeof response.data === 'undefined' && response.success) {
    return { valid: false, error: 'Success response missing "data" property' };
  }

  return { valid: true };
}

export default {
  checkApiHealth,
  logApiError,
  validateApiResponse,
};
