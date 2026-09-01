const net = require("net");

const PORT = 8000;

const backends = [
  {
    host: "backend-1",
    port: 3000,
  },
  {
    host: "backend-2",
    port: 3000,
  },
]

let currentBackend = 0;

const server = net.createServer((clientSocket)=>{

  const backend = backends[currentBackend];

  currentBackend = (currentBackend + 1) % backends.length;

  const backendSocket = net.createConnection({
    host: backend.host,
    port: backend.port
  }, ()=>{
    console.log("Connected to backend");

    clientSocket.pipe(backendSocket);
    backendSocket.pipe(clientSocket)
  });
});

server.listen(PORT, ()=>{
  console.log(`Load balancer listening on port ${PORT}`);
})
