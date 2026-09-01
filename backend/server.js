const http = require("http");

const PORT = 3000;

const SERVER_NAME = process.env.SERVER_NAME || "unknown";

const server = http.createServer((req, res)=>{
  console.log(`${SERVER_NAME} received ${req.method} ${req.url}`);

  res.writeHead(200, {
    "Content-Type": "text/plain",
  });

  res.end(`Hello from ${SERVER_NAME}\n`);
})

server.listen(PORT, ()=>{
  console.log(`${SERVER_NAME} is listening on port ${PORT}`)
})
