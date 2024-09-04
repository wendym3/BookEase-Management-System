from flask import Blueprint, request, jsonify
from app import db
from models import Book, Member, BorrowRecord, Admin

bp = Blueprint('bp', __name__)

# CRUD operations for Books
@bp.route('/books', methods=['POST'])
def create_book():
    data = request.json
    book = Book(
        title=data['title'],
        author=data['author'],
        admin_id=data['admin_id']
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

@bp.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    return jsonify(book.to_dict())

@bp.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    data = request.json
    book = Book.query.get(id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    book.title = data['title']
    book.author = data['author']
    book.admin_id = data['admin_id']
    db.session.commit()
    return jsonify(book.to_dict())

@bp.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted'}), 200

# CRUD operations for Members
@bp.route('/members', methods=['POST'])
def create_member():
    data = request.json
    member = Member(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password=data['password'],
        admin_id=data['admin_id']
    )
    db.session.add(member)
    db.session.commit()
    return jsonify(member.to_dict()), 201

@bp.route('/members/<int:id>', methods=['GET'])
def get_member(id):
    member = Member.query.get(id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    return jsonify(member.to_dict())

@bp.route('/members/<int:id>', methods=['PUT'])
def update_member(id):
    data = request.json
    member = Member.query.get(id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    member.first_name = data['first_name']
    member.last_name = data['last_name']
    member.email = data['email']
    member.password = data['password']
    member.admin_id = data['admin_id']
    db.session.commit()
    return jsonify(member.to_dict())

@bp.route('/members/<int:id>', methods=['DELETE'])
def delete_member(id):
    member = Member.query.get(id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({'message': 'Member deleted'}), 200

# CRUD operations for Borrow Records
@bp.route('/borrow_records', methods=['POST'])
def create_borrow_record():
    data = request.json
    borrow_record = BorrowRecord(
        borrow_date=data['borrow_date'],
        return_date=data['return_date'],
        condition_on_return=data['condition_on_return'],
        book_id=data['book_id'],
        member_id=data['member_id'],
        admin_id=data['admin_id']
    )
    db.session.add(borrow_record)
    db.session.commit()
    return jsonify(borrow_record.to_dict()), 201

@bp.route('/borrow_records/<int:id>', methods=['GET'])
def get_borrow_record(id):
    borrow_record = BorrowRecord.query.get(id)
    if not borrow_record:
        return jsonify({'error': 'Borrow record not found'}), 404
    return jsonify(borrow_record.to_dict())

@bp.route('/borrow_records/<int:id>', methods=['PUT'])
def update_borrow_record(id):
    data = request.json
    borrow_record = BorrowRecord.query.get(id)
    if not borrow_record:
        return jsonify({'error': 'Borrow record not found'}), 404
    borrow_record.borrow_date = data['borrow_date']
    borrow_record.return_date = data['return_date']
    borrow_record.condition_on_return = data['condition_on_return']
    borrow_record.book_id = data['book_id']
    borrow_record.member_id = data['member_id']
    borrow_record.admin_id = data['admin_id']
    db.session.commit()
    return jsonify(borrow_record.to_dict())

@bp.route('/borrow_records/<int:id>', methods=['DELETE'])
def delete_borrow_record(id):
    borrow_record = BorrowRecord.query.get(id)
    if not borrow_record:
        return jsonify({'error': 'Borrow record not found'}), 404
    db.session.delete(borrow_record)
    db.session.commit()
    return jsonify({'message': 'Borrow record deleted'}), 200
