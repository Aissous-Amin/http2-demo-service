# http2-vs-http1-demo-service
Benchmarking HTTP2 against HTTP1.1 using Nodejs/Express

## Description
HTTP2 vs HTTP1.1 Server with NodeJS/Express.

This is a POC to compare and study the differences between http1 and http2.
For my experiment I launched 2 servers on my ordinary computer:
- Node.js on port 3001 serving over HTTP/1.1 
- Node.js on port 443 serving over HTTP/2

The two servers serve the same static images files from exactly the same path /Config/lib/img3 on my computer.

## What is http2
- Http2 is a major evolution of http1.1 released in 2015 and mainly inspired by the SPDY protocol.
- In this POC I compare the throughput of HTTP/2 and HTTP/1.1. But first I briefly mention the major differences between the two protocols.
- **The differences**
  - In HTTP/1.1, the messages are transferred through network without any additional transformations.
  - In HTTP/2, the headers are compressed and all the messages are transferred not as text but as numbers.
  - HTTP/2 requires encryption using TLS. Browsers do not support unencrypted HTTP/2.
  - Multiplexing : HTTP/2 allows multiple requests and responses to be transferred on the same TCP connection at the same time.
  - With http1.1 Only one request per TCP connection can be pending at a time. To make multiple parallel requests from the same server, browsers open several TCP connections.

## Important
- The advantage of this architecture is the use of the same application source code for both http1 and http2 servers. I configured only two ports for each server and the whole code is the same for both servers.
- Ideally  use an http2 module that allows you to keep the same source code of your server. In our case we used Http2 Express Bridge, which allows me to revert automatically to Http1.1 if the browser don't support http2.

## Generate a self signe certificate with openSSL
`For demonstration purposes we used openssl to generate our certificate (not recommended for a production environment)`
- Command : `openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj '//CN=localhost' -keyout localhost-private-key.pem -out localhost-cert.pem`
- **Note** : the certificate and the private key are available in the /Config/lib directory

## Run project command
- Start server http1 : `npm run http1`
- Start server http2 : `npm run http2`

## Test your server
You must run this command from the root of the project
- http1 server : `curl --cacert Config/lib/localhost-cert.pem https://localhost:443/api/test`
- http2 server : `curl --cacert Config/lib/localhost-cert.pem https://localhost:3001/api/test`
