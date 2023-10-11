from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_manager, LoginManager

db = SQLAlchemy()

DB_NAME = 'database.db'

def create_app():
    app = Flask(__name__, static_url_path='/static')
    app.secret_key = "sdlklkjsdflk;"
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    from .views import views
    from .auth import auth
    from .models import User

    app.register_blueprint(views)
    app.register_blueprint(auth)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.sign_up'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return models.User.query.get(int(id))

    with app.app_context():
        db.create_all()

    return app