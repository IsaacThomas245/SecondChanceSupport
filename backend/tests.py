import unittest
import json
from endpoints import app, table_to_json, table_to_list, generate_distance_string


class TestUtils(unittest.TestCase):
    def test_table_to_json_single_row(self):
        result = [[1, 'test name']]
        colNames = ['id', 'name']
        expected = {'id': 1, 'name': 'test name'}
        self.assertEqual(table_to_json(result, colNames), expected)

    def test_table_to_json_multiple_rows(self):
        result = [[1, 'test name'], [2, 'another name']]
        colNames = ['id', 'name']
        expected = [{'id': 1, 'name': 'test name'}, {'id': 2, 'name': 'another name'}]
        self.assertEqual(table_to_json(result, colNames), expected)

    def test_table_to_list(self):
        result = [[1, 'test name']]
        colNames = ['id', 'name']
        expected = [{'id': 1, 'name': 'test name'}]
        actual = table_to_list(result, colNames)
        self.assertEqual(actual, expected)

    def test_generate_distance_string(self):
        expected = "select * from tableName order by (latitude - 1.0) * (latitude - 1.0) + (longitude - 2.0) * (longitude - 2.0) limit 10"
        expectedTokens = expected.split(" ")
        
        actual = generate_distance_string("tableName", 1.0, 2.0, 10).strip()
        actualTokens = actual.split(" ")

        # Construct list of tokens, len(token) > 0
        actualTokens = [token for token in actualTokens if len(token) > 0]

        self.assertListEqual(expectedTokens, actualTokens)

class FlaskRoutesTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_all_rehabs(self):
        response = self.app.get('/api/v1/rehabs')
        self.assertEqual(response.status_code, 200)
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')
        self.assertEqual(len(data), 721)
    

    def test_get_specific_rehab(self):
        response = self.app.get('/api/v1/rehab/1')
        self.assertEqual(response.status_code, 200)
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')
        self.assertIsNotNone(data, "The response data should not be None")
        self.assertIn('name', data)
        self.assertEqual(data["name"], "West Texas Centers Runnels County")
        self.assertIn('address', data) 
    
    def test_get_specific_reentry(self):
        response = self.app.get('/api/v1/reentry/1')
        self.assertEqual(response.status_code, 200)
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')
        self.assertIsNotNone(data, "The response data should not be None")
        self.assertIn('name', data)
        self.assertEqual(data["name"], "Workforce Solutions - Zapata")
        self.assertIn('address1', data)
    
    def test_get_specific_county(self):
        response = self.app.get('/api/v1/county/1')
        self.assertEqual(response.status_code, 200)
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')
        self.assertIsNotNone(data, "The response data should not be None")
        self.assertIn('typeviolent', data)
        self.assertEqual(data["typeviolent"], 53)
        self.assertIn('img_src', data)

    def test_get_reentries_with_pagination(self):
        response = self.app.get('/api/v1/reentries?page=1')
        
        self.assertEqual(response.status_code, 200)
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')

        self.assertIsInstance(data, dict, "The response should be a dictionary")
        self.assertEqual(data["total"], 155)
        self.assertEqual(data["totalPages"], 8)
        
    def test_test2_endpoint(self):
        test_string = "hey"
        response = self.app.get(f'/test2/{test_string}')
        self.assertEqual(response.status_code, 200)
        expected_response = f"test endpoint: {test_string} Seeing if taking params works."
        self.assertEqual(response.data.decode('utf-8'), expected_response)
    
    def test_search_rehab(self): 
        page_param = 1
        query_param = "tr"
        payments_param = "Medicare," + "Federal%20Grants"
        services_param = "Substance use treatment"
        response = self.app.get(f'/api/v1/search?model=rehab&page={page_param}&query={query_param}&payment={payments_param}&services={services_param}')
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')

        print(f'/api/v1/search?model=rehab&page={page_param}&query={query_param}&payment={payments_param}&services={services_param}')

        self.assertEqual(data["total"], 16)
    
    def test_search_reentry(self):
        page_param = 1
        query_param = "tr"
        rating_param = "2,3.3"
        response = self.app.get(f'/api/v1/search?model=reentry&page={page_param}&query={query_param}&rating={rating_param}')
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')

        print(f'/api/v1/search?model=reentry&page={page_param}&query={query_param}&rating={rating_param}')
        
        self.assertEqual(data["total"], 9) 

    def test_search_county(self): 
        query_param = "tr"
        rank_param = "2,5"
        typedrug_param = "2,100"
        typeother_param = "20,40"
        page_param = "1"
        response = self.app.get(f'/api/v1/search?model=county&page={page_param}&query={query_param}&pop_rank={rank_param}&typedrug={typedrug_param}&typeother={typeother_param}')
        try:
            data = json.loads(response.data)
        except json.JSONDecodeError as e:
            self.fail(f'Invalid JSON: {e}')

        self.assertEqual(data["total"], 2)

if __name__ == "__main__":
    unittest.main()
