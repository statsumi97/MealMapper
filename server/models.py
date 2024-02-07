from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

#Additional imports
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash #methods for setting and checking passwords

from config import db

db = SQLAlchemy()

#Association table for the many-to-many relationship between Users and Restaurants
favorites = db.Table('favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('restaurant_id', db.Integer, db.ForeignKey('restaurant.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    #Relationships
    visits = db.relationship('VisitLog', backref='user', lazy=True)
    #Relationship for favorites using the association table
    favorite_restaurants = db.relationship('Restaurant', secondary=favorites, lazy='subquery', 
                                           backref=db.backref('favorited_by', lazy=True))
    
    #Function for setting password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    #Function for checking password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisine.id'), nullable=False)
    neighborhood_id = db.Column(db.Integer, db.ForeignKey('neighborhood.id'), nullable=False)

class Cuisine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=True, nullable=False)

    #Relationships
    restaurants = db.relationship('Restaurant', backref='cuisine', lazy=True)

class Neighborhood(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    #Relationships
    restaurants = db.relationship('Restaurant', backref='neighborhood', lazy=True)

class VisitLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    visit_date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    photo_url = db.Column(db.String(255))

    #Relationships
    restaurant = db.relationship('Restaurant', backref=db.backref('visits', lazy=True))

    #Function for updating visit log
    def update_log(self, notes=None, photo_url=None):
        if notes is not None:
            self.notes = notes
        if photo_url is not None:
            self.photo_url = photo_url
        db.session.commit()
    
    #Function for deleting visit log
    def delete_log(self):
        db.session.delete(self)
        db.session.commit()