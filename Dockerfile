FROM mysql:5.7
COPY ./northwind.sql /docker-entrypoint-initdb.d/northwind.sql
