#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request
from flask_restful import Resource
from flask_cors import cross_origin

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

@app.route('/restaurants', methods=['GET', 'POST'])
def restaurants():
    if request.method == 'GET':
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

if __name__ == '__main__':
    app.run(debug=True)