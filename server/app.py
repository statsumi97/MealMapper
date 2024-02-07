#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, request, render_template, redirect, url_for, flash, jsonify
from flask_restful import Resource
from flask_cors import cross_origin, CORS

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User

#Additional imports
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SECRET_KEY'] = 'afraid_of_heights'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
CORS(app)


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

#Route for creating an account
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() #get data as JSON
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    #Basic validation
    if not username or not email or not password:
        return jsonify({'message': 'Please fill out all fields'}), 400
    elif User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    elif User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400
    else:
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Account created successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)

