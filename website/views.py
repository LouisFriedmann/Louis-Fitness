# 'views.py' handles the routes proceeding user authentication

from flask import Flask, Blueprint, render_template, request, flash, redirect, url_for
from flask_login import current_user, LoginManager, login_manager
from flask_security import login_required
import os
import random
from .models import Goal, User, Workout, Exercise, GoalAchieved
from . import db
from datetime import datetime, timezone, timedelta
import json
from django.utils.html import escapejs
import math

views = Blueprint('views', __name__)

@views.route("/")
@login_required
def home():
    return render_template('home.html', user=current_user)

@views.route("/manage-goals", methods=['GET', 'POST'])
@login_required
def manage_goals():
    # Handle if the time goes off for the week for duration-based goals
    for goal in Goal.query.filter_by(user=current_user):
        if goal.type == "Duration":
            current_week = math.ceil(((datetime.now(timezone.utc) - goal.date_started.replace(tzinfo=timezone.utc)).days + 1) / 7)

            # Check if the user missed a week on their duration goal or if its the next week
            if current_week - goal.weeks_completed >= 2:
                db.session.delete(goal)
                db.session.commit()
                flash(f"You have missed one or more weeks on \"{goal.title}\", thus failing to meet its requirements. Goal deleted", category="error")
                return redirect(url_for('views.manage_goals'))
            
            elif current_week - goal.weeks_completed == 1:
                goal.is_week_finished = False # Reset the week

    rate = 0
    duration = 0
    if request.method == 'POST':
        # Add built-in button workouts to database if the user presses one ONLY ONCE PER BUTTON
        utc_now = datetime.now(timezone.utc)
        if "workout-4-weeks" in request.form:
            new_goal = Goal(title="Workout for 4 weeks",
                            type="Duration",
                            description="Workout consistently for 4 weeks 4 times/week",
                            rate=4,
                            duration=4,
                            end_date=utc_now + timedelta(days=28), # End date is the day after the number of days given by user
                            date_started=utc_now,
                            weeks_completed=0,
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
                            date_started=utc_now,
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
                            date_started=utc_now,
                            user_id=current_user.id)
            db.session.add(new_goal)
            db.session.commit()
            flash("Built in goal created successfully!", category="success")
            return redirect(url_for('views.manage_goals'))
        else:
            title = request.form.get('goal-title')
            goal_type = request.form.get('goal-type')
            description = request.form.get('goal-description')

            if goal_type == "Duration":
                rate = int(request.form.get('goal-rate'))
                duration = int(request.form.get('goal-duration'))
                new_goal = Goal(title=title, type=goal_type, description=description, rate=rate, duration=duration, weeks_completed=0, end_date=utc_now + timedelta(days=7 * duration), date_started=utc_now, user_id=current_user.id)
            else:
                new_goal = Goal(title=title, type=goal_type, description=description, rate=None, duration=None, end_date=None, date_started=utc_now, user_id=current_user.id)

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

        goal.title = request.form.get('edit-goal-title')
        goal.description = request.form.get('edit-goal-description')

        goal.user_id = current_user.id
        db.session.add(goal)
        db.session.commit()

        flash(f"Edited \"{original_goal_title}\" successfully", category="success")

        return redirect(url_for("views.manage_goals"))

    return render_template('manage_goals.html', user=current_user, goals=Goal.query.all())

# Handle what to do when user finishes week on goal of type 'Duration'
@views.route('/<int:goal_id>/handle-finish-week/', methods=['GET', 'POST'])
@login_required
def handle_finish_week(goal_id):
    goal = Goal.query.get_or_404(goal_id)
    weeks_completed = goal.weeks_completed + 1
    current_week = math.ceil(((datetime.now(timezone.utc) - goal.date_started.replace(tzinfo=timezone.utc)).days + 1) / 7)

    # Ensure the user hasn't missed a week first
    if current_week - goal.weeks_completed >= 2:
        db.session.delete(goal)
        db.session.commit()
        flash(f"You have missed one or more weeks on \"{goal.title}\", thus failing to meet its requirements. Goal deleted", category="error")
        return redirect(url_for('views.manage_goals'))
    
    # If a user finishes all weeks
    elif weeks_completed == goal.duration:
        return redirect(url_for('views.mark_goal_complete', goal_id=goal_id))
    
    # Otherwise, this means they've checked off another week (they haven't finished the goal yet)
    else:
        goal.weeks_completed = weeks_completed
        goal.is_week_finished = True
        db.session.add(goal)
        db.session.commit()
        flash("Week completed successfully!", category="success")
        return redirect(url_for('views.manage_goals'))

