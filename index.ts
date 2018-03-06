import * as http from 'http';
import * as httpProxy from 'http-proxy';
import { verifyJWTBySignature } from './jwt';

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(async (req, res) => {
  try {
    const jwt = (req.headers.authorization as string).slice('Bearer '.length);
    const valid = await verifyJWTBySignature(jwt);
    if (valid) {
      proxy.web(req, res, { target: 'http://127.0.0.1:5050'});
    }
  }
  catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end();
  }
});

console.log("listening on port 8080")
server.listen(8080);