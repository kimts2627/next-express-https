// const express = require('express')
// const next = require('next')

// const port = parseInt(process.env.PORT, 10) || 3000
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   const server = express()

//   server.get('/a', (req, res) => {
//     return app.render(req, res, '/a', req.query)
//   })

//   server.get('/b', (req, res) => {
//     return app.render(req, res, '/b', req.query)
//   })

//   server.all('*', (req, res) => {
//     return handle(req, res)
//   })

//   server.listen(port, (err) => {
//     if (err) throw err
//     console.log(`> Ready on https://localhost:${port}`)
//   })
// })

const {createServer: https} = require('https');
const {createServer: http} = require('http');
const {parse} = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const ports = {
  http: 3080,
  https: 3001,
};

const httpsOptions = {
  key: fs.readFileSync('./key.pem', 'utf-8'),
  cert: fs.readFileSync('./cert.pem', 'utf-8'),
};

app.prepare().then(() => {
  http((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(ports.http, (err) => {
    if (err) throw err;
    console.log(`> HTTP: Ready on http://localhost:${ports.http}`);
  });

  https(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(ports.https, (err) => {
    if (err) throw err;
    console.log(`> HTTPS: Ready on https://localhost:${ports.https}`);
  });
});
