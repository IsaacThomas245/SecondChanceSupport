from __init__ import db, app 

class County(db.Model):
    __tablename__ = "county"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    typeviolent = db.Column(db.Integer, nullable=False)
    typeproperty = db.Column(db.Integer, nullable=False)
    typeother = db.Column(db.Integer, nullable=False)
    typedrug = db.Column(db.Integer, nullable=False)
    typetotal = db.Column(db.Integer, nullable=False)
    population = db.Column(db.Integer, nullable=False)
    population_rank = db.Column(db.Integer, nullable=False)
    img_src = db.Column(db.String(200), nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)

    def __init__(self, name, typeviolent, typeproperty, typedrug, typeother, 
                 typetotal, population, population_rank, longitude, latitude, img_src) -> None:
        self.name = name
        self.typeviolent = typeviolent
        self.typeproperty = typeproperty
        self.typeother = typeother 
        self.typetotal = typetotal
        self.typedrug = typedrug
        self.population = population
        self.population_rank = population_rank
        self.longitude = longitude
        self.latitude = latitude
        self.img_src = img_src

class Reentry(db.Model):
    __tablename__ = "reentry"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address1 = db.Column(db.String(100))
    address2 = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(100), nullable=False)
    zip = db.Column(db.String(100), nullable=True)
    websiteurl = db.Column(db.String(100), nullable=True)
    fax = db.Column(db.String(100), nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    openhour = db.Column(db.String(100), nullable=True)
    generalemail = db.Column(db.String(100), nullable=True)
    programtype = db.Column(db.String(100), nullable=True)
    rating = db.Column(db.Float, nullable=False)
    county = db.Column(db.String(100), nullable=False)
    b64_img = db.Column(db.Text, nullable=False)


    def __init__(self, name, address1, address2, city, phone, zip, websiteurl, 
                 fax, latitude, longitude, openhour, generalemail, programtype, 
                 rating, b64_img) -> None:
        self.name = name
        self.address1 = address1 
        self.address2 = address2 
        self.city = city
        self.phone = phone
        self.zip = zip 
        self.websiteurl = websiteurl
        self.fax = fax
        self.latitude = latitude
        self.longitude = longitude
        self.openhour = openhour 
        self.generalemail = generalemail
        self.programtype = programtype
        self.rating = rating
        self.b64_img = b64_img

class Rehab(db.Model):
    __tablename__ = "rehab"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(100), nullable=True)
    address = db.Column(db.String(100), nullable=True)
    services0 = db.Column(db.String(100), nullable=True)
    services1 = db.Column(db.String(100), nullable=True)
    services2 = db.Column(db.String(100), nullable=True)
    services3 = db.Column(db.String(100), nullable=True)
    payment0 = db.Column(db.String(100), nullable=True)
    payment1 = db.Column(db.String(100), nullable=True)
    payment2 = db.Column(db.String(100), nullable=True)
    payment3 = db.Column(db.String(100), nullable=True)
    payment4 = db.Column(db.String(100), nullable=True)
    payment5 = db.Column(db.String(100), nullable=True)
    payment6 = db.Column(db.String(100), nullable=True)
    payment7 = db.Column(db.String(100), nullable=True)
    payment8 = db.Column(db.String(100), nullable=True)
    type = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(100), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    b64_img = db.Column(db.Text, nullable=False)
    type = db.Column(db.Text, nullable=False)

    city = db.Column(db.String(100), nullable=False)
    county = db.Column(db.String(100), nullable=False)

    # columns to make backend easier
    cumulated_payments = db.Column(db.Text, nullable=True)
    cumulated_services = db.Column(db.Text, nullable=True)

    def __init__(self, website, address, services0, services1, 
                 services2, services3, payment0, payment1, payment2, 
                 payment3, payment4, payment5, payment6, 
                 payment7, payment8, type, phone, latitude, longitude,
                 name, cumulated_payments, cumulated_services, city, county, 
                 programtype)  -> None:
        self.website = website
        self.address = address

        self.services0 = services0
        self.services1 = services1
        self.services2 = services2
        self.services3 = services3

        self.payment0 = payment0
        self.payment1 = payment1
        self.payment2 = payment2
        self.payment3 = payment3
        self.payment4 = payment4
        self.payment5 = payment5
        self.payment6 = payment6
        self.payment7 = payment7
        self.payment8 = payment8

        self.type = type
        self.phone = phone
        self.latitude = latitude
        self.longitude = longitude
        self.name = name

        self.city = city
        self.county = county
        self.type = programtype

        # helper columns
        self.cumulated_payments = cumulated_payments
        self.cumulated_services = cumulated_services


with app.app_context():
    db.create_all()
