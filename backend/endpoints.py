import json
import math
import re

from requests import Request

from sqlalchemy.sql import text
from sqlalchemy.sql import _typing
from sqlalchemy.sql import desc
from sqlalchemy.sql import and_, or_
from sqlalchemy.sql import cast
from sqlalchemy import String


from flask import request

from __init__ import db, app

from models import Reentry, Rehab, County

RESULTS_PER_PAGE: int = 20


def table_to_json(records, col_names) -> list[dict]:
    """
    Given an iterable type of records, and col_names, create a list of dictionaries
    where each field is specified by a column name from col_names and the value
    coming from records.

    :param records: iterable of an iterable contaienr, storing an iterable
    of a record, each record contains data corresponding to col_names.

    :type records: iterable

    :param col_names: iterable, iterations gives column names. RMKeyView
    :type col_names: iterable

    :return: a list of dictionaries with fields being column names, and values
    coming from records.
    :rtype: list[dict]
    """
    result: list[dict] = []
    for record in records:
        cur: dict = {}

        # fill out dictionary with data from record and
        # field name from col_names
        for col_data, column in zip(record, col_names):
            cur[column] = col_data
        result.append(cur)

    if len(result) == 1:
        return result[0]

    return result


def table_to_list(records, col_names) -> list[dict]:
    """
    Given an iterable type of records, and col_names, create a list of dictionaries
    where each field is specified by a column name from col_names and the value
    coming from records. Only difference between this and tableToJson is if
    len(ret) == 0, still return the entire array, instead of ret[0].

    :param records: iterable of an iterable contaienr, storing an iterable
    of a record, each record contains data corresponding to col_names
    :type records: iterable

    :param col_names: iterable, iterations gives column names
    :type col_names: iterable

    :return: a list of dictionaries with fields being column names, and values
    coming from records
    :rtype: list[dict]
    """
    ret: list[dict] = []
    for record in records:
        cur = {}
        for col_data, column in zip(record, col_names):
            cur[column] = col_data
        ret.append(cur)
    return ret


def generate_distance_string(
    table_name: str, lat: float, long: float, limit: int
) -> str:
    """
    Return SQL String that returns limit number of instances from tableName
    based on closeness to given lat and long.

    :param tableName: Table to grab related instances
    :type tableName: str

    :param lat: latitude to find closest instances
    :type lat: float

    :param long: longitude to find closest instances
    :type long: float

    :return: SQL Select to grab LIMIT instances from tableName with
    closest latittude and longitude
    :rtype: str
    """
    return f"select * from {table_name} \
        order by \
        (latitude - {lat}) * (latitude - {lat}) + (longitude - {long}) * (longitude - {long})\
        limit {limit}"


def get_related_instances(
    latitude: float, longitude: float, current_category: str
) -> list[dict]:
    """
    Given an instance's category, latittude, longitude, return a list of
    instances in other categories related to current instance.

    :param latitude: latitude of current instance
    :type latitude: float

    :param longitude: longitude of current instance
    :type longitude: float

    :param currentCategory: category of current instance
    :type currentCategory: str

    :return: list of dictionaries, representing related instances
    :rtype: list[dict]
    """

    category_to_related: dict[str, list[str]] = {
        "county": ["rehab", "reentry"],
        "rehab": ["reentry", "county"],
        "reentry": ["rehab", "county"],
    }

    all_related_instances: list[dict] = []

    NUM_RELATED_INSTANCES = 3

    related_table: str
    for related_table in category_to_related[current_category]:
        print("related table: " + related_table)

        # Ger related instances of related_table based on closeness
        related_instances = db.session.execute(
            text(
                generate_distance_string(
                    related_table, latitude, longitude, NUM_RELATED_INSTANCES
                )
            )
        )

        related_instance_cols = related_instances.keys()
        related: dict = table_to_json(related_instances, related_instance_cols)

        instance: dict
        for instance in related:
            instance["instance_type"] = related_table
            all_related_instances.append(instance)

    return all_related_instances


