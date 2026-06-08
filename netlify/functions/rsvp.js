const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }), headers };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }), headers };
  }

  const { name, contact, event: eventTitle, note } = body;
  if (!name || !contact || !eventTitle) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }), headers };
  }

  // Expect environment vars: GITHUB_TOKEN and GITHUB_REPO (owner/repo)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. owner/repo

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }), headers };
  }

  const issueTitle = `RSVP: ${name} — ${eventTitle}`;
  const issueBody = `**Name:** ${name}\n**Contact:** ${contact}\n**Event:** ${eventTitle}\n**Note:** ${note || ''}\n\n_Submitted via website RSVP form._`;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody, labels: ['rsvp'] })
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'GitHub API error', detail: text }), headers };
    }

    const data = await res.json();
    return { statusCode: 201, body: JSON.stringify({ ok: true, url: data.html_url }), headers };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Request failed', detail: err.message }), headers };
  }
};
