import json
import requests

from selenium import webdriver
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

default_img = Image.open("no-img.jpg")

GOOGLE_MAPS = "https://www.google.com/maps/place/"

REENTRY_FILENAME = "reentry.json"

# if the script crashes while scrapping, grab the previous index 
# and put it in here 
LEFTOFF_INDEX = 0

# if < 0, then will run on every instance of a facility
# LIMIT = -1

edge_options = webdriver.EdgeOptions()
# disable img loading
edge_options.add_experimental_option(
    "prefs", {"profile.managed_default_content_settings.images": 2}
)

# hides opening browser
edge_options.add_argument("--headless")

driver = webdriver.Edge(options=edge_options)

average_len = 0

defaulted_indices : list[int] = []

def create_reentry_address(reentry : dict):
    address_one : str = reentry["Address1"] + " "
    # address_two : str = reentry["Address2"] + " "
    city : str = reentry["City"] + " "
    state : str = reentry["StateName"] + " "
    zip : str = reentry["Zip"] + " "

    return (address_one + city + state + zip).strip()

with open(REENTRY_FILENAME, "r") as reentry_file:
    all_reentry_centers = json.load(reentry_file)

    reentry_list : dict = all_reentry_centers["ReEntryProgramList"]

    reentry: dict
    for index, reentry in enumerate(reentry_list):
        if index < LEFTOFF_INDEX:
            continue 

        reentry_address : str = create_reentry_address(reentry=reentry)

        address_to_lookup : str = GOOGLE_MAPS + reentry_address
        address_to_lookup = address_to_lookup.replace(" ", "+")

        print("idx: " + str(index) + " time: " + str(time.time() - startTime) + 
              " name: " + reentry["Name"] + " address: " + address_to_lookup)

        # print("address to lookup: " + str(address_to_lookup))
        # print("name of address lookup: " + str(facility["Name"]))
        # print("index: " + str(index))

        driver.get(address_to_lookup)

        facility_img_tag = WebDriverWait(driver=driver, timeout=10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "img[decoding='async']"))
        )

        time.sleep(3)

        facility_img_tag = driver.find_element(By.CSS_SELECTOR, 'img[decoding="async"]')
        img_src : str = facility_img_tag.get_attribute("src")

        # boom, got the src, now download it, grab the size etc.
        img_data = requests.get(img_src).content

        image = Image.open(BytesIO(img_data))        

        img_diff = ImageChops.difference(default_img, image)

        if img_diff.getbbox():
            defaulted_indices.append(index)

        # take img data in bytes => string, have to use b64, special string 
        # encoding to be valid, goal, save this string to database
        base64_encoded_img_data : bytes = base64.b64encode(img_data)

        if img_data == base64_encoded_img_data.decode("ASCII"):
            print("BAD CONVERSION")
            break
            
        # convert b64 bytes encoding to ascii
        reentry_list[index]["b64_img"] = base64_encoded_img_data.decode("ASCII")

        # choosing ascii over utf-8, less bits needed to encode data
        average_len += len(base64_encoded_img_data.decode("ASCII"))

        # with open("image1.jpeg", "wb") as imageFile: 
        #     imageFile.write(img_data)


        # TODO: Need to scale the img down such that the aspect ration is perserved
        # and 8k character limit of the resulting string isn't violated. 
        # for scaling, use PIL. 
        # Actually, don't need this, supabase's text type is unlimited, 
        # can just post stuff there

        # if index >= LIMIT:
        #     break

TREATMENT_WITH_IMAGE_FILENAME = "reentryImg.json"
with open(TREATMENT_WITH_IMAGE_FILENAME, "w") as reentry_img_file:
    json.dump(all_reentry_centers, reentry_img_file, indent=4)

print("end time: " + str(time.time() - startTime))

# print("average len: " + str(average_len // LIMIT))

# IMAGES_DIR = "images"
# images_directory = os.chdir(str(os.getcwd()) + "/" + IMAGES_DIR)


# to decode, read in b64, convert ascii to b64, convert to bytes

print("INDICES OF THOSE THAT DEFAULTED")

print("num defaulted imgs: " + str(len(defaulted_indices)))

for default_index in defaulted_indices:
    print("Name of Default facilitiy: " + str(reentry_list[default_index]["Name"]))
    print("Address: " + defaulted_indices[default_index]["Address"])



