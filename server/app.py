#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request
from flask_migrate import Migrate
from models import db, Member, Book, BorrowRecord

app = Flask(__name__)
app.secret_key = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

@app.route('/members', methods=['GET', 'POST'])
def handle_members():
    if request.method == 'POST':
        data = request.get_json()
        new_member = Member(name=data['name'])
        db.session.add(new_member)
        db.session.commit()
        return jsonify(new_member.to_dict()), 201

    members = [member.to_dict() for member in Member.query.all()]
    return jsonify(members), 200

@app.route('/books', methods=['GET', 'POST'])
def handle_books():
    if request.method == 'POST':
        data = request.get_json()
        new_book = Book(title=data['title'], author=data['author'])
        db.session.add(new_book)
        db.session.commit()
        return jsonify(new_book.to_dict()), 201

    books = [book.to_dict() for book in Book.query.all()]
    return jsonify(books), 200

@app.route('/borrow_records', methods=['GET', 'POST'])
def handle_borrow_records():
    if request.method == 'POST':
        data = request.get_json()
        new_borrow_record = BorrowRecord(
            member_id=data['member_id'],
            book_id=data['book_id'],
            return_date=data.get('return_date'),
            condition_on_return=data.get('condition_on_return')
        )
        db.session.add(new_borrow_record)
        db.session.commit()
        return jsonify(new_borrow_record.to_dict()), 201

    borrow_records = [record.to_dict() for record in BorrowRecord.query.all()]
    return jsonify(borrow_records), 200

if __name__ == '__main__':
    app.run(port=5555)
