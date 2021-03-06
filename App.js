/**
 * Project Library
 *
 * This Project is inspired from The Odin Project Curriculum
 *
 * Author: Rohit Mehta
 **/

// Constants:
const shelf = document.querySelector('.shelf');
const form = document.querySelector('form');
const showFormBtn = document.querySelector('button.add-book');

class Book {
    constructor(title, author, pageCount, readStatus) {
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.readStatus = readStatus; // True means read; otherwise False
        this.getBookInfo = () => title + ', ' + author + ', ' + pageCount + ', ' + readStatus;
        this.toggleReadStatus = function () {
            if (this.readStatus)
                this.readStatus = false;
            else
                this.readStatus = true;
        }
    }
}

const Library = JSON.parse(localStorage.getItem('Library')) || [];
// Reconstruct Library elements as prototype of Book
for (let i = 0; i < Library.length; i++) {
    const book = Library[i];
    Library[i] = new Book(book.title, book.author, book.pageCount, book.readStatus);
}

// save the current library to the local storage
const saveLibrary = () => {
    // Book constructor information is lost in saving.
    // reconstruct when reading from localStorage
    localStorage.setItem('Library', JSON.stringify(Library));
}

const clearLibrarySave = () => {
    localStorage.clear();
}

const updateLocalStorage = () => {
    clearLibrarySave();
    saveLibrary();
}

const addBookToLibrary = (book) => {
    if (book.constructor === Book) {
        Library.push(book);
        updateLocalStorage();
    }
}

const showForm = () => form.parentNode.style.visibility = 'visible';
const closeForm = () => form.parentNode.style.visibility = 'hidden';
const clearForm = () => {
    form.title.value = null;
    form.author.value = null;
    form.pgcount.value = null;
    form.read.value = null;
}

showFormBtn.addEventListener('click', showForm);
form.addEventListener("submit", e => {
    const read = (form.read.value === 'true') ? true : false;
    const newBook = new Book(form.title.value, form.author.value, form.pgcount.value, read);
    addBookToLibrary(newBook);

    updateLibraryDisplay();

    clearForm();
    closeForm();

    e.preventDefault();
});
form.cancel.addEventListener('click', closeForm);

// remove the Book from Library at index i
const removeBookFromLibrary = i => {
    Library.splice(i, 1);
    updateLocalStorage();
}

// Number -> DocumentElement
// create a div element with class 'book' and data-id as the
// given number. Add book information from the Library[i]
const createBookElement = (i) => {
    const book = document.createElement('div');
    book.setAttribute('class', 'book');
    book.setAttribute('data-id', i);

    const spanClose = document.createElement('span');
    spanClose.setAttribute('class', 'close');
    spanClose.setAttribute('title', 'Remove this book');
    spanClose.textContent = 'x';

    spanClose.addEventListener('click', () => {
        const index = spanClose.parentNode.getAttribute('data-id');

        // console.log(index);

        removeBookFromLibrary(index);

        updateLibraryDisplay();
    });

    const titleDiv = document.createElement('div');
    titleDiv.setAttribute('class', 'title');
    titleDiv.textContent = Library[i].title;

    const authorDiv = document.createElement('div');
    authorDiv.setAttribute('class', 'author');
    authorDiv.textContent = Library[i].author;

    const pg = document.createElement('div');
    pg.setAttribute('class', 'pg');
    pg.textContent = Library[i].pageCount + ' Pages';

    const readDiv = document.createElement('div');
    readDiv.setAttribute('class', 'read');
    readDiv.setAttribute('title', 'Toggle Read Status');
    readDiv.textContent = (Library[i].readStatus) ? 'Read ???' : 'Not Read ???';

    readDiv.addEventListener('click', () => {
        const index = readDiv.parentNode.getAttribute('data-id');

        Library[index].toggleReadStatus();

        updateLibraryDisplay();
    });

    book.appendChild(spanClose);
    book.appendChild(titleDiv);
    book.appendChild(authorDiv);
    book.appendChild(pg);
    book.appendChild(readDiv);

    return book;
}

const updateLibraryDisplay = () => {
    // remove all old childs from the shelf
    while (shelf.firstChild) {
        shelf.removeChild(shelf.firstChild);
    }

    // and add new ones instead
    for (let i = 0; i < Library.length; i++) {
        const book = createBookElement(i);
        shelf.appendChild(book);
    }
}

// for testing:
// const book1 = new Book('Practical C Programming', 'Steve OUaline', 400, true);
// const book2 = new Book('A Complete Guide to C++ Programming', 'Ulla Kirch', 846, false);
// const book3 = new Book('Pro Git', 'Scott Chacon', 441, false);
// const book4 = new Book('Clean Code', 'Robert C. Martin', 462, false);
// const book5 = new Book('C Programming Tutorial', 'Tutorialspoint', 200, true);
// // console.log(cprogramming.constructor === Book);

// addBookToLibrary(book1);
// addBookToLibrary(book2);
// addBookToLibrary(book3);
// addBookToLibrary(book4);
// addBookToLibrary(book5);

updateLibraryDisplay();