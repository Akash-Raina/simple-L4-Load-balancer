⚖️ Simple L4 Load Balancer

A simple Layer 4 (TCP) load balancer built with Node.js and Docker.

The goal of this project is to understand how a load balancer works internally instead of using tools like Nginx, HAProxy, or AWS Load Balancer directly.

Built for learning how L4 load balancing works internally.

🏗️ Architecture

                         Client
                           │
                           │ TCP :8000
                           ▼
                  ┌───────────────────┐
                  │   L4 Load         │
                  │   Balancer        │
                  └─────────┬─────────┘
                            │
                     Docker Network
                       ┌────┴────┐
                       ▼         ▼
                  backend-1  backend-2
                    :3000      :3000

📁 Structure

simple-l4-lb/
├── backend/
│   ├── server.js
│   └── Dockerfile
├── load-balancer/
│   ├── server.js
│   └── Dockerfile
└── docker-compose.yml

🖥️ Backend

Both containers run the same Node.js HTTP server.

backend-1 → Hello from backend-1
backend-2 → Hello from backend-2

⚖️ Load Balancer

The LB uses Node.js's built-in net module.

Client
  │
  │ TCP connection
  ▼
Load Balancer
  │
  │ TCP connection
  ▼
Backend

It forwards bytes between the client and backend sockets.

clientSocket.pipe(backendSocket);
backendSocket.pipe(clientSocket);

🔄 Round Robin

Connections are distributed:

Connection 1 → backend-1
Connection 2 → backend-2
Connection 3 → backend-1
Connection 4 → backend-2

currentBackend =
  (currentBackend + 1) % backends.length;

L4 balances TCP connections, not individual HTTP requests.

🚀 Run

docker compose up --build

Test:

curl http://localhost:8000

Expected:

Hello from backend-1
Hello from backend-2

📚 Learning Roadmap

Completed

TCP proxy

Docker networking

Round-robin

Connection-level balancing

Next

TCP handshake

TCP connection lifecycle

TCP byte stream

HTTP keep-alive

Health checks

Failure handling

Weighted balancing

L4 vs L7
