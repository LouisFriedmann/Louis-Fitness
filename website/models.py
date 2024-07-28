import json

from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    goals = db.relationship('Goal', backref='user')
    workouts = db.relationship('Workout', backref='user')
    goals_achieved = db.relationship('GoalAchieved', backref='user')

    def __repr__(self):
        return f"<User {self.id}>"

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String)
    type = db.Column(db.String)
    description = db.Column(db.Text)
    rate = db.Column(db.Integer) # Days/week

    # Attributes for goal of type 'Duration'
    duration = db.Column(db.Integer) # Weeks goal is for
    weeks_completed = db.Column(db.Integer) # Means weeks completed out of 'duration' number of weeks
    date_started = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    is_week_finished = db.Column(db.Boolean, default=False) # Did user complete the week yet

    def __repr__(self):
        return f"<Goal number {self.id} with title {self.title}>"

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String)
    description = db.Column(db.Text)
    exercises = db.relationship('Exercise', backref='workout')

    # If the workout is scheduled
    add_to_schedule = db.Column(db.Boolean)
    days_scheduled = db.Column(db.String)

    def set_days_scheduled(self, days_scheduled):
        self.days_scheduled = json.dumps(days_scheduled)

    def get_days_scheduled(self):
        return json.loads(self.days_scheduled)

    def __repr__(self):
        return f"<Workout number {self.id} with title {self.title}>"

# Each workout will have exercises
class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'))
    title = db.Column(db.String)
    description = db.Column(db.Text)

    def __repr__(self):
        return f"<Exercise number {self.id} with title {self.title}>"

class GoalAchieved(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    title = db.Column(db.String)
    type = db.Column(db.String)
    description = db.Column(db.Text)
    date_started = db.Column(db.DateTime)
    date_finished = db.Column(db.DateTime)

    # When goal achieved is of type 'Duration'
    rate = db.Column(db.Integer)
    duration = db.Column(db.Integer)

    def __repr__(self):
        return f"<Achievement number {self.id} with title {self.title}>"