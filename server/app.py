#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request, jsonify, session
from flask_restful import Resource
from flask_cors import cross_origin
from sqlalchemy.sql.expression import func
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Restaurant, Memory, Filter, Visit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'afraid-of-heights'
login_manager = LoginManager(app)

#This function generates a token
def generate_token(user_id):
    expiration_time = datetime.utcnow() + timedelta(seconds=3600) #token expires in 1 hour
    payload = {'id': user_id, 'exp': expiration_time}
    secret_key = app.config['afraid-of-heights']
    token = jwt.encode(payload, secret_key, algorithm='HS256').decode('utf-8')
    return token

#This function verifies the token and returns user id
def verify_token(token):
    secret_key = app.config['afraid-of-heights']
    try:
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        return data['id']
    except jwt.ExpiredSignatureError:
        #Token has expired
        return None
    except jwt.InvalidTokenError:
        #Invalid token
        return None

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

## Login Functionality
@app.route('/login', methods = ['POST'])
def login():
    try:
        form_data = request.get_json()
        email = form_data['email']
        password = form_data['password']
        user = User.query.filter(User.user_email == email).first()

        if user and check_password_hash(user.password, password):
            login_user(user) #use Flask-Login to log in the user
            login_body = user.to_dict(only=('id', ))
            res = make_response(login_body, 200)
        else:
            res = make_response(
                {'error': 'Invalid credentials'},
                401
            )
    except Exception as e:
        print(str(e))
        res = make_response(
            {'error': 'Invalid credentials'},
            401
        )
    return res

#User loading function to load a user from the user ID stored in the session
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#Use @login_required decorator to protect routes that require authentication
@app.route('/protected')
@login_required
def protected_route():
    return f'Hello, {current_user.username}! This route requires authentication.'

#Implement a logout route to log out the user
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

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
            password = form_data['password'],
            profile_picture = form_data['profile_picture']
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


#Improve error handling by catching specific exceptions and return more accurate error messages
@app.route('/users/<string:email>', methods = ['GET'])
def users_by_email(email):
    try:
        user = User.query.filter(User.user_email == email).first()

        if user:
            user_body = user.to_dict(rules=('-memories', '-filters', '-username', '-id'))
            res = make_response(user_body, 200)
        else:
            res = make_response({'error': 'User not found'}, 404)
    except ValueError:
        res = make_response({'error': 'Invalid value provided'}, 400)
    except Exception as e:
        print(str(e))
        res = make_response({'error': 'An unexpected error occured'}, 500)
    
    return res

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
    token = request.headers.get('Authorization') #get token from headers
    user_id = verify_token(token) #verify token and get user id
    if user_id is None:
        return jsonify({'error': 'Invalid token'}), 401
    
    #Get the logged in user
    user = users_by_id()

    #Get the form data
    form_data = request.get_json()

    #Create a new list
    visit = Visit(user_id=user.id, restaurant_id=restaurant_id, experience=form_data.get('experience'))

    #Add and commit the new visit
    db.session.add(visit)
    db.session.commit()

    #Return a success response
    return jsonify({'message': 'Visit logged successfully'}), 201

@app.route('/restaurants/<int:restaurant_id>/memories', methods=['GET'])
def get_restaurant_memories(restaurant_id):
    #Fetch all memories related to the specific restaurant from the database
    memories = Memory.query.filter_by(restaurant_id=restaurant_id).all()

    #Convert the memories into a format that can be returned as a response
    response = [memory.to_dict() for memory in memories]

    return jsonify(response), 200

@app.route('/memories', methods = ['GET', 'POST'])
def memories():
    if request.method == ['GET']:
        memories = Memory.query.all()
        memories_dict = [memory.to_dict(rules = ('-user', '-restaurant')) for memory in memories]
        response = make_response(
            memories_dict,
            200
    )
    elif request.method == 'POST':
        form_data = request.get_json()
        new_memories = Memory(
            user_id = form_data['user_id'],
            restaurant_id = form_data['restaurant_id'],
            date_visited = form_data['date_visited'],
            photo = form_data['photo'],
            story = form_data['story']
        )

        db.session.add(new_memories)
        db.session.commit()
        response = make_response(
            new_memories.to_dict(rules=('-user', '-restaurant')),
            201
        )

    return response

@app.route('/memories/<int:id>', methods = ['PATCH', 'DELETE'])
def memory_by_id(id):
    memory = Memory.query.filter(Memory.id == id).first()

    if memory:
        if request.method == ['PATCH']:
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
        elif request.method == ['DELETE']:
            #If the memory doesn't exist, return a 404 error
            if memory is None:
                return jsonify({'error': 'Memory not found'}), 404
            
            #Delete the memory
            db.session.delete(memory)
            db.session.commit()

            #Return a success message
            return jsonify({'message': 'Memory deleted successfully'}), 200

    else:
        response = make_response(
            { 'error': 'Memory not found' },
            404
        )
    
    return response

@app.route('/filters', methods = ['GET'])
def get_filters():
    #Get the user's id
    user_id = session.get('user_id')

    #Pass the user's id to the users_by_id function
    user = users_by_id(user_id)
    return user

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
    cuisine = request.args.get('cuisine')
    neighborhood = request.args.get('neighborhood')
    visited = request.args.get('visited')

    #Start with all restaurants
    query = Restaurant.query

    #Apply filters if they were provided
    if cuisine:
        query = query.filter(Restaurant.cuisine == cuisine)
    if neighborhood:
        query = query.filter(Restaurant.neighborhood == neighborhood)
    if visited is not None:
        query = query.join(Visit).filter(Visit.user_id == users_by_id().id, Visit.visited == (visited.lower() == 'true')).order_by(func.random())

    #Get the filtered restaurants
    restaurants = query.all()

    #If no restaurants match the filters, return an error message
    if not restaurants:
        return jsonify({'error': 'No restaurants found matching the filters'}), 404
    
    #Select a random restaurant
    random_restaurant = query.first()

    #Return the random restaurant
    return jsonify(random_restaurant.to_dict()), 200



if __name__ == '__main__':
    app.run(port=5555, debug=True)

