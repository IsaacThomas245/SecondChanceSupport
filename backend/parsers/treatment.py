from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

import time

import json

edge_options = webdriver.EdgeOptions()
# disable img loading
edge_options.add_experimental_option(
    "prefs", {"profile.managed_default_content_settings.images": 2}
)

# hides opening browser
edge_options.add_argument("--headless")

driver = webdriver.Edge(options=edge_options)
driver.get("https://findtreatment.gov/locator")

element = WebDriverWait(driver=driver, timeout=5).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "input"))
)

print("successfully waited for input")

stateInput = driver.find_element(By.CSS_SELECTOR, 'input[type="search"]')
stateInput.click()

print("found stateinput: " + stateInput.text)

stateString = "Texas, USA"
stateInput.send_keys(stateString)
time.sleep(5)
# stateInput.send_keys(Keys.ARROW_DOWN)
stateInput.send_keys(Keys.ARROW_DOWN)
stateInput.send_keys(Keys.ENTER)

print("keys have been sent")

time.sleep(5)

# window is too small, need to select sort and filter first before selecting
# state checkbox
sortAndFilter = driver.find_element(By.CSS_SELECTOR, "#mobile-sort-filter-btn")
if sortAndFilter is not None: 
    sortAndFilter.click()
    time.sleep(3)

checkboxTitle = "Limit search to within State of starting location"
STATE_CHECK_BOX_SELECTOR = 'input[title="' + checkboxTitle + '"]'

stateCheckBox = driver.find_element(By.CSS_SELECTOR, STATE_CHECK_BOX_SELECTOR)

print("found state check box")

if not stateCheckBox.is_selected():
    time.sleep(2)
    stateCheckBox.click()
    print("clicked on state check box")

# wait for entries to selected
time.sleep(2)

SELECT_FACILITY = "li.facility-list-item"

# total of 818 facilities / 10 per page equals roughly 82, 
# 83 just in case
MAX_FACILITY_PAGES = 83
NUM_FACILITY_PAGES = MAX_FACILITY_PAGES

allFacilities  = []

facility = {
    "Name": [],  
    "Website": "", 
    "Address": "", 
    "Services": [], 
    "Payment": [], 
    "Type": "", 
    "Phone": "",
}

facilities : dict = {
    "Facilities": []
}

NAME_SELECTOR = "div.row div.px-0_75rem"
TYPE_SELECTOR = "div.card-text.fs-14px.mt-1em"

start_time = time.time()

TYPE_MARKER = "Facility Type:"
PAYMENT_MARKER = "Payment Accepted:"
WEBSITE_MARKER = "http"
SERVICE_MARKER = "Services:"
ADDRESS_MARKER = "TX"
PHONE_MARKER = "-"

print("num facility pages: " + str(NUM_FACILITY_PAGES))
for page in range(0, NUM_FACILITY_PAGES):
    print("running page for loop (x" + str(page) + ")")
    currentFacilities = driver.find_elements(By.CSS_SELECTOR, SELECT_FACILITY)
    allFacilities += currentFacilities
    # allFacilities.extend(currentFacilities)

    time.sleep(5)

    # now we have all the list items of the facilities, need to unwrap them 
    # to extract everything else, such as name and links etc. 
    # print("facilities for loop")
    for currentFacility in currentFacilities:
        # print("facility list item: " + str(currentFacility))
        # websiteLink = facilityListItem.find_element(By.CSS_SELECTOR, )
        # print("contents of facility: " + str(currentFacility.text))
        facilityTextContent : str = currentFacility.text
        facilityTextLines : list[str] = facilityTextContent.splitlines()


        # facilityType = currentFacility.find_element(By.CSS_SELECTOR, TYPE_SELECTOR)
        facilityType : str = ""
        website : str = ""
        address : str = ""
        phone : str = ""
        payments : list[str] = []
        services : list[str] = []

        line: str
        for index, line in enumerate(facilityTextLines):
            colonIndex = line.find(":")
            afterColonText = line[colonIndex + 1:].strip()
            if WEBSITE_MARKER in line: 
                website = line 
            elif ADDRESS_MARKER in line: 
                address = line
            elif SERVICE_MARKER in line:
                services = map(str.strip, afterColonText.split(";")) 
            elif TYPE_MARKER in line:
                facilityType = afterColonText
            elif PAYMENT_MARKER in line:
                payments = map(str.strip, afterColonText.split(";"))
            elif line.find(PHONE_MARKER) != line.rfind(PHONE_MARKER) and line.rfind(PHONE_MARKER) != -1:
                phone = line

        possibleNames : list = currentFacility.find_elements(By.CSS_SELECTOR, NAME_SELECTOR)

        for name in possibleNames:
            facility["Name"].append(name.text)
        
        print("facility Name: " + facility["Name"][0])

        facility["Address"] = address
        # facility["Name"] = name
        facility["Payment"] += payments
        facility["Services"] += services
        facility["Website"] = website
        facility["Phone"] = phone
        facility["Type"] = facilityType.strip()
        # print("facility type: " + facility['Type'])

        facilities["Facilities"].append(facility)

        print("facilities parsed: " + str(len(facilities["Facilities"])))

        facility = {
            "Name": [],  
            "Website": "", 
            "Address": "", 
            "Services": [], 
            "Payment": [], 
            "Type": "", 
            "Phone": "", 
        }

    # finished with page, click to next
    NEXT_BUTTON_LABEL = 'button[aria-label="Navigation button to the next page of listing result"]'
    nextButton = driver.find_element(By.CSS_SELECTOR, NEXT_BUTTON_LABEL)

    nextButton.click()

    time.sleep(5)


print("time taken to parse: " + str(time.time() - start_time))

print("for loop facility in facilities printing")
for facility in facilities:
    print(str(facility))

print("len facilities: " + str(len(facilities)))

print("facilities in json i hope")

treatmentFile = "treatment.json"
with open(treatmentFile, "w") as parsedTreatment: 
    parsedTreatment.write(json.dumps(facilities))

# take the facility website, prune away the /. Then 
# tack on about or about-us, some websites use about rather than about 
# us, 
# for facility in facilities["Facilities"]:
#     facilityWebsite = facilities["Website"]
#     driver.get(facilityWebsite)

# print(json.dumps(facilities))

# for f in facilities["Facilities"]:
#     print(f)