def get_page(parsed_json: dict, page_number: int) -> dict[str]:
    """
    Given all instances of a category, and a page_number, return a dictionary
    describing the total number of pages, total number of instances, the
    current page number, and RESULTS_PER_PAGE number of instances in result field.

    :param parsed_json: dictionary of all instances
    :type currentCategory: str

    :param page_number: the page_number, gives number of instances for api user
    :type page_number: int

    :return: dictionary with total number of instances in 'total', total number
    of pages in 'totalPages', and the truncated number of instances in 'results'
    :rtype: dict
    """
    # print("page number: " + page_number)
    if page_number == -1:
        return parsed_json
    
    result: dict = {}

    print("get_page, total: " + str(len(parsed_json)))

    result["total"] = len(parsed_json)
    result["totalPages"] = math.ceil(len(parsed_json) / RESULTS_PER_PAGE)
    result["results"] = parsed_json[
        RESULTS_PER_PAGE * (page_number - 1) : (page_number) * RESULTS_PER_PAGE
    ]
    result["page"] = page_number

    return result


@app.route("/")
def home() -> str:
    """
    Says hello.

    :return: Returns a greeting.
    :rtype: str
    """
    return "url map of backend: " + str(app.url_map)
    # return "Hello I Am Here! Testing backend"


@app.route("/api/v1/rehab/<id>")
def rehab(id: str) -> str:
    """
    Endpoint for rehab. Given an id, return a rehab center and its related
    instances based on latitude and longitude.

    :param id: Given an id, return rehab center and related instances.
    :type id: Given as string, should always be an positive, greater than zero
    integer.

    :return: Rehab center and related instances as JSON.
    :rtype: JSON.

    """

    result = db.session.execute(text("select * from rehab where id=" + id))
    col_names = result.keys()
    ret = table_to_json(result, col_names)

    if len(ret) == 0:
        return "Rehab with id " + id + " not found"

    # TODO: add try catches so server does not crash
    county_lat: float = ret["latitude"]
    county_long: float = ret["longitude"]
    ret["related"] = get_related_instances(county_lat, county_long, "rehab")
    return json.dumps(ret)


@app.route("/api/v1/rehabs")
def rehabs() -> str:
    """
    Endpoint for rehabs. Returns all rehab centers and its related
    instances based on latitude and longitude in JSON.

    :param page: URL Query parameter, specifies which page of instances
    to get.
    :type page: Given as str, should always be a postive integer.

    :return: All rehab centers.
    :rtype: JSON

    """
    page_arg: str = request.args.get("page")

    # get all if no page param specified
    if not page_arg:
        records = db.session.execute(text("select * from rehab"))
        col_names = records.keys()
        parse = table_to_json(records, col_names)
        return json.dumps(parse)

    try: 
        page_number: int = int(page_arg)
    except ValueError: 
        return "Invalid Page Number, Not an Integer"

    start: int = RESULTS_PER_PAGE * (page_number)

    if start < 0:
        return "Page Number is not a postive integer"

    end: int = (page_number + 1) * RESULTS_PER_PAGE

    # massive amount of instances, select rehabs with ids starting
    # at start, and ending at end.
    # TODO: Refactor, like counties endpoint
    records = db.session.execute(
        # text(f"select * from rehab where id > {str(start)} and id <= {str(end)}")
        text("select * from rehab where id > " + str(start) + " and id <= " + str(end))
    )
    col_names = records.keys()
    result: dict[str] = {}
    # since value doesnt change i guess we can hardcode it?
    result["total"] = 721
    result["totalPages"] = math.ceil(721 / RESULTS_PER_PAGE)
    result["results"] = table_to_list(records, col_names)
    result["page"] = page_number
    return json.dumps(result)


@app.route("/api/v1/reentry/<id>")
def reentry(id: str) -> str:
    """
    Endpoint for reentry. Given an id, return a reentry center and its related
    instances based on latitude and longitude.

    :param id: Id of reentry center to get.
    :type id: str

    :return: JSON of the reentry center and related instances.
    :rtype: JSON.

    """
    records = db.session.execute(text("select * from reentry where id=" + id))
    col_names = records.keys()
    result = table_to_json(records, col_names)

    # number of returned records is 0.
    if len(result) == 0:
        return "Reentry with id " + id + " not found"

    # TODO: add try catches so server does not crash
    county_lat = result["latitude"]
    county_long = result["longitude"]
    result["related"] = get_related_instances(county_lat, county_long, "reentry")
    return json.dumps(result)


