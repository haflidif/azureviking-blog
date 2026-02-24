#!/usr/bin/env node
/**
 * LinkedIn OAuth2 Helper Script
 *
 * One-time use: Gets your LinkedIn access token + refresh token.
 *
 * Prerequisites:
 *   1. Create a LinkedIn App at https://www.linkedin.com/developers/apps
 *   2. Add products: "Share on LinkedIn" + "Sign In with LinkedIn using OpenID Connect"
 *   3. Add redirect URL: http://localhost:3000/callback
 *
 * Usage:
 *   node .github/scripts/linkedin-auth-helper.mjs --client-id=YOUR_ID --client-secret=YOUR_SECRET
 */

import http from 'node:http';
import { URL } from 'node:url';

const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
};

const CLIENT_ID = getArg('client-id') || process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = getArg('client-secret') || process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = 'openid profile w_member_social';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Usage: node linkedin-auth-helper.mjs --client-id=YOUR_ID --client-secret=YOUR_SECRET'
  );
  console.error('Or set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.');
  process.exit(1);
}

const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n=== LinkedIn OAuth2 Helper ===\n');
console.log('Opening browser for authorization...');
console.log(`\nIf the browser does not open, visit:\n${authUrl}\n`);

// Open browser
const openCmd =
  process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
import('node:child_process').then(({ exec }) => exec(`${openCmd} "${authUrl}"`));

// Start local server to catch the callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3000`);

  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Error</h1><p>${error}: ${url.searchParams.get('error_description')}</p>`);
    console.error(`\nAuthorization error: ${error}`);
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h1>Error</h1><p>No authorization code received.</p>');
    return;
  }

  console.log('Authorization code received. Exchanging for tokens...');

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokens = await tokenResponse.json();

    // Get person URN
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new Error(`Profile fetch failed: ${await profileResponse.text()}`);
    }

    const profile = await profileResponse.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    console.log('\n=== SUCCESS! ===\n');
    console.log(`Name: ${profile.name}`);
    console.log(`Person URN: ${personUrn}`);
    console.log(`Access Token expires in: ${Math.round(tokens.expires_in / 86400)} days`);
    console.log('\n--- Add these as GitHub Secrets ---\n');
    console.log(`LINKEDIN_CLIENT_ID=${CLIENT_ID}`);
    console.log(`LINKEDIN_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`LINKEDIN_ACCESS_TOKEN=${tokens.access_token}`);
    console.log(
      `LINKEDIN_REFRESH_TOKEN=${tokens.refresh_token || '(not provided - ensure "Sign In with LinkedIn" product is enabled)'}`
    );
    console.log(`LINKEDIN_PERSON_URN=${personUrn}`);
    console.log('\nRun: gh secret set LINKEDIN_ACCESS_TOKEN --body "your_token"');
    console.log('  (repeat for each secret above)\n');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      `<h1>✅ Success!</h1>
      <p>Authorized as <strong>${profile.name}</strong></p>
      <p>Check your terminal for the tokens and GitHub Secrets instructions.</p>
      <p>You can close this tab.</p>`
    );
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<h1>Error</h1><p>${err.message}</p>`);
  }

  setTimeout(() => process.exit(0), 1000);
});

server.listen(3000, () => {
  console.log('Waiting for authorization callback on http://localhost:3000...');
});
