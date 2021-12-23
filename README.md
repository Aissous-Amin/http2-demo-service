# http2-demo-service
HTTP/2 Server with NodeJS and certify it with Let’s Encrypt.


## Generate a self signe certificate with openSSL
openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj '//CN=localhost' -keyout localhost-private-key.pem -out localhost-cert.pem

## Run project command
- Strat server http1 : `npm run http1`
- Start server http2 : `npm run http2`

## Test your server
- http1 server : `curl --location --request GET 'https://localhost:443/api/test`
- http2 server : `curl --location --request GET 'https://localhost:3001/api/test`
