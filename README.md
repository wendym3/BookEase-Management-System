# BookEase Management System Api 

# Overview
The BookEase Management System API is a Flask-based backend application designed to manage a library's book collection, member records, and borrow records. It provides endpoints to handle CRUD operations for books, members, and borrow records, as well as user authentication and session management.

# Features
- User Authentication: Sign up, login, and manage sessions.
- Book Management: Create, retrieve, update, and delete books.
- Member Management: Create, retrieve, update, and delete library members.
- Borrow Record Management: Create, retrieve, update, and delete borrow records.
- Data Seeding: Populate the database with initial data for testing and development.

# Prerequisites

- Python 3.7 or higher
- Flask
- SQLAlchemy
- Flask-Migrate
- Flask-Bcrypt

## Installation
1. Clone the repository:
   ```git clone <repository-url>```
   ```cd BookEase-Management-System```

2. Create and activate the virtual environment :

   ```python -m venv venv```
   ```source venv/bin/activate```

3. Install the dependencies :
   
   ```pip install -r requirements.txt```

4. Initialise the database :
    ```flask db upgrade```

5. Seed the Database:
   ```python seed.py```

6. Run the Application:
  ``` flask run```   

# API Endpoins
# Authentication

- POST /signup: Create a new member.
- POST /login: Log in a member.
- GET /check_session: Check if the user is logged in.
- DELETE /logout: Log out the current user 

# Books

- POST /books: Create a new book.
- GET /books: Retrieve a list of books.
- PATCH /books/<id>: Update a book by ID.
- DELETE /books/<id>: Delete a book by ID.

# Members
- POST /members: Create a new member.
- GET /members/<id>: Retrieve a member by ID.
- PATCH /members/<id>: Update a member by ID.
- DELETE /members/<id>: Delete a member by ID.

# Borrow Records
- POST /borrow_records: Create a new borrow record.
- GET /borrow_records/<id>: Retrieve a borrow record by ID.
- PATCH /borrow_records/<id>: Update a borrow record by ID.
- DELETE /borrow_records/<id>: Delete a borrow record by ID.

# Liscence
# MIT
``
This `README.md` file provides a comprehensive overview of your project, including descriptions, user stories, requirements, installation instructions, usage examples, and more.
``

# Authors

    ```Lucy Wanja Kariuki```
    ```Wendy Masese```
