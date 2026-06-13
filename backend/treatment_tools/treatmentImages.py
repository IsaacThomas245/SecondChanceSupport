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

treatments = json.load(open("treatment.json"))

print("num facilities: " + str(len(treatments["Facilities"])))


GOOGLE_MAPS = "https://www.google.com/maps/place/"

TREATMENT_FILENAME = "treatment.json"

# if the script crashes while scrapping, grab the previous index 
# and put it in here 
LEFTOFF_INDEX = 0

# if < 0, then will run on every instance of a facility
# LIMIT = -1

default_img = Image.open("no-img.jpg")

indices_of_default_imgs : list[int] = []

edge_options = webdriver.EdgeOptions()
# disable img loading
edge_options.add_experimental_option(
    "prefs", {"profile.managed_default_content_settings.images": 2}
)

# hides opening browser
edge_options.add_argument("--headless")

driver = webdriver.Edge(options=edge_options)

average_len = 0

with open(TREATMENT_FILENAME, "r") as treatment_file:
    all_treatment_centers = json.load(treatment_file)

    facilities_list : dict = all_treatment_centers["Facilities"]

    facility: dict
    for index, facility in enumerate(facilities_list):
        facility_address : str = facility["Address"]
        address_to_lookup : str = GOOGLE_MAPS + facility_address
        address_to_lookup = address_to_lookup.replace(" ", "+")

        print("idx: " + str(index) + " time: " + str(time.time() - startTime) + 
              " name: " + facility["Name"][0] + " address: " + address_to_lookup)

        # print("address to lookup: " + str(address_to_lookup))
        # print("name of address lookup: " + str(facility["Name"]))
        # print("index: " + str(index))

        driver.get(address_to_lookup)

        facility_img_tag = WebDriverWait(driver=driver, timeout=5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "img[decoding='async']"))
        )

        time.sleep(3)

        facility_img_tag = driver.find_element(By.CSS_SELECTOR, 'img[decoding="async"]')
        img_src : str = facility_img_tag.get_attribute("src")

        # boom, got the src, now download it, grab the size etc.
        img_data = requests.get(img_src).content

        image = Image.open(BytesIO(img_data))        

        # looks like we're gonna need to resize the images 
        # then 
        # TODO use selenium to press the down arrow key, should guarantee
        # the selection is something google maps will recognize
        # img_diff = ImageChops.difference(image, default_img)

        # if img_diff.getbbox():
        #     indices_of_default_imgs.append(index)

        # take img data in bytes => string, have to use b64, special string 
        # encoding to be valid, goal, save this string to database
        base64_encoded_img_data : bytes = base64.b64encode(img_data)

        if img_data == base64_encoded_img_data.decode("ASCII"):
            print("BAD CONVERSION")
            break
            
        # convert b64 bytes encoding to ascii
        facilities_list[index]["b64_img"] = base64_encoded_img_data.decode("ASCII")

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

TREATMENT_WITH_IMAGE_FILENAME = "treatmentImg.json"
with open(TREATMENT_WITH_IMAGE_FILENAME, "w") as treatmentFile:
    json.dump(all_treatment_centers, treatmentFile, indent=4)

print("end time: " + str(time.time() - startTime))

# print("average len: " + str(average_len // LIMIT))

# IMAGES_DIR = "images"
# images_directory = os.chdir(str(os.getcwd()) + "/" + IMAGES_DIR)


# to decode, read in b64, convert ascii to b64, convert to bytes

print("INDICES OF THOSE THAT DEFAULTED")

print("number of defaulted imgs: " + str(len(indices_of_default_imgs)))

for default_index in indices_of_default_imgs:
    print("Name of Default facilitiy: " + str(facilities_list[default_index]["Name"][0]))
    print("Address: " + facilities_list[default_index]["Address"])

# for index, facility in enumerate(facilities_list):
    
