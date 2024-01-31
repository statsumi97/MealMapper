#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Restaurant, Memory, Filter

def create_username():
    usernames = []
    emails = []

    user1 = User(
        username = 'statsumi97',
        email = 'statsumi.sts@gmail.com',
        passwordhash = 'testing11216'
    )
    usernames.append(user1)

    return usernames

def create_restaurants():
    restaurants = []

    restaurant1 = Restaurant(
        name = 'Raku',
        cuisine = 'Japanese',
        neighborhood = 'East Village',
        visited = True
    )
    restaurants.append(restaurant1)

    if __name__ == '__main__':
        with app.app_context():

            print('Clearing db...')
            User.query.delete()
            Restaurant.query.delete()
            Memory.query.delete()
            Filter.query.delete()

            print('Seeding usernames...')
            usernames = create_username()
            db.session.add_all(usernames)
            db.session.commit()

            print('Seeding restaurants...')
            restaurants = create_restaurants()
            db.session.add_all(restaurants)
            db.session.commit()

            print('Done seeding!')

            

