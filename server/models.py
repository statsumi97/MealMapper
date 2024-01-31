from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
import re


from config import db


class User(db.Model, SerializerMixin):
   __tablename__ = 'users'


   id = db.Column(db.Integer, primary_key=True)
   username = db.Column(db.String, nullable=False)
   password = db.Column(db.String, nullable=False)
   email = db.Column(db.String, nullable=False)


   #Relationships
   memories = db.relationship('Memory', back_populates='user')
   filters = db.relationship('Filter', back_populates='user')


   #Serialization
   serialize_rules = ('-memories.user', '-filters.user')


   #Validations
   @validates('username')
   def validate_username(self, key, value):
       if 0 < len(value) <= 25:
           return value
       else:
           raise ValueError('Username must be between 1 and 25 characters.')
  
   @validates('password')
   def validate_password(self, key, value):
       if 0 < len(value) <= 25:
           return generate_password_hash(value)
       else:
           raise ValueError('Password must be between 1 and 25 characters.')
  
   def check_password(self, password):
       return check_password_hash(self.password, password)
  
   @validates('email')
   def validate_email(self, key, email):
       #Check if email is not empty
       if not email:
           raise AssertionError('No provided email')
      
       #Check if email matches regex pattern
       email_regex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
       if not re.match(email_regex, email):
           raise AssertionError('Provided email is not a valid email address')
      
       return email
  
   def __repr__(self):
       return f'<User{self.id}, {self.username}>'


class Restaurant(db.Model, SerializerMixin):
   __tablename__= 'restaurants'


   id = db.Column(db.Integer, primary_key=True)
   name = db.Column(db.String, nullable=False)
   cuisine = db.Column(db.String, nullable=False)
   neighborhood = db.Column(db.String, nullable=False)
   visited = db.Column(db.Boolean, nullable=False, default=False)


   #Relationships
   memories = db.relationship('Memory', back_populates='restaurant')


   #Serialization
   serialize_rules = ('-memories.restaurant', )


   def __repr__(self):
       return f'<Restaurant {self.id}, {self.name}>'


class Memory(db.Model, SerializerMixin):
   __tablename__ = 'memories'


   id = db.Column(db.Integer, primary_key=True)
   user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
   restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
   date_visited = db.Column(db.Date, nullable=False)
   photo = db.Column(db.String, nullable=True)
   story = db.Column(db.String, nullable=True)


   #Relationships
   user = db.relationship('User', back_populates='memories')
   restaurant = db.relationship('Restaurant', back_populates='memories')


   #Serializations
   serialize_rules = ('-user.memories', '-restaurant.memories')


   def __repr__(self):
       return f'<Memory {self.id}, {self.user_id}, {self.restaurant_id}, {self.date_visited}, {self.photo}, {self.story}>'
  
class Filter(db.Model, SerializerMixin):
   __tablename__ = 'filters'


   id = db.Column(db.Integer, primary_key=True)
   user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
   cuisine = db.Column(db.String, nullable=True)
   neighborhood = db.Column(db.String, nullable=True)
   visited = db.Column(db.Boolean, nullable=True)


   #Relationships
   user = db.relationship('User', back_populates='filters')


   #Serializations
   serialize_rules=('-user.filters', )

class Visit(db.Model, SerializerMixin):
   __tablename__ = 'visits'

   id = db.Column(db.Integer, primary_key=True)
   user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
   restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
   comment = db.Column(db.String, nullable=True)

class Random_Restaurant(db.Model, SerializerMixin):
   __tablename__ = 'random_restaurants'

   id = db.Column(db.Integer, primary_key=True)
   cuisine = db.Column(db.String, nullable=True)
   neighborhood = db.Column(db.String, nullable=True)
   visited = db.Column(db.Boolean, nullable=True)


   def __repr__(self):
       return f'<Filter {self.id}, {self.user_id}, {self.cuisine}, {self.neighborhood}, {self.visited}>'
