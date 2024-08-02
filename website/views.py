# 'views.py' handles the routes proceeding user authentication

import os
import random
import json
import math

from flask import Blueprint, render_template, flash, redirect, url_for, request
from flask_login import current_user
from flask_security import login_required

from .models import Goal, Workout, Exercise, GoalAchieved
from . import db

from datetime import datetime, timezone, timedelta
from django.utils.html import escapejs

views = Blueprint('views', __name__)

GOALS_ACHIEVED_UNTIL_AWARD = 3

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

            # If user missed a week, delete the goal
            if current_week - goal.weeks_completed >= 2:
                db.session.delete(goal)
                db.session.commit()
                flash(f"You have missed one or more weeks on \"{goal.title}\", thus failing to meet its requirements. Goal deleted", category="error")
                return redirect(url_for('views.manage_goals'))
            
            # If its next week reset weeks finished status
            elif current_week - goal.weeks_completed == 1:
                goal.is_week_finished = False

    rate = 0
    duration = 0
    if request.method == 'POST':
        utc_now = datetime.now(timezone.utc)

        # Add built in button goal if user clicks one of the buttons on the form
        if "workout-4-weeks" in request.form:
            title, goal_type, description = "Workout for 4 weeks", "Duration", "Workout consistently for 4 weeks 4 times/week"
            rate, duration, weeks_completed = 4, 4, 0
            end_date = utc_now + timedelta(days=28)
            message = "Built in goal created successfully!"
        
        else:
            if "bench-PR" in request.form or "lose-weight" in request.form:
                rate, duration, weeks_completed, end_date = None, None, None, None

                if "bench-PR" in request.form:
                    title, goal_type, description = "Bench PR", "New PR", "Bench your bodyweight ex: if you are 150lbs, you need to bench 150lbs"

                elif "lose-weight" in request.form:
                    title, goal_type, description = "Lose 10% of your weight", "Lose/Gain Weight", "Lose 10% of your bodyweight ex: if you are 100lbs, you need to get to 90lbs"
                
                message = "Built in goal created successfully!"

            else:
                # Add custom goal if user chooses custom goal on the form
                title = request.form.get('goal-title')
                goal_type = request.form.get('goal-type')
                description = request.form.get('goal-description')

                if goal_type == "Duration":
                    rate = int(request.form.get('goal-rate'))
                    duration = int(request.form.get('goal-duration'))
                    weeks_completed = 0
                    end_date = utc_now + timedelta(days=7 * duration)

                else:
                    rate, duration, weeks_completed, end_date = None, None, None, None
                
                message = "Custom goal created successfully!"

        new_goal = Goal(user_id=current_user.id, title=title, type=goal_type, description=description,
                        rate=rate, duration=duration, weeks_completed=weeks_completed, date_started=utc_now,
                        end_date=end_date)
        db.session.add(new_goal)
        db.session.commit()
        flash(message, category="success")
        return redirect(url_for('views.manage_goals'))

    return render_template('manage_goals.html', user=current_user, goals=Goal.query.all())

@views.route('/edit-goal/', methods=['GET', 'POST'])
@login_required
def edit_goal():
    if request.method == 'POST':
        goal_id = int(request.form.get('goal-id'))
        goal = Goal.query.get_or_404(goal_id)
        original_goal_title = goal.title

        goal.title = request.form.get('edit-goal-title')
        goal.description = request.form.get('edit-goal-description')

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

    # Ensure the user hasn't missed a week first. If they have, delete the goal
    if current_week - goal.weeks_completed >= 2:
        db.session.delete(goal)
        db.session.commit()
        flash(f"You have missed one or more weeks on \"{goal.title}\", thus failing to meet its requirements. Goal deleted", category="error")
        return redirect(url_for('views.manage_goals'))
    
    # If a user finishes all weeks, mark the goal complete
    elif weeks_completed == goal.duration:
        return redirect(url_for('views.mark_goal_complete', goal_id=goal_id))
    
    # Otherwise, this means they've checked off another week (they haven't finished the goal yet)
    else:
        goal.weeks_completed = weeks_completed
        if goal.weeks_completed == current_week:
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
    goal_type = goal.type
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

    # Tell the user if they just achieved a built in award or how far they are from one
    goal_type_achievements_num = len(list(GoalAchieved.query.filter_by(user=current_user, type=goal_type)))
    award_message = ""

    if goal_type_achievements_num == GOALS_ACHIEVED_UNTIL_AWARD:
        flash(f"Congratulations, you have achieved a \"{goal_type}\" award! You can now view this in \"Achievements\"!", category="award")
    
    elif goal_type_achievements_num < GOALS_ACHIEVED_UNTIL_AWARD:
        award_message = f" You are {GOALS_ACHIEVED_UNTIL_AWARD - goal_type_achievements_num} goal(s) achieved of type \"{goal_type}\" away from a built in award for \"{goal_type}\"!"

    flash(f"Completed \"{goal_title}\"!{award_message} You can view this goal achieved now in \"Achievements\".", category="success")
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

        # Then, add each title and description to a new exercise
        for i in range(len(added_input_titles)):
            next_exercise_title = added_input_titles[i]
            next_exercise_description = added_input_descriptions[i]
            new_exercise = Exercise(title=next_exercise_title, description=next_exercise_description, workout_id=new_workout.id)
            db.session.add(new_exercise)
            db.session.commit()

        flash("Workout created successfully", category="success")
        return redirect(url_for("views.manage_workouts"))

    # Store days with their corresponding workouts to display on schedule
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

    return render_template('manage_workouts.html', user=current_user, workouts=Workout.query.all(), random_quote=random.choice(lines), workout_exercises=escapejs(json.dumps(workout_exercises)), days_order=DAYS_ORDER, days_workouts=days_workouts)

@views.route('/edit-workout/', methods=['GET', 'POST'])
@login_required
def edit_workout():
    if request.method == 'POST':
        workout_id = int(request.form.get('workout-id'))
        workout = Workout.query.get_or_404(workout_id)
        original_workout_title = workout.title

        # First, set the workout title and description to what user entered
        workout.title = request.form.get('edit-workout-title')
        workout.description = request.form.get('edit-workout-description')

        # Then, delete all exercises for this workout 
        for i in range(len(workout.exercises)):
            db.session.delete(workout.exercises[i])

        # Finally, add the workout and all the exercises
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

    # When workout was scheduled for one day and that one day was removed, there are no days on schedule
    if not workout_days_scheduled:
        workout.add_to_schedule = False

    workout.set_days_scheduled(workout_days_scheduled)
    db.session.add(workout)
    db.session.commit()

    flash(f"Removed \"{workout.title}\" on \"{day}\" from schedule successfully", category="success")
    return redirect(url_for('views.manage_workouts'))

@views.route("/achievements")
def achievements():
    # Determine the awards the user earns
    awards = []
    new_PR_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="New PR"))
    duration_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="Duration"))
    weight_goals_achieved = list(GoalAchieved.query.filter_by(user=current_user, type="Lose/Gain Weight"))

    if len(new_PR_goals_achieved) >= GOALS_ACHIEVED_UNTIL_AWARD:
        awards.append("New PR")
    
    if len(duration_goals_achieved) >= GOALS_ACHIEVED_UNTIL_AWARD:
        awards.append("Duration")
    
    if len(weight_goals_achieved) >= GOALS_ACHIEVED_UNTIL_AWARD:
        awards.append("Lose/Gain Weight")

    return render_template('achievements.html', user=current_user, goals_achieved=GoalAchieved.query.all(), awards=awards)