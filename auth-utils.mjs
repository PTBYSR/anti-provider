import fs from 'fs';
import path from 'path';

export const CLIENT_ID = '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';
export const CLIENT_SECRET = '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';
export const REDIRECT_URI = 'http://localhost:51121/oauth-callback';
export const SCOPES = 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/cclog https://www.googleapis.com/auth/experimentsandconfigs';
export const AUTH_FILE = path.join(process.cwd(), 'auth.json');
export const CONFIG_FILE = path.join(process.cwd(), 'config.json');

export function loadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    // Ignore read errors
  }
  return null;
}

export function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function loadAuth() {
  return loadJson(AUTH_FILE);
}

export function saveAuth(data) {
  saveJson(AUTH_FILE, data);
}

export async function refreshAuthToken(authData) {
  if (!authData || !authData.refresh_token) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: authData.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${errorText}`);
  }

  const json = await response.json();
  
  if (json.access_token) {
    authData.access_token = json.access_token;
    if (json.refresh_token) {
      authData.refresh_token = json.refresh_token; // Google sometimes returns a new one, usually doesn't
    }
    if (json.expires_in) {
      authData.expires_at = Date.now() + (json.expires_in * 1000);
    }
    saveAuth(authData);
    return authData;
  } else {
    throw new Error('Invalid token refresh response');
  }
}
