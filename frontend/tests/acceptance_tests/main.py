"""imports for unit testing and selenium using chrome web driver"""
import unittest
from selenium import webdriver
import page
import locator
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# class PythonOrgSearch(unittest.TestCase):
#     def setUp(self):
#         self.driver = webdriver.Chrome()
#         self.driver.get("http://www.python.org")

#     def test_search_python(self):
#         homePage = page.HomePage(self.driver)
#         assert homePage.is_title_matches()
#         homePage.search_text_element = "pycon"
#         homePage.click_go_button()
#         search_result_page = page.SearchResultPage(self.driver)
#         assert search_result_page.is_result_found()

#     def tearDown(self):
#         self.driver.close()

class SecondChance(unittest.TestCase):
    """unit tests for website"""
    def setUp(self):
        options = Options()
        """ start: uncomment this to hide Chrome window that pops up as each test runs, comment to show """
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument("--disable-gpu")
        options.add_argument('--disable-dev-shm-usage')
        """end: of comment/uncomment area"""
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.driver.get("http://www.secondchancesupport.me")
        self.driver.maximize_window()
        self.driver.implicitly_wait(10)

    def test_title(self):
        """test if title matches expected value on website"""
        home_page = page.HomePage(self.driver)
        assert home_page.is_title_matches()

    def test_nbb_about(self):
        """test if navbar about button redirects to about page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.NAVBAR_ABOUT_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.ABOUT_PAGE)

    def test_nbb_reentry(self):
        """test if navbar reentry button redirects to reentry page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.NAVBAR_REENTRY_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REENTRY_PAGE)

    def test_nbb_rehab(self):
        """test if navbar rehab button redirects to rehab page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.NAVBAR_REHAB_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REHAB_PAGE)
    
    def test_nbb_county(self):
        """test if navbar county button redirects to county page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.NAVBAR_COUNTY_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.COUNTY_PAGE)

    def test_nbb_home(self):
        """test if navbar home button redirects to home page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.NAVBAR_HOME_BUTTON
        home_page.click_button(locator.HomePageLocators.NAVBAR_COUNTY_BUTTON)
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.HOME_PAGE)

    def test_foot_about(self):
        """test if footer about button redirects to about page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.FOOTER_ABOUT_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.ABOUT_PAGE)

    def test_foot_reentry(self):
        """test if footer reentry button redirects to reentry page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.FOOTER_REENTRY_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REENTRY_PAGE)

    def test_foot_rehab(self):
        """test if footer rehab button redirects to rehab page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.FOOTER_REHAB_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REHAB_PAGE)
    
    def test_foot_county(self):
        """test if footer county button redirects to county page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.FOOTER_COUNTY_BUTTON
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.COUNTY_PAGE)

    def test_foot_home(self):
        """test if footer home button redirects to home page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.FOOTER_HOME_BUTTON
        home_page.click_button(locator.HomePageLocators.FOOTER_COUNTY_BUTTON)
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.HOME_PAGE)

    def test_county_instance(self):
        """test if clicking a county instance redirects to county instance page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.COUNTY_CARD
        home_page.click_button(locator.HomePageLocators.FOOTER_COUNTY_BUTTON)
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.COUNTY_ID_PAGE)
    
    def test_rehab_instance(self):
        """test if clicking a rehab instance redirects to rehab instance page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.REHAB_CARD
        home_page.click_button(locator.HomePageLocators.FOOTER_REHAB_BUTTON)
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REHAB_ID_PAGE)
    
    def test_reentry_instance(self):
        """test if clicking a reentry instance redirects to reentry instance page"""
        home_page = page.HomePage(self.driver)
        button_locator = locator.HomePageLocators.REENTRY_CARD
        home_page.click_button(locator.HomePageLocators.FOOTER_REENTRY_BUTTON)
        home_page.click_button(button_locator)
        assert self.driver.find_element(*locator.HomePageLocators.REENTRY_ID_PAGE)
    
    def test_global_search_click(self):
        """test if clicking a reentry instance redirects to reentry instance page"""
        home_page = page.HomePage(self.driver)
        search_box_tag = WebDriverWait(driver=self.driver, timeout=5).until(
            EC.presence_of_element_located(locator.HomePageLocators.NAVBAR_SEARCH))
        # find search button
        search_button_tag = WebDriverWait(driver=self.driver, timeout=5).until(
            EC.presence_of_element_located(locator.HomePageLocators.NAVBAR_SEARCH_BUTTON))

        search_box_tag = self.driver.find_element(*locator.HomePageLocators.NAVBAR_SEARCH)
        search_button_tag = self.driver.find_element(*locator.HomePageLocators.NAVBAR_SEARCH_BUTTON)
        # put search query into search bar
        search_box_tag.clear()
            
        search_box_tag.send_keys("Tyler")
            
        #click search button to search
        search_button_tag.click()

        assert self.driver.find_element(*locator.HomePageLocators.SEARCH_PAGE)

    

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
