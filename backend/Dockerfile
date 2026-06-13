
FROM python:latest
 
COPY ./requirements.txt .
 
RUN pip install --no-cache-dir -r requirements.txt
 
COPY . .
 
CMD gunicorn -w 2 -b 0.0.0.0:$PORT endpoints:app
 
 