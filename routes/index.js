import express from 'express';
import responderTeam from '../lib/responderTeam.js';
import { createAutoresponderTeam } from '../lib/autoresponderTeam.js';
import { getClient, getAuthUrl, isAuthenticated } from '../lib/oauth.js';
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers.host || 'localhost';
  const authRedirectUrl = `${protocol}://${host}/auth/callback`;
  const client = getClient(authRedirectUrl);
  const authenticated = isAuthenticated();
  const authUrl = getAuthUrl(client);

  console.log('AUTH-REDIRECT-URL:', authRedirectUrl);
  console.log('REQ-HEADERS:', req.headers);

  res.render('index', { authenticated, authUrl });
});

// Process email endpoint
router.post('/process-email', async (req, res) => {
  console.log(req.body);
  const result = await responderTeam.start(req.body);
  if (result.status === 'FINISHED') {
    const resultData = JSON.parse(result.result);
    res.render('email', resultData);
  } else if (result.status === 'BLOCKED') {
    console.log('Workflow is blocked, unable to complete');
    res.send('ERROR: Workflow is blocked, unable to complete')
  }
})

router.get('/autorespond-email', async (req, res) => {
  const autoResponderTeam = await createAutoresponderTeam();
  const result = await autoResponderTeam.start();
  console.log('AUTORESPOND-RESULT:', result.result);
  res.sendStatus(204)
})

export default router;
