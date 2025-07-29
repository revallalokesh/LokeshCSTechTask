// backend/api/index.js

import app from '../app.js';
import { createServer } from 'http';

export default function handler(req, res) {
  const server = createServer((req, res) => app(req, res));
  return server.emit('request', req, res);
}
