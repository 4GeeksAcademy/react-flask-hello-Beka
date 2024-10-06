"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST', 'OPTIONS'])
def register():
    # Manejo de la solicitud OPTIONS para CORS
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', 'https://musical-train-4jj54jqx56943j9qx-3000.app.github.dev')  # Ajusta según tu frontend
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    data = request.get_json()

    # Validar los datos
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Invalid data"}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Crear nuevo usuario
    new_user = User(
        email=data['email'],
        password=generate_password_hash(data['password']),  # Hashear la contraseña
        is_active=True  # O ajustar según tus necesidades
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Revertir la sesión en caso de error
        return jsonify({"message": "Failed to register user", "error": str(e)}), 500

    return jsonify({"message": "User registered successfully", "user": new_user.serialize()}), 201




@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Invalid data"}), 400
    
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):  # Compara la contraseña
        # Aquí puedes generar un token si lo deseas
        return jsonify({
            "message": "Login successful",
            "user": user.serialize(),  # Devuelve la información del usuario
            "token": "your_token_here"  # Si estás usando JWT, genera y devuelve el token
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401