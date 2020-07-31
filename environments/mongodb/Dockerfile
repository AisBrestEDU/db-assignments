FROM mongo:4.2.8
COPY dumps/awesomedb_mongodb/ /dumps/
COPY dumps/northwind_mongodb/ /dumps/
COPY environments/mongodb/docker-setup.sh /docker-entrypoint-initdb.d/setup.sh
