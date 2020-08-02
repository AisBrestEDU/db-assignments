docker build . -t mysqlenv
docker run mysqlenv -p 3306:3306 --name mysql-trainee