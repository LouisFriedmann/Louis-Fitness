# 'auth.py' handles the routes for user authentication

import string

from flask import Blueprint, render_template, redirect, url_for, flash, session, request
from flask_login import login_user, logout_user, current_user

from .models import User
from . import db

from werkzeug.security import generate_password_hash, check_password_hash
from .generate_password import generate_password

auth = Blueprint("auth", __name__)

@auth.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    # Maintain info in session just in case it is deleted on the frontend
    generated_password = session.get('generated_password', "")
    username = session.get('username', "")
    password = session.get('password', "")
    confirmed_password = session.get('confirmed_password', "")

    submit_event = request.form.get('sign-up-submission-type')

    if request.method == 'POST':
        # Check if the user wants their password to be generated randomly, save user info except password
        username = request.form.get('sign-up-username')
        password = request.form.get('sign-up-password')
        confirmed_password = request.form.get('sign-up-confirm-password')

        '''
            Check if user is trying to generate password. If not, create the account if user 
            filled out the entire form and user doesn't already exist and password meets all 
            criteria
        '''
        if "password-generator" in request.form and submit_event != "enter":
            generated_password = generate_password()

        elif not username or not password or not confirmed_password:
            flash("Please fill out the entire form", category="error")

        elif db.session.query(User.id).filter_by(username=username).first():
            flash(f"A user with the username \"{username}\" already exists, please choose another username", category="error")

        elif password != confirmed_password:
            flash("Passwords don't match", category="error")

        elif len(password) <= 8:
            flash("Password must be more than 8 characters long", category="error")

        elif password.upper() == password:
            flash("Password must have at least one lowercase letter in it", category="error")

        elif password.lower() == password:
            flash("Password must have at least one uppercase letters in it", category="error")

        else:
            password_has_number = False
            password_has_symbol = False
            for character in password:
                if character in "1234567890":
                    password_has_number = True
                elif character in string.punctuation:
                    password_has_symbol = True

            if not password_has_symbol:
                flash("Password must have at least one symbol", category="error")

            elif not password_has_number:
                flash("Password must have at least one number", category="error")

            else:
                # Add user to website, log them in, and redirect them to home page
                new_user = User(username=username, password=generate_password_hash(password, method="scrypt"))
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                flash(f"Hello {username}!", category="success")

                # Remove user data from session since authentication is complete
                session.pop('generated_password', None)
                session.pop('username', None)
                session.pop('password', None)
                session.pop('confirmed_password', None)

                return redirect(url_for('views.home'))

        if generated_password and "password-generator" in request.form and submit_event != "enter":
            flash(f"Your new generated password is {generated_password}", category="success")

            # When user generates password, user info is deleted on frontend. Save it here to pass to 'render_template'
            session['generated_password'] = generated_password
            session['username'] = username
            session['password'] = password
            session['confirmed_password'] = confirmed_password
            return redirect(url_for('auth.sign_up', user=current_user, generated_password=generated_password, username=username, password=password, confirmed_password=confirmed_password))

    return render_template('sign_up.html', user=current_user, generated_password=generated_password, username=username, password=password, confirmed_password=confirmed_password)

@auth.route("/login", methods=['GET', 'POST'])
def login():
    username = ""

    if request.method == 'POST':
        username = request.form.get('login-username')
        password = request.form.get('login-password')
        user_account = User.query.filter_by(username=username).first()

        # Check if user filled out form and user exists and password is correct. If so, redirect user to home page
        if not username or not password:
            flash("Please fill out the entire form", category="error")

        elif user_account:
            if check_password_hash(pwhash=user_account.password, password=password):
                login_user(user_account, remember=True)
                flash(f"Hello {username}!", category="success")
                return redirect(url_for('views.home'))
            
            else:
                flash("Incorrect password, please try again", category="error")

        else:
            flash(f"There is no account with the username \"{username}\"", category='error')

    return render_template('login.html', user=current_user, username=username)

@auth.route("/logout")
def logout():
    logout_user()
    flash("Logged out successfully", category="success")
    return redirect(url_for('auth.sign_up'))

@auth.route("/terms-of-use", methods=["GET", "POST"])
def terms_of_use():
    return render_template('terms_of_use.html', user=current_user)

@auth.route("/lol", methods=["GET", "POST"])
def lol():
    return render_template('lol.html', user=current_user)

@auth.route("/privacy-policy", methods=["GET", "POST"])
def privacy_policy():
    return render_template('privacy_policy.html', user=current_user)

