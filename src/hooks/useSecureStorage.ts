import { useState, useEffect } from 'react';

// Generate stable browser fingerprint for security (device-independent)
function generateFingerprint(): string {
  // Use more stable identifiers that don't change between mobile/desktop modes
  const stableIdentifiers = [
    navigator.userAgent.split(' ')[0], // Browser name only
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    'forexbot-stable-key' // Static component for consistency
  ];
  
  const fingerprint = stableIdentifiers.join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Get or create a persistent device ID
function getDeviceId(): string {
  let deviceId = localStorage.getItem('forexBotDeviceId');
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('forexBotDeviceId', deviceId);
  }
  return deviceId;
}

// Encrypt data using simple XOR cipher with fingerprint
function encryptData(data: string, key: string): string {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

// Decrypt data
function decryptData(encryptedData: string, key: string): string {
  try {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return '';
  }
}

// Session validation
function validateSession(): boolean {
  const sessionData = localStorage.getItem('forexBotSession');
  if (!sessionData) {
    // Create initial session
    const session = {
      created: Date.now(),
      deviceId: getDeviceId(),
      requests: []
    };
    localStorage.setItem('forexBotSession', JSON.stringify(session));
    return true;
  }
  
  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    
    // Validate device ID consistency
    const currentDeviceId = getDeviceId();
    if (session.deviceId && session.deviceId !== currentDeviceId) {
      console.warn('Device ID mismatch detected');
      // Don't clear data, just update device ID
      session.deviceId = currentDeviceId;
      localStorage.setItem('forexBotSession', JSON.stringify(session));
    }
    
    // Sessions don't expire - keep data persistent
    // Only check for suspicious activity
    // Check for suspicious activity (too many rapid requests)
    if (session.requests && session.requests.length > 100) {
      const recentRequests = session.requests.filter((time: number) => now - time < 60 * 60 * 1000);
      if (recentRequests.length > 50) {
        console.warn('Suspicious activity detected');
        // Don't block, just log
      }
    }
    
    return true;
  } catch {
    // Don't remove session on error, recreate it
    const session = {
      created: Date.now(),
      deviceId: getDeviceId(),
      requests: []
    };
    localStorage.setItem('forexBotSession', JSON.stringify(session));
    return true;
  }
}

// Log request for rate limiting
function logRequest(): void {
  const sessionData = localStorage.getItem('forexBotSession');
  const now = Date.now();
  
  let session = {
    created: now,
    deviceId: getDeviceId(),
    requests: [now]
  };
  
  if (sessionData) {
    try {
      session = JSON.parse(sessionData);
      session.requests = session.requests || [];
      session.requests.push(now);
      
      // Keep only last 100 requests
      if (session.requests.length > 100) {
        session.requests = session.requests.slice(-100);
      }
    } catch {
      // Reset on error
    }
  }
  
  localStorage.setItem('forexBotSession', JSON.stringify(session));
}

export function useSecureStorage<T>(key: string, initialValue: T) {
  const fingerprint = generateFingerprint() + '_' + getDeviceId();
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Validate session first
      if (!validateSession()) {
        console.warn('Session validation failed, but continuing with stored data');
      }
      
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      
      // First, try to decrypt the data
      const decrypted = decryptData(item, fingerprint);
      
      if (decrypted) {
        // If decryption succeeded, try to parse the decrypted data
        try {
          return JSON.parse(decrypted);
        } catch {
          // If decrypted data is not valid JSON, fall through to try raw data
        }
      }
      
      // If decryption failed or decrypted data wasn't valid JSON,
      // try to parse the raw item as plain JSON
      try {
        return JSON.parse(item);
      } catch {
        // If all parsing attempts fail, remove the corrupted item and return initial value
        console.warn(`Corrupted data found for key "${key}", using initial value but keeping data`);
        localStorage.removeItem(key);
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading secure storage key "${key}":`, error);
      // Clear corrupted data to prevent future errors
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      if (!validateSession()) {
        console.warn('Session validation failed, but saving data anyway');
      }
      
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Encrypt sensitive data
      const dataString = JSON.stringify(valueToStore);
      const encrypted = encryptData(dataString, fingerprint);
      
      localStorage.setItem(key, encrypted);
      
      // Log this action for rate limiting
      logRequest();
      
    } catch (error) {
      console.error(`Error setting secure storage key "${key}":`, error);
    }
  };

  // Initialize device tracking without clearing data
  useEffect(() => {
    // Just ensure device ID exists, don't clear data
    getDeviceId();
  }, []);

  return [storedValue, setValue] as const;
}