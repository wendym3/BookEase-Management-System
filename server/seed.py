
from faker import Faker
from app import app
from models import db, Admin, Book, Member, BorrowRecord
from random import randint, choice
from datetime import datetime, timedelta

fake = Faker()

with app.app_context():
    print("Deleting all records...")
    BorrowRecord.query.delete()
    Book.query.delete()
    Member.query.delete()
    Admin.query.delete()

    print("Creating admins...")
    admins = [Admin(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        email=fake.unique.email(),
        password=fake.password()
    ) for _ in range(5)]  # Limited to 5 admins for simplicity
    db.session.add_all(admins)

    print("Creating members...")
    members = [Member(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        email=fake.unique.email(),
        password=fake.password(),
        admin_id=choice(admins).id
    ) for _ in range(10)]  # Limited to 10 members for simplicity
    db.session.add_all(members)

    print("Creating books...")
    books = [Book(
        title=fake.sentence(nb_words=4),
        author=fake.name(),
        admin_id=choice(admins).id
    ) for _ in range(20)]  # Limited to 20 books for simplicity
    db.session.add_all(books)

    print("Creating borrow records...")
    borrow_records = [BorrowRecord(
        borrow_date=fake.date_time_this_year(),
        return_date=fake.date_time_this_year(),
        condition_on_return=fake.word(),
        book_id=choice(books).id,
        member_id=choice(members).id,
        admin_id=choice(admins).id
    ) for _ in range(30)]  # Limited to 30 borrow records for simplicity
    db.session.add_all(borrow_records)

    db.session.commit()
    print("Seeding complete!")
