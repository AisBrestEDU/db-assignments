CD ../..
docker build -f environments/mongodb/Dockerfile -t mongoenv .
docker run -it -d -p 27017:27017 --name mongodb-trainee mongoenv
CD environments/mongodb