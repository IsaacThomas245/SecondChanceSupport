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

REST_URL = f"{API_BASE}/{USER_ID}/{LOCATION_PARAM}/{RADIUS}/{SORT_COLUMNS}/{SORT_DIRECTIONS}/{START_RECORD}/{LIMIT_RECORD}?enableMetaData={str(ENABLE_META_DATA)}"

print("rest url: " + REST_URL)

headers = {"Authorization": f"Bearer {API_KEY}"}

response = requests.get(REST_URL, headers=headers)
print(response.reason)

with open("reentry.json", "w") as reentryFile:
    json.dump(response.json(), reentryFile, indent=4)

# Above creates all the reentry files


# add county per entry, mapping zip -> county
# do it later maybe