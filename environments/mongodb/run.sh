docker build . -t mongoenv
docker run mongoenv -p 27017:27017 --name mongodb-trainee