@app.route("/api/v1/reentries")
def reentries() -> str:
    """
    Endpoint for reentries. Return all reentry centers and its related
    instances based on latitude and longitude.

    :param page: URL Query parameter, specifies which page of instances
    to get.
    :type page: int

    :return:
    :rtype:

    """
    page_arg: str = request.args.get("page")
    result = db.session.execute(text("select * from reentry"))
    col_names = result.keys()
    parsed_result = table_to_json(result, col_names)

    # print("parsed result: " + str(parsed_result))

    # Default, get all reentries
    if not page_arg:
        return json.dumps(parsed_result)

    try:
        page_number: int = int(page_arg)
    except TypeError:
        return "Page Number isn't a positive integer"

    if page_number < 0:
        return "Page Number isn't a positive integer"


    return json.dumps(get_page(parsed_result, page_number))


@app.route("/api/v1/county/<id>")
def county(id: str) -> str:
    """
    Endpoint for county. Given an id, return a county and its related
    instances based on latitude and longitude.

    :param id: ID of county instance to get, along with its related
    instances.
    :type id: str

    :return: JSON of county and its related instances.
    :rtype: JSON
    """
    records = db.session.execute(text("select * from county where id=" + id))
    col_names = records.keys()
    ret = table_to_json(records, col_names)

    if len(ret) == 0:
        return "County with id " + id + " not found"

    # TODO: add try catches so server does not crash
    county_lat = ret["latitude"]
    county_long = ret["longitude"]
    ret["related"] = get_related_instances(county_lat, county_long, "county")
    return json.dumps(ret)


@app.route("/api/v1/counties")
def counties() -> str:
    """
    Endpoint for rehab. Given an id, return a rehab center and its related
    instances based on latitude and longitude.

    :param id: Query parameter, specifies the page to get instances from.
    :type id: int

    :return: return all counties if query parameters (starting with ?) isn't
    specified, otherwise, returns a page full of county instances.
    :rtype: JSON.

    """
    page_arg: str = request.args.get("page")
    records = db.session.execute(text("select * from county"))
    col_names = records.keys()
    parsed_result = table_to_json(records, col_names)

    # Default, get all reentries
    if not page_arg:
        return json.dumps(parsed_result)

    try:
        page_number: int = int(page_arg)
    except TypeError:
        return "Page Number an integer"

    if page_number < 0:
        return "Page Number isn't a positive integer"


    return json.dumps(get_page(parsed_result, page_number))

def query_results_to_json(query_results, model):
    model_columns = [record_col for record_col in model.__table__.columns.keys()]

    # Grab all model's records from db
    # MODEL SHOULD BE A CLASS NAME CORRESPONDING TO SQLALCHEMY CLASS
    json_result : list[dict[str, str]] = []

    for record in query_results:
        record_entry = {}

        # take instance variable from rehab and translate it to 
        # a dictionary (rehab_entry)
        # model columns are the names of model's instance variables
        for record_col in model_columns:
            # print("query_results, record_col: " + record_col)
            record_entry[record_col] = getattr(record, record_col)

        json_result.append(record_entry)

    return json_result

# Takes in a model class, loops through the model classes instance variable names
# collects them in list, queries db for table of the model, converts 
# each db record's columns and values into json and returns
def query_all_instances_to_json(model):
    return query_results_to_json(model.query.all(), model)

def get_search_args(request_args, search_cols): 
    # search_cols : list[str] = ["name", "address1", "city"]
    search_params: dict[str, str] = {}

    # if search is requested, add to things to search
    for search_col in search_cols: 
        if request_args.get(search_col) is not None: 
            search_params[search_col] = request.args.get(search_col)

    return search_params

def get_range_args(request_args, range_cols): 
    range_filters : dict[str, str] = {}

    for range_col in range_cols: 
        # print("in get range args, range col: " + range_col)
        if request_args.get(range_col) is not None: 
            if len(request_args.get(range_col).split(",")) <= 1: 
                return None

            lower_range = request_args.get(range_col).split(",")[0]
            upper_range = request_args.get(range_col).split(",")[1]
            range_filters[range_col] = [lower_range, upper_range]
            # print("lower range")
    
    return range_filters

