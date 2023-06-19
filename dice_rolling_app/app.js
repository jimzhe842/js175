const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

function dieRoll(min, max) {
  return (Math.floor(Math.random() * (max - min + 1))) + min;
}

// Abstract getParams
// Abstract getContent



const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;
  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    const myURL = new URL(path, `http://localhost:${PORT}`);
    let params = myURL.searchParams;
    let rolls = Number(params.get('rolls')) || 1;
    let sides = Number(params.get('sides')) || 6;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    for (let idx = 0; idx < rolls; idx++) {
      let content = dieRoll(1, sides);
      res.write(`${content}\n`);
    }
    res.write(`${method} ${path}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});