import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import BookList from './components/Books/BookList';
import AddBook from './components/Books/AddBooks';
import EditBook from './components/Books/EditBook';
import BookDetails from './components/Books/BookDetails';
import MemberList from './components/Members/MemberList';
import AddMember from './components/Members/AddMember';
import BorrowBook from './components/Borrowing/BorrowBook';
import BorrowingList from './components/Borrowing/BorrowingList';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';

function Routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact component={BookList} />
        <Route path="/books/add" component={AddBook} />
        <Route path="/books/edit/:bookId" component={EditBook} />
        <Route path="/books/:bookId" component={BookDetails} />
        <Route path="/members" exact component={MemberList} />
        <Route path="/members/add" component={AddMember} />
        <Route path="/borrow" component={BorrowBook} />
        <Route path="/borrowing-list" component={BorrowingList} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
      </Routes>
    </Router>
  );
}

export default Routes;
