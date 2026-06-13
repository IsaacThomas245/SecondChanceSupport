import requests
import json

API_KEY = "JLn5g8AIdXVa9/W1KRbmH0aSE0RBoNX19fcTMt73kn251kCAXLsauo0GdVoL0u6nJO9KxwHKBL6R8cb5DAHgyA=="

USER_ID = "MlJwKosiV3reKuk"
API_BASE = "https://api.careeronestop.org/v1/reentryprogramfinder"

LOCATION_PARAM = "texas"
RADIUS = "0" 
SORT_COLUMNS = "Location" 
SORT_DIRECTIONS = "DESC" # ascending, or DESC (descending)
START_RECORD = 0 
LIMIT_RECORD = 200
ENABLE_META_DATA = False

# radius / sortColumns / sortDirections / startRecord / limitRecord / enable Meta data

# /25/0/0/0/10?enableMetaData=true

# "https://api.careeronestop.org/v1/reentryprogramfinder/MlJwKosiV3reKuk/texas/0/location/2/0/10?enableMetaData=true"

REST_URL = f"{API_BASE}/{USER_ID}/{LOCATION_PARAM}/{RADIUS}/{SORT_COLUMNS}/{SORT_DIRECTIONS}/{START_RECORD}/{LIMIT_RECORD}?enableMetaData={str(ENABLE_META_DATA)}"

print("rest url: " + REST_URL)

# https://api.careeronestop.org/v1/reentryprogramfinder/MlJwKosiV3reKuk/texas/0/location/2/0/10?enableMetaData=true

# https://api.careeronestop.org/v1/ajcfinder/{userId}/{location}/{radius}/{centerType}/{youthServices}/{workersServices}/{businessServices}/{sortColumns}/{sortDirections}/{startRecord}/{limitRecord}
headers = {"Authorization": f"Bearer {API_KEY}"}

response = requests.get(REST_URL, headers=headers)
print(response.reason)

# print(response.json())

with open("reentry.json", "w") as reentryFile:
    # reentryFile.write(json.dump(response.json()))
    json.dump(response.json(), reentryFile, indent=4)
    # reentryFile.write(response.json())
    # reentryFile.write(str(response.json())) 
