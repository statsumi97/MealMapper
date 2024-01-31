#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request
from flask_restful import Resource
from flask_cors import cross_origin

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Restaurant, Memory, Filter

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)

