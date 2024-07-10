from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    goals = db.relationship('Goal', backref='user')
    workouts = db.relationship('Workout', backref='user')
    goals_achieved = db.relationship('GoalAchieved', backref='user')

    def __repr__(self):
        return f"<User {self.id}>"


class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    type = db.Column(db.String)
    description = db.Column(db.Text)
    rate = db.Column(db.Integer) # Days/week

    # Attributes for goal of type 'Duration'
    duration = db.Column(db.Integer) # Weeks
    weeks_completed = db.Column(db.Integer) # regarding the 'duration'
    date_started = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    is_week_finished = db.Column(db.Boolean, default=False) # Did user complete the week yet

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f"<Goal number {self.id} with title {self.title}>"


class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    exercises = db.relationship('Exercise', backref='workout')
    add_to_schedule = db.Column(db.Boolean)
    day_scheduled = db.Column(db.String)

    def __repr__(self):
        return f"<Workout number {self.id} with title {self.title}>"

# Each workout will have exercises
class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'))

    def __repr__(self):
        return f"<Exercise number {self.id} with title {self.title}>"

class GoalAchieved(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    type = db.Column(db.String)
    description = db.Column(db.Text)
    rate = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    date_started = db.Column(db.DateTime)
    date_finished = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f"<Achievement number {self.id} with title {self.title}>"
    