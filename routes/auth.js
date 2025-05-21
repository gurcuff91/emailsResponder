import express from 'express';
import { getClient, createToken, revokeToken } from '../lib/oauth.js';
const router = express.Router();

router.get('/callback', async (req, res) => {
    const client = getClient();
    await createToken(client, req.query.code);
    res.redirect('/');
});

router.get('/revoke', (req, res) => {
    revokeToken();
    res.sendStatus(200);
});

export default router;