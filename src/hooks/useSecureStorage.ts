import { useState, useEffect } from 'react';

// Generate multiple stable browser fingerprints for cross-verification
function generateStableFingerprint(): string {
  const stableIdentifiers = [
    navigator.userAgent.split(' ')[0], // Browser name only
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.width.toString(),
    screen.height.toString(),
    'forexbot-stable-key-v2' // Updated version for consistency
  ];
  
  const fingerprint = stableIdentifiers.join('|');
  
  // Enhanced hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Generate a secondary fingerprint for cross-validation
function generateSecondaryFingerprint(): string {
  const identifiers = [
    navigator.platform,
    navigator.hardwareConcurrency?.toString() || '4',
    navigator.maxTouchPoints?.toString() || '0',
    'forexbot-secondary-v2'
  ];
  
  const fingerprint = identifiers.join('|');
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 7) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

// Get or create a persistent device ID with multiple fallbacks
function getDeviceId(): string {
  // Try multiple storage locations for redundancy
  const storageKeys = ['forexBotDeviceId', 'forexBotDeviceId_backup', 'forexBotDeviceId_v2'];
  
  for (const key of storageKeys) {
    const deviceId = localStorage.getItem(key);
    if (deviceId) {
      // Store in all locations for redundancy
      storageKeys.forEach(k => localStorage.setItem(k, deviceId));
      return deviceId;
    }
  }
  
  // Create new device ID if none found
  const newDeviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
  
  // Store in all locations
  storageKeys.forEach(key => localStorage.setItem(key, newDeviceId));
  
  return newDeviceId;
}

// Enhanced encryption with multiple keys
function encryptData(data: string, primaryKey: string, secondaryKey: string): string {
  let result = '';
  const combinedKey = primaryKey + secondaryKey;
  
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ combinedKey.charCodeAt(i % combinedKey.length));
  }
  return btoa(result);
}

// Enhanced decryption with fallback keys
function decryptData(encryptedData: string, primaryKey: string, secondaryKey: string): string {
  try {
    const data = atob(encryptedData);
    let result = '';
    const combinedKey = primaryKey + secondaryKey;
    
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ combinedKey.charCodeAt(i % combinedKey.length));
    }
    return result;
  } catch {
    return '';
  }
}