# each range should contain this [lower_range, upper_range], inclusive
def query_add_range_filter(model_query, model_class, range_filters): 
    for range_filter_column, ranges in range_filters.items(): 
        # ranges[0] is lower, ranges[1] is upper, 
        # ranges[0] can be equal to ranges[1]
        # print("range filter column: " + range_filter_column)
        # print("in query add range filter, ranges[0]: " + ranges[0] + ". ranges[1]: " + ranges[1])
        model_query = model_query.filter(and_(getattr(model_class, range_filter_column) >= ranges[0], 
                                                getattr(model_class, range_filter_column) <= ranges[1]))

    return model_query

# sorts by name, can take None, "asc", "desc"
def add_search_queries(model, model_query, columns_to_exclude, 
                       words_to_search, sort): 
    # https://stackoverflow.com/questions/3332991/sqlalchemy-filter-multiple-columns            
    # use the answer with 6 updoots
    # Example: "hello you"
    # hello you => AND(
    #   or(col1, col2, etc., hello) 
    #   or(col1, col2, etc.., you)
    # )
    columns_to_search = []
    # go through the columns, cast to str
    for column in model.__table__.columns.keys(): 
        if column not in columns_to_exclude: 
            columns_to_search.append(cast(getattr(model, column), String))

    def build_columns_query(word_to_search): 
        return [column.ilike(f"%{word_to_search}%") for column in columns_to_search]

    word_search = []
    for word_to_search in words_to_search: 
        query_all_columns = build_columns_query(word_to_search)
        word_search.append(or_(*query_all_columns)) 
    
    model_query = model_query.filter(and_(*word_search))

    if sort != None: 
        if sort == "asc": 
            # TODO: dislike using hardcoded value of name
            model_query = model_query.order_by(text("name"))
        elif sort == "desc": 
            model_query = model_query.order_by(text("name desc"))

    return model_query



@app.route("/api/v1/s_test")
def s_tests():
    return Rehab.__table__.columns.keys()

# Add filters specific to rehab model, returns query 
# with these filters
def add_rehab_filters(request: Request): 
    multi_arg_filter_params: dict[str, list[str]] = {}

    filters: dict[str, list[str]] = {}
    # type is mutually exclusive, only one type allowed
    if request.args.get("type") is not None: 
        # not possible to have more than one type
        filters["type"] = request.args.get("type")

    # accumulate all payments into one string
    if request.args.get("payment") != None: 
        payment_search_args : list[str] = []
        for payment_value in request.args.get("payment").split(","):
            payment_search_args.append(payment_value)
        
        multi_arg_filter_params["cumulated_payments"] = payment_search_args
        
    # accumulate all services into one string
    if request.args.get("services") != None: 
        service_search_args : list[str] = []

        for service_value in request.args.get("services").split(","):
            service_search_args.append(service_value)

        multi_arg_filter_params["cumulated_services"] = service_search_args
    
    words_to_search : list[str] = []
    
    if request.args.get("query") != None: 
        words_to_search = request.args.get("query").split(",")
    
    # print("request args: " + str(request.args))

    rehab_query = db.session.query(Rehab)

    # no filters, just wants all the model instances
    if len(words_to_search) + len(filters) + len(multi_arg_filter_params) == 0: 
        # print("words to search is 0")
        return rehab_query

    sort = request.args.get("sort")

    columns_to_exclude = ["b64_img", "latitude", "longitude", "id"]
    rehab_query = add_search_queries(Rehab, rehab_query, columns_to_exclude,
                                        words_to_search, sort)

    # apply each filter from filters onto the class query
    # https://stackoverflow.com/questions/41305129/sqlalchemy-dynamic-filtering
    for filter_key, filter_value in filters.items(): 
        # same as doing rehab_query.filter(AND(condition1, condition 2, etc.))
        # getattr(Rehab, filter_key), same as doing Rehab.<filter_key>, 
        rehab_query = rehab_query.filter(getattr(Rehab, filter_key) == filter_value)
    
    for multi_search_column, args_to_filter in multi_arg_filter_params.items(): 
        for arg_to_search in args_to_filter: 
            rehab_query = rehab_query.filter(
                getattr(Rehab, multi_search_column).ilike(f"%{arg_to_search}%"))

    return rehab_query

