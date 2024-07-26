from flask import Flask, Blueprint, render_template, request, redirect, url_for, flash, session
from flask_login import current_user, login_user, logout_user
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
import string
import random
import os

auth = Blueprint("auth", __name__)

# Text file for random password generator
with open(os.path.abspath(os.path.dirname(__file__)) + '/random_words_for_password.txt', encoding="utf8") as f:
    lines = f.read().splitlines()

# Random password generator
def generate_password():
    numbers_list = "1234567890"
    symbols_list = string.punctuation

    min_length = 9
    max_length = 25

    numbers_to_add = random.randint(1, 2)
    numbers_string = ""
    for _ in range(numbers_to_add):
        numbers_string += numbers_list[random.randint(0, len(numbers_list) - 1)]

    symbols_to_add = random.randint(1, 2)
    symbols_string = ""
    for _ in range(symbols_to_add):
        symbols_string += symbols_list[random.randint(0, len(symbols_list) - 1)]
    characters_added = numbers_to_add + symbols_to_add
    generated_password = ""

    # Grab the random words until the length of the words, numbers, and symbols are between min length and max length
    words = []
    while True:
        random_word = lines[random.randint(0, len(lines))]
        if characters_added + len(random_word) <= max_length:
            words.append(random_word[0].upper() + random_word[1:]) # Put uppercase letter at beginning of each random word to remember password more easily
            characters_added += len(random_word)

        if characters_added >= min_length:
            break

    words_symbols_numbers = words

    # Add the numbers (as one string) and the symbols (as one string) to a random word:
    # either at the beginning of that word or at the end, choose that randomly as well
    rand_numbers_word_idx = random.randint(0, len(words_symbols_numbers) - 1)
    rand_symbols_word_idx = random.randint(0, len(words_symbols_numbers) - 1)

    # 50% chance the numbers will be appended to the beginning of the random word
    if random.random() < .5:
        words_symbols_numbers[rand_numbers_word_idx] = numbers_string + words_symbols_numbers[rand_numbers_word_idx]
    # 50% chance the numbers will be appended to the end of the random word
    else:
        words_symbols_numbers[rand_numbers_word_idx] = words_symbols_numbers[rand_numbers_word_idx] + numbers_string

    # Same goes for the symbols
    if random.random() < .5:
        words_symbols_numbers[rand_symbols_word_idx] = symbols_string + words_symbols_numbers[rand_symbols_word_idx]
    else:
        words_symbols_numbers[rand_symbols_word_idx] = words_symbols_numbers[rand_symbols_word_idx] + symbols_string

    # add the words, numbers, and symbols to the password
    for next_str in words_symbols_numbers:
        generated_password += next_str

    return generated_password

@auth.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    generated_password = session.get('generated_password', "")
    username = session.get('username', "")
    password = session.get('password', "")
    confirmed_password = session.get('confirmed_password', "")

    submit_event = request.form.get('sign-up-submission-type')
    print(f"Submit event: {submit_event}")

    if request.method == 'POST':
        # Check if the user wants their password to be generated randomly, save user info except passwords
        username = request.form.get('sign-up-username')
        password = request.form.get('sign-up-password')
        confirmed_password = request.form.get('sign-up-confirm-password')

        if "password-generator" in request.form and submit_event != "enter":
            generated_password = generate_password()
        elif not username or not password or not confirmed_password:
            flash("Please fill out the entire form", category="error")
        else:
            # Check if the username already exists or if the password isn't strong enough, if this criteria is met, create the account
            if db.session.query(User.id).filter_by(username=username).first():
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

                    # Add user to website and log them in
                    new_user = User(username=username, password=generate_password_hash(password, method="scrypt"))
                    db.session.add(new_user)
                    db.session.commit()
                    login_user(new_user, remember=True)
                    flash(f"Hello {username}!", category="success")

                    session.pop('generated_password', None)
                    session.pop('username', None)
                    session.pop('password', None)
                    session.pop('confirmed_password', None)

                    return redirect(url_for('views.home'))

        if generated_password and "password-generator" in request.form and submit_event != "enter":
            flash(f"Your new generated password is {generated_password}", category="success")
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

