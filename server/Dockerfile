FROM python:3.9

WORKDIR /src

COPY requirements.txt ./
RUN pip3 install -r requirements.txt
RUN apt update
RUN apt-get install -y certbot
RUN apt-get install letsencrypt

COPY ./certs/ ./certs/
COPY api ./api/
COPY common ./common/
COPY .flaskenv ./
COPY .env ./
COPY gunicorn.conf.py .


ENTRYPOINT ["flask", "run", "--host=0.0.0.0", "--cert=/src/certs/cert.pem", "--key=/src/certs/privkey.pem"]
