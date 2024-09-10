#!/usr/bin/env python3

from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError
from models import db, Member, Book, BorrowRecord

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '123456789'  # Session secret key
app.json.compact = False

# Initialize extensions
migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)

# Middleware to check if the user is logged in
@app.before_request
def check_if_logged_in():
    open_access_list = [
        'signup',
        'login',
        'check_session',
        'index'
    ]
    if request.endpoint not in open_access_list and not session.get('user_id'):
        return jsonify({'error': '401 Unauthorized'}), 401

# Routes
@app.route('/')
def index():
    return '<h1>Welcome to the Library Management System API</h1>'

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    member = Member.query.filter_by(email=data['email']).first()
    if member and bcrypt.check_password_hash(member.password, data['password']):
        session['user_id'] = member.id
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        member = Member.query.get_or_404(user_id)
        return jsonify(member.to_dict()), 200
    return jsonify({'error': 'Unauthorized'}), 401

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 204

@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()
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

@app.route('/members', methods=['POST'])
def create_member():
    data = request.get_json()
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
    member = Member.query.get_or_404(id)
    return jsonify(member.to_dict()), 200

@app.route('/members/<int:id>', methods=['PATCH'])
def update_member(id):
    data = request.get_json()
    member = Member.query.get_or_404(id)
    member.first_name = data.get('first_name', member.first_name)
    member.last_name = data.get('last_name', member.last_name)
    member.email = data.get('email', member.email)
    member.password = bcrypt.generate_password_hash(data.get('password', member.password)).decode('utf-8')
    db.session.commit()
    return jsonify(member.to_dict()), 200

@app.route('/members/<int:id>', methods=['DELETE'])
def delete_member(id):
    member = Member.query.get_or_404(id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Member deleted successfully'}), 204

@app.route('/borrow_records', methods=['POST'])
def create_borrow_record():
    data = request.get_json()
    new_borrow_record = BorrowRecord(
        borrow_date=data['borrow_date'],
        return_date=data.get('return_date'),
        condition_on_return=data['condition_on_return'],
        member_id=data['member_id'],
        book_id=data['book_id']
    )
    db.session.add(new_borrow_record)
    db.session.commit()
    return jsonify(new_borrow_record.to_dict()), 201

@app.route('/borrow_records/<int:id>', methods=['GET'])
def get_borrow_record(id):
    borrow_record = BorrowRecord.query.get_or_404(id)
    return jsonify(borrow_record.to_dict()), 200

@app.route('/borrow_records/<int:id>', methods=['PATCH'])
def update_borrow_record(id):
    data = request.get_json()
    borrow_record = BorrowRecord.query.get_or_404(id)
    borrow_record.borrow_date = data.get('borrow_date', borrow_record.borrow_date)
    borrow_record.return_date = data.get('return_date', borrow_record.return_date)
    borrow_record.condition_on_return = data.get('condition_on_return', borrow_record.condition_on_return)
    borrow_record.member_id = data.get('member_id', borrow_record.member_id)
    borrow_record.book_id = data.get('book_id', borrow_record.book_id)
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
