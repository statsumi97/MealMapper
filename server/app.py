#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request, jsonify
from flask_restful import Resource
from flask_cors import cross_origin
from sqlalchemy.sql.expression import func

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Restaurant, Memory, Filter, Visit

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

## Login Functionality
@app.route('/login', methods = ['POST'])
def users_by_email():
    try:
        form_data = request.get_json()
        email = form_data['email']
        password = form_data['password']
        user = User.query.filter(User.user_email == email).first()

        if user:
            if password == user.passwordhash:
                login_body = user.to_dict(only=('id',))
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

@app.route('/users/<int:id>', methods = ['GET', 'DELETE'])
def users_by_id(id):
    user = User.query.filter(User.id == id).first()

    if request.method == 'GET':
        user_body = user.to_dict(rules=('-memories', '-filters', '-username', '-id'))

        res = make_response(
            user_body,
            200
        )
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()

        res = make_response(
            {},
            201
        )
    return res

@app.route('/users', methods = ['POST'])
def users():
    try:
        form_data = request.get_json()
        new_user = User(
            username = form_data['username'],
            email = form_data['email'],
            password = form_data['password']
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

@app.route('/restaurants/<int:id>', methods = ['GET'])
def restaurant_by_id(id):
    restaurant = Restaurant.query.filter(Restaurant.id == id).first()

    if restaurant:
        response = make_response(
            restaurant.to_dict(rules = ('memories', )),
            200
        )
    else:
        response = make_response(
            { 'error': 'Restaurant not found' },
            404
        )
    
    return response

@app.route('/restaurants', methods = ['GET'])
def restaurants():
    restaurants = Restaurant.query.filter().all()
    restaurants_dict = [restaurant.to_dict() for restaurant in restaurants]

    response = make_response(
        restaurants_dict,
        200
    )

    return response

@app.route('/restaurants/<int:restaurant_id>/visit', methods =['POST'])
def log_visit(restaurant_id):
    #Get the logged in user
    user = users_by_id()

    #Get the form data
    form_data = request.get_json()

    #Create a new list
    visit = Visit(user_id=user.id, restaurant_id=restaurant_id, comment=form_data.get('comment'))

    #Add and commit the new visit
    db.session.add(visit)
    db.session.commit()

    #Return a success response
    return jsonify({'message': 'Visit logged successfully'}), 201

@app.route('/memories', methods = ['GET'])
def memories():
    memories = Memory.query.all()
    memories_dict = [memory.to_dict(rules = ('-user', '-restaurant')) for memory in memories]
    response = make_response(
        memories_dict,
        200
    )
    # elif request.method == 'POST':
    #     form_data = request.get_json()
    #     new_memories = Memory(
    #         user_id = form_data['user_id'],
    #         restaurant_id = form_data['restaurant_id'],
    #         date_visited = form_data['date_visited'],
    #         photo = form_data['photo'],
    #         story = form_data['story']
    #     )

    #     db.session.add(new_memories)
    #     db.session.commit()
    #     response = make_response(
    #         new_memories.to_dict(rules=('-user', '-restaurant')),
    #         201
    #     )

    return response

@app.route('/memories/<int:id>', methods = ['PATCH'])
def memory_by_id(id):
    memory = Memory.query.filter(Memory.id == id).first()

    if memory:
        try:
            form_data = request.get_json()

            for attr in form_data:
                setattr(memory, attr, form_data[attr])

            db.session.commit()
            response = make_response(
                memory.to_dict(rules = ('-user', '-restaurant')),
                202
            )
        except ValueError:
            response = make_response(
                { 'errors': ['validation errors'] },
                400
            )
    else:
        response = make_response(
            { 'error': 'Memory not found' },
            404
        )
    
    return response

@app.route('/filters', methods = ['GET'])
def get_filtered_restaurants():
    #Get the query parameters
    cuisine = request.args.get('cuisine')
    neighborhood = request.args.get('neighborhood')
    visited = request.args.get('visited')

    #Start with all restaurants
    query = Restaurant.query

    #Apply the filters if they were provided
    if cuisine:
        query = query.filter(Restaurant.cuisine == cuisine)
    if neighborhood:
        query = query.filter(Restaurant.neighborhood == neighborhood)
    if visited is not None:
        query = query.join(Visit).filter(Visit.user_id == users_by_id().id, Visit.visited == (visited.lower() == 'true'))
    
    #Execute the query and get the filtered restaurants
    restaurants = query.all()

    #Convert the restaurants to JSON and return them
    return jsonify([restaurant.to_dict() for restaurant in restaurants])

@app.route('/random_restaurants', methods=['GET'])
def get_random_restaurant():
    #Get the query parameters
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)

