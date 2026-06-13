# cs373-group-03

## Websites

[Our Website](https://second-chance-support.vercel.app/)

[Backend API](https://secondchancesupport.onrender.com)

[API Documentation](https://documenter.getpostman.com/view/18391024/2sA2r6WPgJ)

[Repository](https://github.com/IsaacThomas245/SecondChanceSupport)

[Developer Website](https://www.unshakablejapan.me/)

> Note: This project was originally developed and deployed via GitLab/Supabase for CS373 at UT Austin. It has since been migrated to GitHub, Vercel, and Render.

## Phase Leaders

**Phase 1:** 
Danny Zheng 
Coordinating and Delegating Tasks.

**Phase 2:** 
Nabil Chowdhury 
Coordinating and Delegating Tasks.

**Phase 3:** 
Isaac Thomas
Coordinating and Delegating Tasks.

**Phase 4:** 
Albert Sun
Coordinating and Delegating Tasks.

## Test Written

| Name | Tests Written | 
| ------ | ------ |
| Danny Zheng |           10              |
| Albert Sun  |           10              |  
| Isaac Thomas |          11               |
| Nabil Chowdhury |       12               | 

## Completion Times
**Phase 1:**
| Name | Estimated Completion Time (hrs) | Actual Time (hrs) |
| ------ | ------ | ------ | 
| Danny Zheng |           10              | 15  | 
| Albert Sun  |           10              |  15 | 
| Isaac Thomas |          10               | 15 | 
| Nabil Chowdhury |       10               | 15 | 


**Phase 2:**
| Name | Estimated Completion Time (hrs) | Actual Time (hrs) |
| ------ | ------ | ------ | 
| Danny Zheng |           10              | 13  | 
| Albert Sun  |           9              |  13 | 
| Isaac Thomas |          10               | 12 | 
| Nabil Chowdhury |       11               | 11 | 

**Phase 3:**
| Name | Estimated Completion Time (hrs) | Actual Time (hrs) |
| ------ | ------ | ------ | 
| Danny Zheng |           11              | 16  | 
| Albert Sun  |           10              |  16 | 
| Isaac Thomas |          10               | 16 | 
| Nabil Chowdhury |       11               | 16 | 

**Phase 4:**
| Name | Estimated Completion Time (hrs) | Actual Time (hrs) |
| ------ | ------ | ------ | 
| Danny Zheng |           20              | 18  | 
| Albert Sun  |           20              |  18 | 
| Isaac Thomas |          20               | 18 | 
| Nabil Chowdhury |       20               | 18 | 

## Canvas/Slack group
Group 03

## Team Members
- Albert Sun
- Danny Zheng
- Isaac Thomas
- Nabil Chowdhury

## Project Name
SecondChance

## Proposed Project

Our project proposal is a website to help people in Texas who were previously convicted of a crime reintergrate with society. We provide statistics to bring awareness to this community, as well as provide lists of re-entry programs and rehabilitation facilities that can be located by proximity.

## Data Sources

- [Re-entry Programs](https://www.careeronestop.org/LocalHelp/EmploymentAndTraining/find-reentry-programs.aspx?location=Texas&radius=25) [(Rest API)](https://www.careeronestop.org/Developers/WebAPI/ReEntryPrograms/list-reentry-program-contacts.aspx)

- [Conviction and Release by County](https://www.tdcj.texas.gov/documents/Statistical_Report_FY2019.pdf) [(JSON Version)](https://data.texas.gov/views/htfi-jkdg/rows.json?accessType=DOWNLOAD)

- [Treatment Facilities](https://findtreatment.gov/locator)

## Models
- Re-entry programs
- Counties
- Rehab centers

## Estimated number of instances per model
- re-entry : 155
- counties in Texas : 254
- rehab : 816

## Attributes per model
- Re-entry:
    - City
    - County
    - Name
    - Hours/Days of Operation
    - Type of office
    - Rating
    - Address
- Counties
    - Name
    - Number of Convicts
    - Number of Ex-Convicts
    - Population
    - Population Rank
    - Number of each Type of Conviction(Drug, Violent, Property, Other)
- Rehab 
    - Name
    - City
    - County
    - Facility Type
    - Types of Payment Accepted
    - Services Provided
    - Address

## Model Connections
- Connected by proximity(counties)

## Media for each model
- re-entry
    - Picture of location
    - Map showing location
- counties
    - Bar graph for multiple stats, (total population, crime type, ex convicts, etc.)
    - Picture of county landmark
- rehab
    - Picture of location
    - Map showing location

## Questions our site answers
- How many ex-convicts are there in Texas by county?
- How can ex-convicts re-enter into society?
- What resources are available for ex-convicts?

## Gitlab SHA for Phase I
- 18a4331789e06a79913830c52ef2df7b2a00205a

## Gitlab SHA for Phase II
- 97b306d70af55eb6de369e852907bc2be92c40a7

## Gitlab SHA for Phase III
- 202f22de0172f614019ddb11a09100e71c60ab52

## Gitlab SHA for Phase IV
- 5f837c0cf194b897b551a144084160a74536d58f
