# http2-demo-service
HTTP/2 Server with NodeJS and certify it with Let’s Encrypt.


## Generate a self signe certificate with openSSL
openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj '//CN=localhost' -keyout localhost-private-key.pem -out localhost-cert.pem
