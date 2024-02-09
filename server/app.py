#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request
from flask_restful import Resource
from flask_cors import cross_origin
import random
from datetime import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import db, Users, Restaurants, Experiences, UserPreferences

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

#Route for new user signup
@app.route('/users', methods=['POST'])
def users():
    try:
        form_data = request.get_json()
        new_user = Users(
            username = form_data['username'],
            user_email = form_data['user_email'],
            passwordhash = form_data['passwordhash']
        )
        db.session.add(new_user)
        db.session.commit()
        response = make_response(
            new_user.to_dict(),
            201
        )
    except ValueError:
        response = make_response(
            {'Error': 'Validation error'},
            400
        )
    return response

#Route for user login functionality
@app.route('/login', methods=['POST'])
def users_by_email():
    try:
        form_data = request.get_json()
        email = form_data['email']
        password = form_data['password']
        user = Users.query.filter(Users.user_email == email).first()

        #Compare the provided password with the stored hashed password
        if user:
            if password == user.passwordhash:
                login_body = user.to_dict(only=('id', ))
                res = make_response(
                    login_body,
                    200
                )
            else:
                res = make_response(
                    {'error': 'wrong password'},
                    401
                )
        else:
            res = make_response(
                {'error': 'account does not exist'},
                404
            )
    except:
        res = make_response(
            {'error': 'account does not exist'},
            404
            )
    return res

#Route to retrieve all restaurants, create a new restaurant, and filter
@app.route('/restaurants', methods=['GET', 'POST'])
def restaurants():
    if request.method == 'GET':
        #Retrieve query parameters
        cuisine = request.args.get('cuisine')
        neighborhood = request.args.get('neighborhood')
        visited = request.args.get('visited')
        search_query = request.args.get('search', '').lower()

        #Start with a base query
        query = Restaurants.query

        #Apply search query if provided
        if search_query:
            query = query.filter(db.or_(
                Restaurants.name.ilike(f'%{search_query}%'),
                Restaurants.cuisine.ilike(f'%{search_query}%'),
                Restaurants.neighborhood.ilike(f'%{search_query}%')
            ))

        #Filter by cuisine if the parameter is provided
        if cuisine:
            query = query.filter(Restaurants.cuisine.ilike(f'%{cuisine}%'))

        #Filter by neighborhood if the parameter is provided
        if neighborhood:
            query = query.filter(Restaurants.neighborhood.ilike(f'%{neighborhood}%'))

        #Handle the absence of the visited parameter as a request for both visited and not visited restaurants
        if visited in ['true', 'false']:
            visited_bool = visited.lower() == 'true'
            query = query.filter(Restaurants.visited == visited_bool)

        #Execute the query
        restaurants = query.all()
        restaurants_dict = [restaurant.to_dict(rules=('-experiences', )) for restaurant in restaurants]

        response = make_response(
            restaurants_dict,
            200
        )
        return response

    elif request.method == 'POST':
        try:
            form_data = request.get_json()
            new_restaurant = Restaurants(
                name = form_data['name'],
                cuisine = form_data['cuisine'],
                neighborhood = form_data['neighborhood'],
                visited = form_data['visited']
            )
            db.session.add(new_restaurant)
            db.session.commit()

            response = make_response(
                new_restaurant.to_dict(),
                201
            )
        except ValueError:
            response = make_response(
                {'errors': ['validation errors']},
                400
            )
    return response

#Route for randomizer functionality
@app.route('/restaurants/random', methods=['GET'])
def random_restaurant():
    #Retrieve query parameters
    cuisine = request.args.get('cuisine')
    neighborhood = request.args.get('neighborhood')
    visited = request.args.get('visited')

    #Start with a base query
    query = Restaurants.query

    #Filter by cuisine if the parameter is provided
    if cuisine:
        query = query.filter(Restaurants.cuisine == cuisine)
    
    #Filter by neighborhood if the parameter is provided
    if neighborhood:
        query = query.filter(Restaurants.neighborhood == neighborhood)

    #Filter by visited status if the parameter is provided
    if visited is not None:
        visited_bool = visited.lower() in ['true', '1', 't']
        query = query.filter(Restaurants.visited == visited_bool)
    
    #Execute the query and convert to a list
    restaurants = query.all()

    #Select a random restaurant from the filtered list if not empty
    if restaurants:
        random_restaurant = random.choice(restaurants).to_dict(rules=('-experiences', ))
        response = make_response(
            random_restaurant,
            200
        )
    else:
        response = make_response(
            {'error': 'No restaurants found'},
            404
        )
    
    return response

