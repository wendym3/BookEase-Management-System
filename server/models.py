# models.py

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

db = SQLAlchemy(metadata=metadata)

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'

    serialize_rules = ('-members', '-borrow_records.admin', '-books')

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    # Relationships
    members = db.relationship('Member', back_populates='admin')
    borrow_records = db.relationship('BorrowRecord', back_populates='admin')
    books = db.relationship('Book', back_populates='admin')

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    serialize_rules = ('-admin.books', '-borrow_records.book')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))

    admin = db.relationship('Admin', back_populates='books')
    borrow_records = db.relationship('BorrowRecord', back_populates='book')

class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'

    serialize_rules = ('-admin.members', '-borrow_records.member')

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))

    admin = db.relationship('Admin', back_populates='members')
    borrow_records = db.relationship('BorrowRecord', back_populates='member')

class BorrowRecord(db.Model, SerializerMixin):
    __tablename__ = 'borrow_records'

    serialize_rules = ('-admin.borrow_records', '-book.borrow_records', '-member.borrow_records')

    id = db.Column(db.Integer, primary_key=True)
    borrow_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=True)
    condition_on_return = db.Column(db.String, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'))
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'))

    # Relationships
    book = db.relationship('Book', back_populates='borrow_records')
    member = db.relationship('Member', back_populates='borrow_records')
    admin = db.relationship('Admin', back_populates='borrow_records')
