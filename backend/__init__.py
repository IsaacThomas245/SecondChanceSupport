from flask import Flask

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase

import os

from dotenv import load_dotenv

app = Flask(__name__)

# enables cors for all domains on all routes
CORS(app)

class Base(DeclarativeBase):
    pass

load_dotenv("keys.env")

PASSWORD = ""
USERNAME = ""


try:
    PASSWORD = os.environ["DB_PASSWORD"]
    USERNAME = os.environ["DB_USERNAME"]
    print(USERNAME, PASSWORD)
except:
    print("Missing or invalid keys.env")

DIALECT = "postgresql"
HOST = "aws-1-us-west-2.pooler.supabase.com"
PORT = "5432"
DATABASE = "postgres"

DATA_BASE_URI = f"{DIALECT}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
# print("data base uri: " + DATA_BASE_URI)
app.config["SQLALCHEMY_DATABASE_URI"] = DATA_BASE_URI

db = SQLAlchemy(app)

print("Init app worked")
def check_connection():
    from sqlalchemy import text

    # check if the connection is successfully established or not
    with app.app_context():
        try:
            # db.session.execute('SELECT 1')
            db.session.execute(text('SELECT 1'))
            print('\n\n----------- Connection successful !')
        except Exception as e:
            print('\n\n----------- Connection failed ! ERROR : ', e)

check_connection()

