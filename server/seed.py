#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Local imports
from app import app
from models import User, Restaurant, Cuisine, Neighborhood, VisitLog

#Additional imports
from config import db
from werkzeug.security import generate_password_hash

#Function to add initial data to the database
def add_initial_data():
    #Clear existing data
    db.drop_all()
    db.create_all()

    #Add cuisines
    cuisine1 = Cuisine(type='Italian')
    cuisine2 = Cuisine(type='Japanese')
    db.session.add(cuisine1)
    db.session.add(cuisine2)

    #Add neighborhoods
    neighborhood1 = Neighborhood(name='East Village')
    neighborhood2 = Neighborhood(name='Park Slope')
    db.session.add(neighborhood1)
    db.session.add(neighborhood2)

    #Add restaurants
    restaurant1 = Restaurant(name='Raku', address='342 E 6th St, New York, NY 10003', cuisine=cuisine2, neighborhood=neighborhood1)
    restaurant2 = Restaurant(name='Pasta Louise', address='1114 8th Ave, Brooklyn, NY 11215', cuisine=cuisine1, neighborhood=neighborhood2)
    db.session.add(restaurant1)
    db.session.add(restaurant2)

    #Add a user
    user1 = User(username='statsumi97', email='statsumi.sts@gmail.com')
    user1.set_password('testing11216') #use the set_password method to hash the password
    db.session.add(user1)

    #Commit changes
    db.session.commit()

    #Add visit logs
    visit1 = VisitLog(user_id=user1.id, restaurant_id=restaurant1.id, notes='Loved the udon!')
    db.session.add(visit1)
    db.session.commit()

    #Make user1 favorite Pasta Louise
    user1.favorite_restaurants.append(restaurant2)
    db.session.commit()

    if __name__ == '__main__':
        add_initial_data()
        print('Database seeded!')