// Enhanced session validation with abuse detection
function validateSession(): boolean {
  const sessionKeys = ['forexBotSession', 'forexBotSession_backup'];
  let session = null;
  
  // Try to load from any available session storage
  for (const key of sessionKeys) {
    const sessionData = localStorage.getItem(key);
    if (sessionData) {
      try {
        session = JSON.parse(sessionData);
        break;
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
  
  const now = Date.now();
  const deviceId = getDeviceId();
  
  if (!session) {
    // Create new session
    session = {
      created: now,
      deviceId: deviceId,
      requests: [],
      lastActivity: now,
      fingerprint: generateStableFingerprint(),
      secondaryFingerprint: generateSecondaryFingerprint()
    };
  } else {
    // Update device ID if needed but don't invalidate session
    if (!session.deviceId || session.deviceId !== deviceId) {
      session.deviceId = deviceId;
    }
    
    // Update fingerprints if missing
    if (!session.fingerprint) {
      session.fingerprint = generateStableFingerprint();
    }
    if (!session.secondaryFingerprint) {
      session.secondaryFingerprint = generateSecondaryFingerprint();
    }
    
    session.lastActivity = now;
  }
  
  // Enhanced abuse detection
  if (session.requests && session.requests.length > 0) {
    const recentRequests = session.requests.filter((time: number) => now - time < 60 * 60 * 1000); // Last hour
    const veryRecentRequests = session.requests.filter((time: number) => now - time < 5 * 60 * 1000); // Last 5 minutes
    
    // Rate limiting checks
    if (recentRequests.length > 100) {
      console.warn('High usage detected in the last hour');
    }
    
    if (veryRecentRequests.length > 20) {
      console.warn('Very high usage detected in the last 5 minutes');
      // Could implement temporary cooldown here if needed
    }
  }
  
  // Store session in multiple locations for redundancy
  const sessionString = JSON.stringify(session);
  sessionKeys.forEach(key => localStorage.setItem(key, sessionString));
  
  return true;
}

// Enhanced request logging with better tracking
function logRequest(): void {
  const sessionKeys = ['forexBotSession', 'forexBotSession_backup'];
  const now = Date.now();
  
  let session = {
    created: now,
    deviceId: getDeviceId(),
    requests: [now],
    lastActivity: now,
    fingerprint: generateStableFingerprint(),
    secondaryFingerprint: generateSecondaryFingerprint()
  };
  
  // Try to load existing session
  for (const key of sessionKeys) {
    const sessionData = localStorage.getItem(key);
    if (sessionData) {
      try {
        session = JSON.parse(sessionData);
        break;
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
  
  // Update session
  session.requests = session.requests || [];
  session.requests.push(now);
  session.lastActivity = now;
  
  // Keep only last 200 requests for better tracking
  if (session.requests.length > 200) {
    session.requests = session.requests.slice(-200);
  }
  
  // Store in multiple locations
  const sessionString = JSON.stringify(session);
  sessionKeys.forEach(key => localStorage.setItem(key, sessionString));
}

// Cross-tab synchronization
function syncAcrossTabs(key: string, value: any): void {
  // Store in multiple locations for cross-tab sync
  const syncKeys = [key, `${key}_sync`, `${key}_backup`];
  const dataString = JSON.stringify(value);
  
  syncKeys.forEach(syncKey => {
    try {
      localStorage.setItem(syncKey, dataString);
    } catch (error) {
      console.warn(`Failed to sync data for key ${syncKey}:`, error);
    }
  });
  
  // Dispatch storage event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: key,
    newValue: dataString,
    storageArea: localStorage
  }));
}

export function useSecureStorage<T>(key: string, initialValue: T) {
  const primaryFingerprint = generateStableFingerprint();
  const secondaryFingerprint = generateSecondaryFingerprint();
  const deviceId = getDeviceId();
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Validate session first
      validateSession();
      
      // Try multiple storage locations
      const storageKeys = [key, `${key}_backup`, `${key}_sync`];
      
      for (const storageKey of storageKeys) {
        const item = localStorage.getItem(storageKey);
        if (!item) continue;
        
        // Try to decrypt with current fingerprints
        const decrypted = decryptData(item, primaryFingerprint, secondaryFingerprint);
        
        if (decrypted) {
          try {
            const parsed = JSON.parse(decrypted);
            // Store in all locations for redundancy
            storageKeys.forEach(sk => {
              if (sk !== storageKey) {
                localStorage.setItem(sk, item);
              }
            });
            return parsed;
          } catch {
            // Continue to next storage key
          }
        }
        
        // Try to parse as plain JSON (fallback for migration)
        try {
          const parsed = JSON.parse(item);
          // Re-encrypt and store
          const encrypted = encryptData(JSON.stringify(parsed), primaryFingerprint, secondaryFingerprint);
          storageKeys.forEach(sk => localStorage.setItem(sk, encrypted));
          return parsed;
        } catch {
          // Continue to next storage key
        }
      }
      
      return initialValue;
    } catch (error) {
      console.error(`Error reading secure storage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      validateSession();
      
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Encrypt and store in multiple locations
      const dataString = JSON.stringify(valueToStore);
      const encrypted = encryptData(dataString, primaryFingerprint, secondaryFingerprint);
      
      const storageKeys = [key, `${key}_backup`, `${key}_sync`];
      storageKeys.forEach(storageKey => {
        try {
          localStorage.setItem(storageKey, encrypted);
        } catch (error) {
          console.warn(`Failed to store data for key ${storageKey}:`, error);
        }
      });
      
      // Log this action for abuse prevention
      logRequest();
      
      // Sync across tabs
      syncAcrossTabs(key, valueToStore);
      
    } catch (error) {
      console.error(`Error setting secure storage key "${key}":`, error);
    }
  };

  // Listen for cross-tab changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch {
          // Ignore invalid data
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Initialize and maintain device tracking
  useEffect(() => {
    getDeviceId();
    validateSession();
  }, []);

  return [storedValue, setValue] as const;
}