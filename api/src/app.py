from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity, jwt_required, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import datetime

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['DEBUG'] = True
app.config['ENV'] = 'development'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "secret-key"

db.init_app(app)
jwt = JWTManager(app)
Migrate(app, db)
CORS(app)

@app.route('/')
def main():
    return jsonify({ 
        "urls": { 
            "main": "https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io",
            "register": "https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io/api/register",
            "login": "https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io/api/login",
            "users": "https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io/api/users"
        }
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    user = User()
    user.name = name
    user.email = email
    user.password = generate_password_hash(password)

    user.save()

    if user:
        access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(days=3))
        return jsonify({ 
            "status": "success",
            "access_token": access_token,
            "user": user.serialize()
        }), 201
    
    return jsonify({ "status": "failed", "user": {}}), 400

@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email: return jsonify({ "status": "failed", "msg": "Email is required!"}), 400
    if not password: return jsonify({ "status": "failed", "msg": "Password is required!"}), 400

    user_found = User.query.filter_by(email=email).first()

    if not user_found: return jsonify({ "status": "failed", "msg": "Bad email or password, please check!" }), 401
    if not check_password_hash(user_found.password, password): return jsonify({ "status": "failed", "msg": "Bad email or password, please check!" }), 401

    access_token = create_access_token(identity=user_found.id, expires_delta=datetime.timedelta(days=3))

    return jsonify({ 
            "status": "success",
            "access_token": access_token,
            "user": user_found.serialize()
        }), 200


if __name__ == '__main__':
    app.run()