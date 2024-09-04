
from flask import Flask, jsonify, make_response, request, session
from flask_migrate import Migrate
from models import db, Member, Book, BorrowRecord
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

@app.route('/members', methods=['GET'])
def get_members():
    members = [member.to_dict() for member in Member.query.all()]
    return make_response(jsonify(members), 200)

@app.route('/books', methods=['GET'])
def get_books():
    books = [book.to_dict() for book in Book.query.all()]
    return make_response(jsonify(books), 200)

@app.route('/borrow_records', methods=['GET'])
def get_borrow_records():
    borrow_records = [record.to_dict() for record in BorrowRecord.query.all()]
    return make_response(jsonify(borrow_records), 200)

@app.route('/members', methods=['POST'])
def create_member():
    data = request.get_json()
    try:
        member = Member(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(member)
        db.session.commit()
        return make_response(jsonify(member.to_dict()), 201)
    except IntegrityError:
        db.session.rollback()
        return {'message': 'Email already exists'}, 400

@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()
    book = Book(
        title=data['title'],
        author=data['author']
    )
    db.session.add(book)
    db.session.commit()
    return make_response(jsonify(book.to_dict()), 201)

@app.route('/borrow_records', methods=['POST'])
def create_borrow_record():
    data = request.get_json()
    borrow_record = BorrowRecord(
        borrow_date=data['borrow_date'],
        return_date=data.get('return_date'),
        condition_on_return=data['condition_on_return'],
        member_id=data['member_id'],
        book_id=data['book_id']
    )
    db.session.add(borrow_record)
    db.session.commit()
    return make_response(jsonify(borrow_record.to_dict()), 201)

if __name__ == '__main__':
    app.run(port=5555)
