#!/usr/bin/env python3

from flask import Flask, request, jsonify, session, abort
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError
from models import db, Member, Book, BorrowRecord, Admin
from flask_cors import CORS
from datetime import datetime
import logging
from werkzeug.security import check_password_hash
app = Flask(__name__)

CORS(app, supports_credentials=True)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '123456789'  # Session secret key
app.json.compact = False

# Initialize extensions
migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Middleware to check if the user is logged in
@app.before_request
def handle_options_request():
    # Allow OPTIONS requests without authentication
    if request.method == "OPTIONS":
        return '', 200  # Return 200 OK for OPTIONS requests
@app.before_request
def check_if_logged_in():
    open_access_list = [
        'signup','login',
        'check_session','index',
        'get_books',"get_members",
        "logout","create_book",
        "update_book",'delete_book',
        'create_member','update_member',
        'delete_member','create_borrow_record',
        "get_borrow_record",'update_borrow_record',
        "delete_borrow_record",'admin_login'
    ]
    if request.endpoint not in open_access_list and not session.get('user_id'):
        logger.warning(f'Unauthorized access attempt to {request.endpoint}')
        return jsonify({'error': '401 Unauthorized'}), 401

# Routes
@app.route('/')
def index():
    return '<h1>Welcome to the Library Management System API</h1>'

# Sign-up route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not all(k in data for k in ('first_name', 'last_name', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_member = Member(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password=password_hash
    )
    try:
        db.session.add(new_member)
        db.session.commit()
        session['user_id'] = new_member.id
        return jsonify(new_member.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already exists'}), 400

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    member = Member.query.filter_by(email=email).first()
    if member and member.check_password(password):
        session['user_id'] = member.id
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Check session route
@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        member = Member.query.get(user_id)
        if member:
            return jsonify(member.to_dict()), 200
        return jsonify({'error': 'Member not found'}), 404
    return jsonify({'error': 'Unauthorized'}), 401

@app.route('/admin_login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email).first()

    if admin and check_password_hash(admin.password, password):
        session['user_id'] = admin.id
        session['user_role'] = 'admin'
        return jsonify({'message': 'Admin login successful'}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# Logout route
@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    
    return jsonify({'message': 'Logged out successfully'}), 204

# Books routes
@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()
    if not all(k in data for k in ('title', 'author')):
        return jsonify({'error': 'Missing required fields'}), 400
    new_book = Book(title=data['title'], author=data['author'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201

@app.route('/books', methods=['GET'])
def get_books():
    books = [book.to_dict() for book in Book.query.all()]
    return jsonify(books), 200

@app.route('/books/<int:id>', methods=['PATCH'])
def update_book(id):
    data = request.get_json()
    book = Book.query.get_or_404(id)
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    db.session.commit()
    return jsonify(book.to_dict()), 200

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully'}), 204

# Member routes
@app.route('/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    return jsonify([member.to_dict() for member in members])

@app.route('/members', methods=['POST'])
def create_member():
    data = request.get_json()
    if not all(k in data for k in ('first_name', 'last_name', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_member = Member(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password=password_hash
    )
    db.session.add(new_member)
    db.session.commit()
    return jsonify(new_member.to_dict()), 201


@app.route('/members/<int:id>', methods=['GET'])
def get_member(id):
    members= Member.query.get_or_404(id)
    return jsonify(members.to_dict()), 200

@app.route('/members/<int:id>', methods=['PATCH'])
def update_member(id):
    member = Member.query.get_or_404(id)
    data = request.get_json()

    if 'first_name' in data:
        member.first_name = data['first_name']
    if 'last_name' in data:
        member.last_name = data['last_name']
    if 'email' in data:
        member.email = data['email']
    if 'password' in data:
        member.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if 'admin_id' in data:
        if Admin.query.get(data['admin_id']):
            member.admin_id = data['admin_id']
        else:
            return jsonify({'error': 'Admin not found'}), 404

    db.session.commit()
    return jsonify(member.to_dict()), 200

@app.route('/members/<int:id>', methods=['DELETE'])
def delete_member(id):
    member = Member.query.get_or_404(id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Member deleted successfully'}), 204

# Borrow record routes
@app.route('/borrow_records', methods=['POST'])
def create_borrow_record():
    data = request.get_json()
    try:
        borrow_date = datetime.strptime(data['borrow_date'], '%Y-%m-%d')
        return_date = datetime.strptime(data.get('return_date'), '%Y-%m-%d') if data.get('return_date') else None

        new_borrow_record = BorrowRecord(
            borrow_date=borrow_date,
            return_date=return_date,
            condition_on_return=data['condition_on_return'],
            member_id=data['member_id'],
            book_id=data['book_id'],
            admin_id=data.get('admin_id')
        )

        db.session.add(new_borrow_record)
        db.session.commit()
        return jsonify(new_borrow_record.to_dict()), 201

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

@app.route('/borrow_records/<int:id>', methods=['GET'])
def get_borrow_record(id):
    borrow_record = BorrowRecord.query.get_or_404(id)
    return jsonify(borrow_record.to_dict()), 200

@app.route('/borrow_records/<int:id>', methods=['PATCH'])
def update_borrow_record(id):
    borrow_record = BorrowRecord.query.get(id)
    if not borrow_record:
        abort(404, description="Borrow record not found")

    data = request.get_json()

    if 'borrow_date' in data:
        try:
            borrow_record.borrow_date = datetime.strptime(data['borrow_date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    
    if 'return_date' in data:
        try:
            borrow_record.return_date = datetime.strptime(data['return_date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    
    if 'condition_on_return' in data:
        borrow_record.condition_on_return = data['condition_on_return']
    
    if 'book_id' in data:
        borrow_record.book_id = data['book_id']
    
    if 'member_id' in data:
        borrow_record.member_id = data['member_id']
    
    if 'admin_id' in data:
        borrow_record.admin_id = data['admin_id']

    db.session.commit()
    return jsonify(borrow_record.to_dict()), 200

@app.route('/borrow_records/<int:id>', methods=['DELETE'])
def delete_borrow_record(id):
    borrow_record = BorrowRecord.query.get_or_404(id)
    db.session.delete(borrow_record)
    db.session.commit()
    return jsonify({'message': 'Borrow record deleted successfully'}), 204

if __name__ == '__main__':
    app.run(port=5555, debug=True)
