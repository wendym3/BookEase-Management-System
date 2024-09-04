#!/usr/bin/env python3

from app import app
from models import db, Member, Book, BorrowRecord

with app.app_context():
    print("Deleting all records...")
    BorrowRecord.query.delete()
    Book.query.delete()
    Member.query.delete()

    print("Creating members...")
    members = [Member(name=f'Member {i}') for i in range(10)]
    db.session.add_all(members)

    print("Creating books...")
    books = [Book(title=f'Book {i}', author=f'Author {i}') for i in range(10)]
    db.session.add_all(books)

    print("Creating borrow records...")
    borrow_records = [
        BorrowRecord(member_id=1, book_id=1),
        BorrowRecord(member_id=2, book_id=2)
    ]
    db.session.add_all(borrow_records)

    db.session.commit()
    print("Database seeded successfully.")
