#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports

# Local imports
from app import app
from models import db, Users, Restaurants, Experiences, UserPreferences

def create_username():
    usernames = []
    emails = ['statsumi.sts@gmail.com']

    for email in emails:
        user1 = Users(
            username = 'Statz',
            user_email = email,
            passwordhash = 'Testing11216',
            )
        usernames.append(user1)

    return usernames

def create_restaurants():
    restaurants = []

    restaurant1 = Restaurants(
        name = 'Raku',
        cuisine = 'Japanese',
        neighborhood = 'East Village',
        visited = True
    )
    restaurants.append(restaurant1)

    restaurant2 = Restaurants(
        name = 'Pasta Louise',
        cuisine = 'Italian',
        neighborhood = 'Park Slope',
        visited = True
    )
    restaurants.append(restaurant2)

    return restaurants

if __name__ == '__main__':
    with app.app_context():
        print('Clearing db...')
        Users.query.delete()
        Restaurants.query.delete()

        print('Seeding usernames...')
        usernames = create_username()
        db.session.add_all(usernames)
        db.session.commit()

        print('Seeding restaurants...')
        restaurants = create_restaurants()
        db.session.add_all(restaurants)
        db.session.commit()

        print('Done seeding!')