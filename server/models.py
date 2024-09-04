from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    borrow_records = db.relationship('BorrowRecord', backref='member')

    def __repr__(self):
        return f'Member {self.name}, ID {self.id}'

class Book(db.Model, SerializerMixin):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)

    borrow_records = db.relationship('BorrowRecord', backref='book')

    def __repr__(self):
        return f'Book {self.title} by {self.author}, ID {self.id}'

class BorrowRecord(db.Model, SerializerMixin):
    __tablename__ = 'borrow_records'

    id = db.Column(db.Integer, primary_key=True)
    borrow_date = db.Column(db.DateTime, server_default=db.func.now())
    return_date = db.Column(db.DateTime, nullable=True)
    condition_on_return = db.Column(db.String, nullable=True)

    member_id = db.Column(db.Integer, db.ForeignKey('members.id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))

    def __repr__(self):
        return f'BorrowRecord ID {self.id}'
