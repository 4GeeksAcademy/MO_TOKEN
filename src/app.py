import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS  # Importa Flask-CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///your_database.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("FLASK_APP_KEY", "super-secret-key")  # Cambiar por una clave más segura en producción

# Configurar CORS
CORS(app)

jwt = JWTManager(app)
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Añadir el administrador
setup_admin(app)

# Añadir los comandos
setup_commands(app)

# Añadir todos los endpoints de la API con un prefijo "api"
app.register_blueprint(api, url_prefix='/api')

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 400

        new_user = User(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({"msg": "Internal Server Error"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email, password=password).first()
        if not user:
            return jsonify({"msg": "Bad email or password"}), 401
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"msg": "Internal Server Error"}), 500

@app.route('/api/private', methods=['GET'])
@jwt_required()
def private():
    try:
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200
    except Exception as e:
        print(f"Error in private: {e}")
        return jsonify({"msg": "Internal Server Error"}), 500

# Manejar/serializar errores como un objeto JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar sitemap con todos tus endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Cualquier otro endpoint tratará de servirlo como un archivo estático
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar la memoria caché
    return response

# Esto solo se ejecuta si se ejecuta `$ python src/main.py`
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
