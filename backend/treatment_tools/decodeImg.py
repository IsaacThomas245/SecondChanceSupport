import json

import json
import base64

from PIL import Image
from io import BytesIO

TREATMENT_FILENAME = "treatmentImg.json"

LIMIT = 20

with open(TREATMENT_FILENAME, "r") as treatment_file:
    all_treatment_centers = json.load(treatment_file)

    all_facilities = all_treatment_centers["Facilities"]

    for index, facility in enumerate(all_facilities):
        if index == LIMIT:
            break

        img_ascii = facility["b64_img"]

        # convert ascii to b64 bytes 
        # img_b64_bytes = bytes(img_ascii, "ASCII")

        # convert b64 bytes to regular bytes
        img_bytes = base64.b64decode(img_ascii)

        # then display with pillow
        image_bytes_io = BytesIO(img_bytes)
        image = Image.open(image_bytes_io)        
        image.show()
        image.close()

        facility_address : str = facility["Address"]

