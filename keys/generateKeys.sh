openssl genrsa -out serverkey.pem 2048
openssl req -new -sha256 -key serverkey.pem -out servercsr.pem
openssl x509 -req -in servercsr.pem -signkey serverkey.pem -out servercert.pem