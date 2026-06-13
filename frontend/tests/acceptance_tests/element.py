""" used for element searching in selenium """
from selenium.webdriver.support.ui import WebDriverWait

class BasePageElement():
    """ base page object to use for subclasses """
    def __init__(self, locator):
        self.locator = locator

    def __set__(self, obj, value):
        driver = obj.driver
        WebDriverWait(driver, 100).until(
            lambda driver: driver.find_element("name", self.locator))
        driver.find_element("name", self.locator).clear()
        driver.find_element("name", self.locator).send_keys(value)

    def __get__(self, obj, owner):
        driver = obj.driver
        WebDriverWait(driver, 100).until(
            lambda driver: driver.find_element("name", self.locator))
        element = driver.find_element("name", self.locator)
        return element.get_attribute("value")

# search_text_element = "hello"   <- set
# x = search_text_element         <- get
