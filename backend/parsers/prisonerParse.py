import json

PRISONER_INFO_FILE = "prisoner.csv"

PRISONER_PARSED = "prisoner.json"

with open(PRISONER_INFO_FILE, "r") as prisonerCSVFile:
    prisonerLines = prisonerCSVFile.readlines()

    prisoner = {
        "Release Date": "",
        "Release Type": "",
        "Inmate Type": "",
        "Gender": "",
        "Race": "",
        "Age": "",
        "County": "",
        "Offense Code": "",
        "Offense": "",
        "Offense Description": "",
        "Sentence Date": "",
        "Offense Date": "",
        "Sentence (Years)": "",
    }

    # mapping counties => prisoner objects
    prisonerByCounty : dict[str, dict[str, str]] = {}

    releasedPrisonerByType = {
        "Violent": 0,
        "Property": 0,
        "Other": {
            "DWI": 0,
            "Other": 0,
        },
    }

    # 1st line of prisonerCSV specifies the format as described here
    # Release Date,Release Type,Inmate Type,Gender,Race,Age,County,Offense Code,Offense,Offense Description,Sentence Date,Offense Date,Sentence (Years)

    prisonerLinesIter = iter(prisonerLines)

    # don't need the first line 
    next(prisonerLinesIter)

    for index, inmateLine in enumerate(prisonerLinesIter):
        prisonerAttributesList : list[str] = inmateLine.split(",")

        prisonerAttributeIndex : int = 0

        for attribute in prisoner:
            prisoner[attribute] = prisonerAttributesList[prisonerAttributeIndex]

            prisonerAttributeIndex += 1

        # going to need to modify this, to insert type of crime 
        if not prisonerByCounty.get(prisoner["County"]):
            prisonerByCounty[prisoner["County"]] = {
                "Type": {
                    "Violent": 0, 
                    "Property": 0, 
                    "Other": 0, 
                    "Drug": 0,
                    "Total": 0,
                }
            }

        prisonerCrimeType = prisoner["Offense"]
        if prisoner["County"] not in prisonerByCounty:
            prisonerByCounty[prisoner["County"]]["Type"][prisonerCrimeType] = {
                "Type": {
                    "Violent": 0, 
                    "Property": 0, 
                    "Other": 0, 
                    "Total": 0,
                }
            } 

        prisonerByCounty[prisoner["County"]]["Type"][prisonerCrimeType] += 1 
        prisonerByCounty[prisoner["County"]]["Type"]["Total"] += 1 

    with open(PRISONER_PARSED, "w") as parsedPrisoners:
        parsedJsonStr = json.dumps(prisonerByCounty)
        parsedPrisoners.write(parsedJsonStr)