#Edit or delete a restaurant
@app.route('/restaurants/<int:id>', methods=['PATCH', 'DELETE'])
def restaurant_by_id(id):
    restaurant = Restaurants.query.get(id)
    if not restaurant:
        response = make_response(
            {'error': 'Restaurant not found'},
            404
        )
    
    if request.method == 'PATCH':
        try:
            data = request.get_json()
            if 'name' in data:
                restaurant.name = data['name']
            if 'cuisine' in data:
                restaurant.cuisine = data['cuisine']
            if 'neighborhood' in data:
                restaurant.neighborhood = data['neighborhood']
            if 'visited' in data:
                restaurant.visited = data['visited']
            db.session.commit()
            response = make_response(
                restaurant.to_dict(),
                200
            )
        except:
            response = make_response(
                {'error': 'Validation error'},
                400
            )
    
    elif request.method == 'DELETE':
        try:
            assoc_restaurants = Restaurants.query.filter(Restaurants.id == id).all()

            for assoc_restaurant in assoc_restaurants:
                db.session.delete(assoc_restaurant)
            
            db.session.delete(restaurant)
            db.session.commit()

            response = make_response(
                {},
                204
            )
        except:
            response = make_response(
                {'error': 'Failed to delete'},
                404
            )
    
    return response

#Route for posting user experiences and retrieving all experiences
@app.route('/experiences', methods=['GET', 'POST'])
def experiences():
    if request.method == 'POST':
        try: 
            form_data = request.get_json()
            #Ensure the image_url is received from the request; provide a default value if not provided
            image_url = form_data.get('image_url', '')
            #Convert the visit_date string to a Python date object
            visit_date = datetime.strptime(form_data['visit_date'], '%Y-%m-%d').date()

            new_experiences = Experiences(
                user_id=form_data['user_id'],
                restaurant_id=form_data['restaurant_id'],
                visit_date=visit_date,
                image_url=image_url, #Save the image URL received from the form data
                story=form_data['story']
            )
            db.session.add(new_experiences)
            db.session.commit()
            response = make_response(
                new_experiences.to_dict(rules=('-user', '-restaurant')),
                201
            )
        except ValueError:
            response = make_response(
                {'error': 'Validation error'},
                400
            )

    elif request.method == 'GET':
        search_query = request.args.get('restaurantName', '').lower()
        query = Experiences.query.join(Restaurants, Experiences.restaurant_id == Restaurants.id)
        if search_query:
            query = query.filter(Restaurants.name.ilike(f'%{search_query}%'))

        experiences = query.all()
        experiences_dict = [experience.to_dict(rules =('-user', '-restaurant')) for experience in experiences]
        response = make_response(
            experiences_dict,
            200
            )
    
    return response

#Route for editing and deleting user posts
@app.route('/experiences/<int:experience_id>', methods=['GET', 'PATCH', 'DELETE'])
def handle_experience(experience_id):
    experience = Experiences.query.get_or_404(experience_id)

    if request.method == 'PATCH':
        data = request.get_json()
        #Ensure the image_url is received from the request; provide a default value if not provided
        image_url = data.get('image_url', '')
        if 'restaurant_id' in data:
            experience.restaurant_id = data['restaurant_id']
        if 'visit_date' in data:
            #Ensure the visit date is properly formatted and converted to a date object
            experience.visit_date = datetime.strptime(data['visit_date'], '%Y-%m-%d').date()
        if 'image_url' in data:
            experience.image_url = image_url #Save the image URL received from the form data
        if 'story' in data:
            experience.story = data['story']
        
        db.session.commit()
        response = make_response(
            experience.to_dict(rules=('-user', '-restaurant')),
            200
        )
    
    elif request.method == 'DELETE':
        db.session.delete(experience)
        db.session.commit()
        response = make_response(
            {},
            204
        )
    
    elif request.method == 'GET':
        response = make_response(
            experience.to_dict(rules=('-user', '-restaurant')),
            200
        )

    return response


if __name__ == '__main__':
    app.run(debug=True)