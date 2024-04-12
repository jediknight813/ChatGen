FROM python:3.9

WORKDIR /src

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY api ./api/
COPY common ./common/
COPY .flaskenv ./
COPY .env ./
COPY gunicorn.conf.py .


ENTRYPOINT ["flask", "run", "--host=0.0.0.0"]
