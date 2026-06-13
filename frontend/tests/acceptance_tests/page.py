""" used for locator constants"""
#from locator import HomePageLocators
#from element import BasePageElement

# class SearchTextElement(BasePageElement):
#     locator = "q"

class BasePage():
    """ base page for subclasses made from this """
    def __init__(self, driver):
        self.driver = driver

    #functions to make pylint happy
    def get_page(self):
        """ get page """
        print("a")

    def set_page(self):
        """ set page """
        print("b")

class HomePage(BasePage):
    """ home page made from base page representing splash page """
    #search_text_element = SearchTextElement()

    def is_title_matches(self):
        """ checks if title of website matches expected value """
        return "Second Chance" in self.driver.title

    def click_button(self, button_locator):
        """ clicks button found based on locator """
        element = self.driver.find_element(*button_locator)
        element.click()

# class SearchResultPage(BasePage):

#     def is_result_found(self):
#         return "No Results Found." not in self.driver.page_source