# Mark a goal as completed
@views.route('/<int:goal_id>/mark-goal-complete/', methods=['GET', 'POST'])
@login_required
def mark_goal_complete(goal_id):
    # Add the achievement
    goal = Goal.query.get_or_404(goal_id)
    goal_title = goal.title
    new_goal_achieved = GoalAchieved(title=goal.title,
                            type=goal.type,
                            description=goal.description,
                            rate=goal.rate,
                            duration=goal.duration,
                            date_started=goal.date_started,
                            date_finished=datetime.now(timezone.utc),
                            user_id=current_user.id)
    db.session.add(new_goal_achieved)
    db.session.commit()

    # Delete the goal
    db.session.delete(goal)
    db.session.commit()

    flash(f"Completed \"{goal_title}\"! You can view this now in \"Achievements\"", category="success")
    return redirect(url_for('views.manage_goals'))

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

DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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

    workouts = Workout.query.filter_by(user=current_user).all()
    days_workouts = dict() # Stores a day with its corresponding workouts
    for workout in workouts:
        if workout.add_to_schedule:
            for day in workout.get_days_scheduled():
                if day in days_workouts:
                    days_workouts[day].append(workout)
                else:
                    days_workouts[day] = [workout]

    # To pass into javascript to access exercise titles and descriptions for each exercise in each workout
    workout_exercises = {workout.id: [[exercise.title, exercise.description] for exercise in workout.exercises] for workout in Workout.query.filter_by(user=current_user)}

    return render_template('manage_workouts.html', user=current_user, workouts=Workout.query.all(), random_quote=lines[random.randint(0, len(lines) - 1)], workout_exercises=escapejs(json.dumps(workout_exercises)), days_order=DAYS_ORDER, days_workouts=days_workouts)

# Edit a workout
@views.route('/edit-workout/', methods=['GET', 'POST'])
@login_required
def edit_workout():
    if request.method == 'POST':
        workout_id = int(request.form.get('workout-id'))
        workout = Workout.query.get_or_404(workout_id)
        original_workout_title = workout.title

        workout.title = request.form.get('edit-workout-title')
        workout.description = request.form.get('edit-workout-description')

        # First, delete all exercises for this workout
        for i in range(len(workout.exercises)):
            db.session.delete(workout.exercises[i])

        # Then, add the workout and all the exercises
        added_input_titles = []
        added_input_descriptions = []
        request_form_data = dict(request.form)
        del request_form_data["edit-workout-title"]
        del request_form_data["edit-workout-description"]

        for name, value in request_form_data.items():
            if "title" in name:
                added_input_titles.append(value)
            elif "description" in name:
                added_input_descriptions.append(value)

        db.session.add(workout)
        db.session.commit()
        for i in range(len(added_input_titles)):
            next_exercise_title = added_input_titles[i]
            next_exercise_description = added_input_descriptions[i]
            new_exercise = Exercise(title=next_exercise_title, description=next_exercise_description, workout_id=workout.id)
            db.session.add(new_exercise)
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

@views.route("/add-to-schedule", methods=['GET', 'POST'])
@login_required
def add_to_schedule():
    workout_id = int(request.form.get("scheduled-workout"))
    workout = Workout.query.get_or_404(workout_id)

    if request.method == "POST":
        workout.add_to_schedule = True
        day_name_list = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        days_scheduled = [request.form.get(name) for name in day_name_list if request.form.get(name)]
        print(days_scheduled)
        workout.set_days_scheduled(days_scheduled)
        db.session.add(workout)
        db.session.commit()
        flash(f"Added \"{workout.title}\" to schedule successfully!", category="success")
    return redirect(url_for('views.manage_workouts'))

@views.route("/<int:workout_id>/<string:day>/remove-from-schedule/", methods=['GET', 'POST'])
@login_required
def remove_from_schedule(workout_id, day):
    workout = Workout.query.get_or_404(workout_id)
    workout_days_scheduled = workout.get_days_scheduled()
    workout_days_scheduled.remove(day)
    if not workout_days_scheduled:
        workout.add_to_schedule = False

    workout.set_days_scheduled(workout_days_scheduled)
    db.session.add(workout)
    db.session.commit()
    flash(f"Removed \"{workout.title}\" on \"{day}\" from schedule successfully", category="success")
    return redirect(url_for('views.manage_workouts'))

@views.route("/achievements")
def achievements():
    # db.drop_all()

    # Determine the awards the user earns
    awards = []
    new_PR_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="New PR"))
    duration_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="Duration"))
    weight_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="Lose/Gain Weight"))

    if len(new_PR_goals_achieved) >= 3:
        awards.append("New PR")
    
    if len(duration_goals_achieved) >= 3:
        awards.append("Duration")
    
    if len(weight_goals_achieved) >= 3:
        awards.append("Lose/Gain Weight")

    return render_template('achievements.html', user=current_user, goals_achieved=GoalAchieved.query.all(), awards=awards)