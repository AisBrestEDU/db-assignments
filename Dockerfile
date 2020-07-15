FROM mysql:8.0
COPY ./northwind.sql /docker-entrypoint-initdb.d/northwind.sql
