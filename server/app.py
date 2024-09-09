#!/usr/bin/env python3

from flask import Flask, request, jsonify, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from models import db, Member, Book, BorrowRecord

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(app)

@app.before_request
def check_if_logged_in():
    open_access_list = [
        'signup',
        'login',
        'check_session'
    ]
    if (request.endpoint) not in open_access_list and (not session.get('user_id')):
        return {'error': '401 Unauthorized'}, 401

# Resource for Home Endpoint
class Home(Resource):
    def get(self):
        response_dict = {
            "message": "Welcome to the Library Management System API"
        }
        return make_response(response_dict, 200)

api.add_resource(Home, '/')

# Resource for Signup
class Signup(Resource):
    def post(self):
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
            return {'message': 'Email already exists'}, 400

api.add_resource(Signup, '/signup')

# Resource for Login
class Login(Resource):
    def post(self):
        data = request.get_json()
        member = Member.query.filter_by(email=data['email']).first()
        if member and bcrypt.check_password_hash(member.password, data['password']):
            access_token = create_access_token(identity={'user_id': member.id, 'is_admin': member.is_admin})
            session['user_id'] = member.id
            return jsonify({'access_token': access_token}), 200
        return {'message': 'Invalid credentials'}, 401

api.add_resource(Login, '/login')

# Resource for Check Session
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            member = Member.query.get_or_404(user_id)
            return jsonify(member.to_dict()), 200
        return {}, 401

api.add_resource(CheckSession, '/check_session')

# Resource for Logout
class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204

api.add_resource(Logout, '/logout')

# Resource for Books
class Books(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_book = Book(title=data['title'], author=data['author'])
        db.session.add(new_book)
        db.session.commit()
        return jsonify(new_book.to_dict()), 201

    @jwt_required()
    def get(self):
        books = [book.to_dict() for book in Book.query.all()]
        return jsonify(books), 200

    @jwt_required()
    def put(self, id):
        data = request.get_json()
        book = Book.query.get_or_404(id)
        book.title = data['title']
        book.author = data['author']
        db.session.commit()
        return jsonify(book.to_dict()), 200

    @jwt_required()
    def delete(self, id):
        book = Book.query.get_or_404(id)
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully'}), 204

api.add_resource(Books, '/books', '/books/<int:id>')

# Resource for Members
class Members(Resource):
    @jwt_required()
    def post(self):
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

    @jwt_required()
    def get(self, id):
        member = Member.query.get_or_404(id)
        return jsonify(member.to_dict()), 200

    @jwt_required()
    def put(self, id):
        data = request.get_json()
        member = Member.query.get_or_404(id)
        member.first_name = data['first_name']
        member.last_name = data['last_name']
        member.email = data['email']
        member.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        db.session.commit()
        return jsonify(member.to_dict()), 200

    @jwt_required()
    def delete(self, id):
        member = Member.query.get_or_404(id)
        db.session.delete(member)
        db.session.commit()
        return jsonify({'message': 'Member deleted successfully'}), 204

api.add_resource(Members, '/members', '/members/<int:id>')

# Resource for Borrow Records
class BorrowRecords(Resource):
    @jwt_required()
    def post(self):
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

    @jwt_required()
    def get(self, id):
        borrow_record = BorrowRecord.query.get_or_404(id)
        return jsonify(borrow_record.to_dict()), 200

    @jwt_required()
    def put(self, id):
        data = request.get_json()
        borrow_record = BorrowRecord.query.get_or_404(id)
        borrow_record.borrow_date = data['borrow_date']
        borrow_record.return_date = data['return_date']
        borrow_record.condition_on_return = data['condition_on_return']
        borrow_record.member_id = data['member_id']
        borrow_record.book_id = data['book_id']
        db.session.commit()
        return jsonify(borrow_record.to_dict()), 200

    @jwt_required()
    def delete(self, id):
        borrow_record = BorrowRecord.query.get_or_404(id)
        db.session.delete(borrow_record)
        db.session.commit()
        return jsonify({'message': 'Borrow record deleted successfully'}), 204

api.add_resource(BorrowRecords, '/borrow_records', '/borrow_records/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)



# Key Components:
# Home Resource: Provides a welcome message.
# Signup Resource: Handles user registration with hashed passwords.
# Login Resource: Authenticates users and provides JWT tokens.
# CheckSession Resource: Checks if the current session is valid.
# Logout Resource: Ends the current user session.
# Books, Members, BorrowRecords Resources: Implement CRUD operations for books, members, and borrowing records, protected by JWT authentication.