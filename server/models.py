from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
import re

from config import db 

class Users(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String, nullable=False, unique=True)
    passwordhash = db.Column(db.String, nullable=False)

    #RELATIONSHIPS
    experiences = db.relationship('Experiences', back_populates='user')
    user_preferences = db.relationship('UserPreferences', back_populates='user')

    #SERIALIZATION
    serialize_rules = ('-experiences.user', '-user_preferences.user')

    #VALIDATIONS
    @validates('username')
    def validate_username(self, key, value):
        if 0 < len(value) <= 25:
            return value
        else:
            raise ValueError
    
    @validates('passwordhash')
    def validate_passwordhash(self, key, value):
        if value:
            return value
        else:
            raise ValueError
    
    @validates('user_email')
    def validate_user_email(self, key, value):
        #Simple regex for validating an email address
        email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.match(email_regex, value):
            return value
        else:
            raise ValueError('Invalid email format')
    
    def __repr__(self):
        return f'<Users {self.id}, {self.username}>'

class Restaurants(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    cuisine = db.Column(db.String, nullable=False)
    neighborhood = db.Column(db.String, nullable=False)
    visited = db.Column(db.Boolean, nullable=False)

    #RELATIONSHIPS
    experiences = db.relationship('Experiences', back_populates='restaurant')

    #SERIALIZATION
    serialize_rules = ('-experiences.restaurant', )

    def __repr__(self):
        return f'<Restaurants {self.id}, {self.name}>'

class Experiences(db.Model, SerializerMixin):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    
    visit_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    image_url = db.Column(db.Text, nullable=True)
    story = db.Column(db.Text, nullable=False)

    #RELATIONSHIPS
    user = db.relationship('Users', back_populates='experiences')
    restaurant = db.relationship('Restaurants', back_populates ='experiences')

    #SERIALIZATION
    serialize_rules = ('-user.experiences', '-restaurant.experiences')

    def __repr__(self):
        return f'<Experiences {self.id}, {self.user_id}, {self.restaurant_id}, {self.visit_date}, {self.image_url}, {self.story}>'

class UserPreferences(db.Model, SerializerMixin):
    __tablename__ = 'user_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    preferred_cuisines = db.Column(db.String, nullable=True)
    preferred_neighborhoods = db.Column(db.String, nullable=True)
    visitation_status = db.Column(db.Boolean, nullable=True)

    #RELATIONSHIPS
    user = db.relationship('Users', back_populates='user_preferences')

    #SERIALIZATION
    serialize_rules = ('-user.user_preferences', )

    def __repr__(self):
        return f'<UserPreferences {self.id}, {self.user_id}, {self.preferred_cuisines}, {self.preferred_neighborhoods}, {self.visitation_status}>'
