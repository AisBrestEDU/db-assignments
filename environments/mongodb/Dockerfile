FROM mongo:4.2.8
RUN apt-get install -y unzip
RUN unzip dumps/awesomedb_mongodb/awesomedb.zip
COPY dumps/awesomedb_mongodb/awesomedb/ /dumps/awesomedb/
COPY dumps/northwind_mongodb/ /dumps/
COPY environments/mongodb/docker-setup.sh /docker-entrypoint-initdb.d/setup.sh
