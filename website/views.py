from flask import Flask, Blueprint, render_template, request, flash, redirect, url_for
from flask_login import current_user, LoginManager, login_manager
from flask_security import login_required
import os
import random
from .models import Goal, User, Workout, Exercise
from . import db
import datetime
import json
from django.utils.html import escapejs

views = Blueprint('views', __name__)

@views.route("/")
@login_required
def home():
    return render_template('home.html', user=current_user)

@views.route("/manage-goals", methods=['GET', 'POST'])
@login_required
def manage_goals():
    rate = 0
    duration = 0
    if request.method == 'POST':
        # Add built-in button workouts to database if the user presses one ONLY ONCE PER BUTTON
        if "workout-30-days" in request.form:
            today = datetime.datetime.now().date()
            new_goal = Goal(title="Workout for 30 days",
                            type="Duration",
                            description="Workout consistently for 30 days",
                            rate=1,
                            duration=30,
                            end_date=today + datetime.timedelta(days=31), # End date is the day after the number of days given by user
                            user_id=current_user.id)
            db.session.add(new_goal)
            db.session.commit()
            flash("Built in goal created successfully!", category="success")
            return redirect(url_for('views.manage_goals'))
        elif "bench-PR" in request.form:
            new_goal = Goal(title="Bench PR",
                            type="New PR",
                            description="Bench your bodyweight ex: if you are 150lbs, you need to bench 150lbs",
                            rate=None,
                            duration=None,
                            end_date=None,
                            user_id=current_user.id)
            db.session.add(new_goal)
            db.session.commit()
            flash("Built in goal created successfully!", category="success")
            return redirect(url_for('views.manage_goals'))
        elif "lose-weight" in request.form:
            new_goal = Goal(title="Lose 10% of your weight",
                            type="Lose/Gain Weight",
                            description="Lose 10% of your bodyweight ex: if you are 100lbs, you need to get to 90lbs",
                            rate=None,
                            duration=None,
                            end_date=None,
                            user_id=current_user.id)
            db.session.add(new_goal)
            db.session.commit()
            flash("Built in goal created successfully!", category="success")
            return redirect(url_for('views.manage_goals'))
        else:
            today = datetime.datetime.now().date()
            title = request.form.get('goal-title')
            goal_type = request.form.get('goal-type')
            description = request.form.get('goal-description')

            if goal_type == "Duration":
                rate = int(request.form.get('goal-rate'))
                duration = int(request.form.get('goal-duration'))
                new_goal = Goal(title=title, type=goal_type, description=description, rate=rate, duration=duration, end_date=today + datetime.timedelta(days=duration + 1), user_id=current_user.id)
            else:
                new_goal = Goal(title=title, type=goal_type, description=description, rate=None, duration=None, end_date=None, user_id=current_user.id)

            db.session.add(new_goal)
            db.session.commit()
            flash("Custom goal created successfully!", category="success")
            return redirect(url_for('views.manage_goals'))

    return render_template('manage_goals.html', user=current_user, goals=Goal.query.all())

# Edit a goal
@views.route('/edit-goal/', methods=['GET', 'POST'])
@login_required
def edit_goal():
    if request.method == 'POST':
        goal_id = int(request.form.get('goal-id'))
        goal = Goal.query.get_or_404(goal_id)
        original_goal_title = goal.title

        today = datetime.datetime.now().date()

        goal.title = request.form.get('edit-goal-title')
        goal.type = request.form.get('edit-goal-type')
        goal.description = request.form.get('edit-goal-description')
        if request.form.get('edit-goal-duration'):
            duration = int(request.form.get('edit-goal-duration'))
            goal.duration = duration
            goal.rate = int(request.form.get('edit-goal-rate'))
            goal.end_date = today + datetime.timedelta(days=duration + 1)
        else:
            goal.duration = None
            goal.rate = None
            goal.end_date = None
        goal.user_id = current_user.id
        db.session.add(goal)
        db.session.commit()

        flash(f"Edited \"{original_goal_title}\" successfully", category="success")

        return redirect(url_for("views.manage_goals"))

    return render_template('manage_goals.html', user=current_user, goals=Goal.query.all())