# Add filters specific to counties and returns 
# a query with county specific filters, if invalid 
# filters, returns None
def add_county_filters(request: Request): 
    range_cols = ["typeviolent", "typeproperty", "typeother", "typedrug", 
                    "typetotal", "population_rank", "population"]
    range_filters: dict[str, list] = get_range_args(request.args, range_cols)

    if range_filters is None: 
        return None

    words_to_search : list[str] = []
    
    if request.args.get("query") != None: 
        words_to_search = request.args.get("query").split(",")

    # print("range filters: " + str(range_filters))

    county_query = db.session.query(County)

    # no filters, just wants all the model instances
    if len(range_filters) + len(words_to_search) == 0:
        return county_query

    county_query = query_add_range_filter(county_query, County, range_filters)

    sort = request.args.get("sort")
    columns_to_exclude = ["img_url", "latitude", "longitude", "id"]
    county_query = add_search_queries(County, county_query, columns_to_exclude,
                                        words_to_search, sort)
    return county_query

# Add reentry model specific filters, returns new query 
# with reentry specific filters, returns None for bad params
def add_reentry_filters(request: Request): 
    # type is mutually exclusive, only one type allowed
    columns_to_filter = ["programtype", "county"]
    filters: dict[str, list[str]] = {}

    for column_to_filter in columns_to_filter: 
        if request.args.get(column_to_filter) is not None: 
            filters[column_to_filter] = request.args.get(column_to_filter)
    
    range_cols = ["rating"]
    range_filters: dict[str, list] = get_range_args(request.args, range_cols)

    if range_filters is None: 
        return None

    words_to_search : list[str] = []
    
    if request.args.get("query") != None: 
        words_to_search = request.args.get("query").split(",")
    
    reentry_query = db.session.query(Reentry)

    # no valid params, return all 
    if len(filters) + len(range_filters) + len(words_to_search) == 0: 
        return reentry_query

    # apply each filter from filters onto the class query
    # https://stackoverflow.com/questions/41305129/sqlalchemy-dynamic-filtering
    for filter_key, filter_value in filters.items(): 
        # same as doing rehab_query.filter(AND(condition1, condition 2, etc.))
        # getattr(Rehab, filter_key), same as doing Rehab.<filter_key>, 
        reentry_query = reentry_query.filter(getattr(Reentry, filter_key) == filter_value)

    reentry_query = query_add_range_filter(reentry_query, Reentry, range_filters)

    sort = request.args.get("sort")

    columns_to_exclude = ["b64_img", "latitude", "longitude", "id"]
    reentry_query = add_search_queries(Reentry, reentry_query, 
                                    columns_to_exclude, words_to_search, sort)

    return reentry_query

@app.route("/api/v1/search")
def search() -> str:

    if len(request.args) == 0: 
        return "No Arguments for search"

    # Standard!!!! Multiple Values for one key, e.g. 
    # payment = medicare, medicaid, etc. 
    # shall be separated by comma like so 
    # payment=medicare,medicaid etc.. in the url params
    model_type = request.args.get("model")
    page_arg: str = request.args.get("page")

    if not page_arg:
        page_number = -1
    else:
        try:
            page_number: int = int(page_arg)
        except TypeError:
            return "Page Number is not a number"

    param_to_filter_adder = {
        "rehab": add_rehab_filters,
        "reentry": add_reentry_filters,
        "county": add_county_filters 
    }

    param_to_model = {
        "rehab": Rehab,
        "reentry": Reentry,
        "county": County
    }

    if model_type not in param_to_filter_adder: 
        return "Invalid Model Type"

    add_filters = param_to_filter_adder[model_type]
    filter_query = add_filters(request)

    if filter_query is None: 
        return "Bad Parameters"

    model = param_to_model[model_type]

    query_results = filter_query.all()
    filtered_json = query_results_to_json(query_results, model)
    return get_page(filtered_json, page_number) 
   
@app.route("/test1")
def test1() -> str:
    """
    Quick endpoint test, check if endpoints are working.

    :return: predefined string
    :rtype: string
    """
    return "test endpoint. Seeing if response works."


@app.route("/test2/<random>")
def test2(random: str) -> str:
    """
    Quick endpoint test, check if url parameters are working.
    :param str:
    :type str: str

    :return: String with the passed in str.
    :rtype: str

    """
    return f"test endpoint: {random} Seeing if taking params works."


if __name__ == "__main__":
    app.run(port=5000, debug=True)
