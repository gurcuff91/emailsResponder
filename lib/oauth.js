import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');


export function isAuthenticated() {
    return fs.existsSync(TOKEN_PATH);
}

export function getClient(redirect_uri = 'http://localhost') {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri
    );
}

export function getAuthUrl(client) {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}

export async function createToken(client, code) {
    const { tokens } = await client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to:', TOKEN_PATH);
}

export async function getAuthenticatedClient() {
    const client = getClient();
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    client.setCredentials(tokens);

    // Check if token is expired
    const expiryDate = client.credentials.expiry_date;
    const now = Date.now();
    if (!client.credentials.access_token || !expiryDate || now >= expiryDate) {
        const refresh = await client.refreshAccessToken();
        const tokens = { ...client.credentials, ...refresh.credentials }
        // Update credentials
        client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token refreshed');
    }
    return client;
}

export function revokeToken() {
    if (fs.existsSync(TOKEN_PATH)) {
        fs.unlinkSync(TOKEN_PATH);
        console.log('Token revoked');
    }
}
