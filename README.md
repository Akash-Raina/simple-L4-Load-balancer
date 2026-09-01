Simple L4 Load Balancer

A small educational project to understand how a Layer 4 (TCP) load balancer works by implementing one from scratch using Node.js and Docker.

The goal is learning the networking concepts underneath a load balancer instead of starting with Nginx, HAProxy, or a cloud load-balancing service.

Current Architecture

                    Client
                       |
                       | TCP :8000
                       v
              +-------------------+
              |  L4 Load Balancer |
              |     Node.js       |
              +---------+---------+
                        |
                 Docker Network
                  /            \
                 /              \
                v                v
        +-------------+   +-------------+
        |  backend-1  |   |  backend-2  |
        |    :3000    |   |    :3000    |
        +-------------+   +-------------+

Project Structure

simple-l4-lb/
├── backend/
│ ├── server.js
│ └── Dockerfile
├── load-balancer/
│ ├── server.js
│ └── Dockerfile
└── docker-compose.yml

What We Have Built

Backend servers

Both backend containers run the same Node.js HTTP server.

The server:

listens on port 3000

reads SERVER_NAME from an environment variable

responds with the server name

logs incoming HTTP requests

Example responses:

Hello from backend-1
Hello from backend-2

Dockerfile

The Dockerfile defines how an application container is built and started.

FROM node:22-alpine
WORKDIR /app
COPY server.js .
CMD ["node", "server.js"]

Docker Compose

Docker Compose runs the two backend containers and the load balancer together.

Both backend services use the same backend Dockerfile but receive different environment variables:

SERVER_NAME: backend-1
SERVER_NAME: backend-2

The load balancer exposes port 8000 to the host:

ports:

- "8000:8000"

Inside the Docker network, the load balancer can reach:

backend-1:3000
backend-2:3000

Docker's internal DNS resolves those service names to the corresponding container IPs.

L4 Load Balancer

The load balancer uses Node.js's built-in net module.

It operates at the TCP level.

It does not need to understand:

HTTP methods

URLs

headers

JSON

application logic

Instead, it forwards bytes between two TCP connections.

Conceptually:

Client
|
| TCP connection #1
v
Load Balancer
|
| TCP connection #2
v
Backend

The LB connects the two streams:

clientSocket.pipe(backendSocket);
backendSocket.pipe(clientSocket);

Current Load Balancing Algorithm

The current implementation uses round-robin.

TCP connection 1 → backend-1
TCP connection 2 → backend-2
TCP connection 3 → backend-1
TCP connection 4 → backend-2

Important:

Because this is an L4 load balancer, our current implementation balances TCP connections, not individual HTTP requests.

If one TCP connection stays open and carries 100 HTTP requests:

1 TCP connection
|
+-- HTTP request 1
+-- HTTP request 2
+-- HTTP request 3
...
+-- HTTP request 100

all 100 requests remain associated with the same backend connection.

Networking Concepts Being Learned

This project is being used to understand:

IP addresses

Ports

TCP

TCP connections

TCP sockets

TCP byte streams

OS networking stack

Node.js net module

Docker networking

L4 load balancing

Connection-level round robin

HTTP keep-alive

Health checks and failure handling

Useful Mental Model

Application
|
| HTTP bytes
v
Node.js
|
v
Socket
|
v
OS TCP/IP stack
|
v
TCP segments
|
v
Network

TCP provides a reliable, ordered byte stream. It does not understand HTTP request boundaries.

Therefore:

HTTP
↓
TCP byte stream
↓
TCP segments
↓
Network

The receiving TCP stack reconstructs the byte stream before delivering it to the application.

Planned Improvements

This project will be extended gradually to understand real load-balancer concepts:

Two backend servers

Dockerized backend servers

Basic TCP proxy

Dockerized load balancer

Round-robin connection distribution

Test multiple HTTP requests over one TCP connection

Understand TCP connection lifecycle

Health checks

Remove unhealthy backends

Add a backend back after recovery

Test backend failure

Add connection/error handling

Add weighted load balancing

Compare L4 vs L7 load balancing

Compare implementation with Nginx/HAProxy/cloud LBs

Running the Project

Start everything:

docker compose up --build

Test the load balancer:

curl http://localhost:8000

The response will come from whichever backend receives the TCP connection.

Learning Goal

The purpose of this project is not production readiness.

The purpose is to build the mental model:

Client
↓
TCP connection
↓
L4 Load Balancer
↓
Choose backend
↓
Create backend TCP connection
↓
Forward bytes
↓
Backend

Once this is understood, concepts such as connection pooling, health checks, failover, L7 routing, and production load balancers become much easier to understand.