# Delete a goal from the database
@views.route('/<int:goal_id>/delete-goal/', methods=['GET', 'POST'])
@login_required
def delete_goal(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    goal_title = goal.title
    db.session.delete(goal)
    db.session.commit()
    flash(f"Deleted \"{goal_title}\" successfully", category="success")
    return redirect(url_for('views.manage_goals'))

with open(os.path.abspath(os.path.dirname(__file__)) + '/workout_quotes.txt', encoding="utf-8") as f:
    lines = f.read().splitlines()
@views.route("/manage-workouts", methods=['GET', 'POST'])
@login_required
def manage_workouts():
    if request.method == 'POST':
        workout_title = request.form.get('workout-title')
        workout_description = request.form.get('workout-description')

        # The immutable dictionary first has all the titles, then all the descriptions in corresponding order of the form. Put titles and
        # descriptions in lists
        added_input_titles = []
        added_input_descriptions = []
        request_form_data = dict(request.form)
        del request_form_data["workout-title"]
        del request_form_data["workout-description"]

        for name, value in request_form_data.items():
            if "title" in name:
                added_input_titles.append(value)
            elif "description" in name:
                added_input_descriptions.append(value)

        new_workout = Workout(title=workout_title, description=workout_description, user_id=current_user.id)
        db.session.add(new_workout)
        db.session.commit()
        for i in range(len(added_input_titles)):
            next_exercise_title = added_input_titles[i]
            next_exercise_description = added_input_descriptions[i]
            new_exercise = Exercise(title=next_exercise_title, description=next_exercise_description, workout_id=new_workout.id)
            db.session.add(new_exercise)
            db.session.commit()

        flash("Workout created successfully", category="success")
        return redirect(url_for("views.manage_workouts"))

    # Convert workout and exercise data attributes into dictionary to use later in the javascript
    # {workout1: {exercise1: description, exercise2: description}, workout2: {exercise1: description, exercise2: description}}
    workout_dictionary = {} # Contains all data about workouts
    for workout in Workout.query.filter_by(user=current_user):
        exercises = {} # Contains all exercises for the workout we are upto in the loop

        for exercise in workout.exercises:
            next_exercise = exercise
            next_exercise_title = exercise.title
            # If there is a duplicate title, then number that title and all further titles accordingly to avoid duplicate errors
            if next_exercise_title in exercises:
                next_title_number = 2
                next_exercise_title += str(next_title_number)
                while next_exercise_title in exercises:
                    next_exercise_title = next_exercise_title[:-1]
                    next_title_number += 1
                    next_exercise_title += str(next_title_number)
            exercises[next_exercise_title] = next_exercise.description # Add exercise title and description to exercises in the form {title: description}

        next_workout = workout
        next_workout_title = workout.title
        # Same as the exercise, make sure there are no duplicate workout titles
        if next_workout_title in workout_dictionary:
            next_title_number = 2
            next_workout_title += str(next_title_number)
            while next_workout_title in workout_dictionary:
                next_workout_title = next_workout_title[:-1]
                next_title_number += 1
                next_workout_title += str(next_title_number)
        workout_dictionary[next_workout_title] = [next_workout.description, exercises]

    the_workout_dictionary = escapejs(json.dumps(workout_dictionary))

    return render_template('manage_workouts.html', user=current_user, workouts=Workout.query.all(), random_quote=lines[random.randint(0, len(lines) - 1)], the_workout_dictionary=the_workout_dictionary)

# Edit a workout
@views.route('/edit-workout/', methods=['GET', 'POST'])
@login_required
def edit_workout():
    if request.method == 'POST':
        workout_id = int(request.form.get('workout-id'))
        workout = Workout.query.get_or_404(workout_id)
        original_workout_title = workout.title

        request_form_data = dict(request.form)
        print(request_form_data)
        workout.title = request.form.get('edit-workout-title')
        workout.description = request.form.get('edit-workout-description')
        for i in range(len(workout.exercises)):
            workout.exercises[i].title = request.form.get(f"edit-workout{workout_id}-exercise{i + 1}-title")
            workout.exercises[i].description = request.form.get(f"edit-workout{workout_id}-exercise{i + 1}-description")

        workout.user_id = current_user.id
        db.session.add(workout)
        db.session.commit()

        flash(f"Edited \"{original_workout_title}\" successfully", category="success")

        return redirect(url_for("views.manage_workouts"))

    return render_template('manage_workouts.html', user=current_user, workouts=Workout.query.all())

# Delete a workout, along with its exercises, from the database
@views.route('/<int:workout_id>/delete-workout/', methods=['GET', 'POST'])
@login_required
def delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)

    # Delete all exercises before deleting the workout
    for exercise in workout.exercises:
        db.session.delete(exercise)
        db.session.commit()

    workout_title = workout.title
    db.session.delete(workout)
    db.session.commit()
    flash(f"Deleted \"{workout_title}\" successfully", category="success")
    return redirect(url_for('views.manage_workouts'))


@views.route("/<int:workout_id>add-to-schedule/", methods=['GET', 'POST'])
@login_required
def add_to_schedule(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    if workout.add_to_schedule:
        flash(f"\"{workout.title}\" has already been added to schedule", category="error")
    else:
        workout.add_to_schedule = True
        db.session.add(workout)
        db.session.commit()
        flash(f"Added \"{workout.title}\" to schedule successfully!", category="success")
    return redirect(url_for('views.manage_workouts'))

@views.route("/<int:workout_id>remove-from-schedule/", methods=['GET', 'POST'])
@login_required
def remove_from_schedule(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    workout.add_to_schedule = False
    db.session.add(workout)
    db.session.commit()
    flash(f"Removed \"{workout.title}\" from schedule successfully", category="success")
    return redirect(url_for('views.manage_workouts'))


@views.route("/achievements")
def achievements():
    return render_template('achievements.html', user=current_user)