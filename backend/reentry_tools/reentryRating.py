import json
import requests

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

import time

import json
import base64

from PIL import Image
from PIL import ImageChops
from io import BytesIO

startTime = time.time()

treatments = json.load(open("reentry.json"))

print("num facilities: " + str(len(treatments["ReEntryProgramList"])))

default_rating = 0.0

GOOGLE_MAPS = "https://www.google.com/maps/place/"

REENTRY_FILENAME = "reentry.json"

# if the script crashes while scrapping, grab the previous index 
# and put it in here 
LEFTOFF_INDEX = 0

# if < 0, then will run on every instance of a facility
# LIMIT = -1

edge_options = webdriver.EdgeOptions()
edge_options.add_argument("start-maximized")
edge_options.add_argument("--disable-blink-features=AutomationControlled")
edge_options.add_argument("--enable-chrome-browser-cloud-management")

# hides opening browser
#edge_options.add_argument("--headless")

driver = webdriver.Edge(options=edge_options)

average_len = 0

defaulted_indices : list[int] = []

def create_reentry_address(reentry : dict):
    name : str = reentry["Name"] + " "
    address_one : str = reentry["Address1"] + " "
    city : str = reentry["City"] + " "
    state : str = reentry["StateName"] + " "
    zip : str = reentry["Zip"] + " "

    return (name + address_one + city + state + zip).strip()

with open(REENTRY_FILENAME, "r") as reentry_file:
    all_reentry_centers = json.load(reentry_file)

    reentry_list : dict = all_reentry_centers["ReEntryProgramList"]

    reentry: dict
    for index, reentry in enumerate(reentry_list):
        if index < LEFTOFF_INDEX:
            continue 

        reentry_address : str = create_reentry_address(reentry=reentry)

        address_to_lookup : str = reentry_address
        # address_to_lookup = address_to_lookup.replace(" ", "+")

        print("idx: " + str(index) + " time: " + str(time.time() - startTime) + 
            " name: " + reentry["Name"] + " address: " + address_to_lookup)

        # print("address to lookup: " + str(address_to_lookup))
        # print("name of address lookup: " + str(facility["Name"]))
        # print("index: " + str(index))
        try:
            driver.get(GOOGLE_MAPS)
            # find search bar
            search_box_tag = WebDriverWait(driver=driver, timeout=5).until(
                EC.presence_of_element_located((By.ID, "searchboxinput")))
            # find search button
            search_button_tag = WebDriverWait(driver=driver, timeout=5).until(
                EC.presence_of_element_located((By.ID, "searchbox-searchbutton")))

            

            search_box_tag = driver.find_element(By.ID, "searchboxinput")
            search_button_tag = driver.find_element(By.ID, "searchbox-searchbutton")
            # put search query into search bar
            search_box_tag.clear()
            
            search_box_tag.send_keys(address_to_lookup)
            
            #click search button to search
            search_button_tag.click()
            
            time.sleep(3)
            # find rating display on page
            rating_display_tag = WebDriverWait(driver=driver, timeout=30).until(
                EC.presence_of_element_located((By.CLASS_NAME, "fontDisplayLarge")))
            
            rating_display_tag = driver.find_element(By.CLASS_NAME, "fontDisplayLarge")
            rating = float(rating_display_tag.text)
            print("Rating: " + rating)
            reentry_list[index]["rating"] = rating

        except TimeoutException:
            defaulted_indices.append(index)
            print("\nfailed to find rating at " + str(index))
            reentry_list[index]["rating"] = 0.0
        

TREATMENT_WITH_RATING_FILENAME = "reentryRating.json"
with open(TREATMENT_WITH_RATING_FILENAME, "w") as reentry_rating_file:
    json.dump(all_reentry_centers, reentry_rating_file, indent=4)

print("end time: " + str(time.time() - startTime))

print("INDICES OF THOSE THAT DIDNT GET TO RATING")

print("num failed ratings: " + str(len(defaulted_indices)))

for default_index in defaulted_indices:
    print("Name of Default facility: " + str(reentry_list[default_index]["Name"]))