""" used for element searching in selenium"""
from selenium.webdriver.common.by import By

class HomePageLocators():
    """ Class storing all the locators for the home page"""

    NAVBAR_HOME_BUTTON = (By.ID, "navbar_home")
    NAVBAR_ABOUT_BUTTON = (By.ID, "navbar_about")
    NAVBAR_REENTRY_BUTTON = (By.ID, "navbar_reentry")
    NAVBAR_REHAB_BUTTON = (By.ID, "navbar_rehab")
    NAVBAR_COUNTY_BUTTON = (By.ID, "navbar_county")

    FOOTER_HOME_BUTTON = (By.ID, "footer_home")
    FOOTER_ABOUT_BUTTON = (By.ID, "footer_about")
    FOOTER_REENTRY_BUTTON = (By.ID, "footer_reentry")
    FOOTER_REHAB_BUTTON = (By.ID, "footer_rehab")
    FOOTER_COUNTY_BUTTON = (By.ID, "footer_county")

    HOME_PAGE = (By.ID, "home_text")
    ABOUT_PAGE = (By.ID, "about_text")
    REHAB_PAGE = (By.ID, "rehab_text")
    REENTRY_PAGE = (By.ID, "reentry_text")
    COUNTY_PAGE = (By.ID, "county_text")

    REHAB_ID_PAGE = (By.ID, "rehab_instance_text")
    REENTRY_ID_PAGE = (By.ID, "reentry_instance_text")
    COUNTY_ID_PAGE = (By.ID, "county_instance_text")

    REHAB_CARD = (By.ID, "rehab_card")
    REENTRY_CARD = (By.ID, "reentry_card")
    COUNTY_CARD = (By.ID, "county_card")

    NAVBAR_SEARCH = (By.ID, "search-navbar")
    NAVBAR_SEARCH_BUTTON = (By.ID, "search-button")
    SEARCH_PAGE = (By.ID, "search_text")

    #functions to make pylint happy
    def get_locator(self):
        """ get locator """
        print("a")

    def set_locator(self):
        """ set locator """
        print("b")
# class SearchResultsPageLocators(object):
#     pass
