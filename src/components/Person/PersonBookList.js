import React, { useState, useEffect } from 'react';

import CoreApi from '../../services/Core';
import BookItem from '../Books/BookItem';


function PersonBookList (props) {
    const [books, updateBookList] = useState([])
    const bookActions = [{
        'action': async book => {
            const newBookList = await CoreApi.removeBookFromList(book)
            updateBookList(newBookList.books)
        },
        'name': 'Remove',
        'color': 'lightcoral'
    }]

    useEffect(() => {
        CoreApi.getPersonBookList().then(bookList => {
            updateBookList(bookList.books)
        })
    }, [])

    function getList () {
        if (books.length) { 
            return books.map(book => {
                return <BookItem 
                    key={book.id}
                    book={book}
                    bookActions={bookActions}></BookItem>
            })
        } else {
            return <b>Your list is empty <span aria-label="sad-emoji" role="img">😢</span></b>
        }
    }

    return (
        <div>
            {getList()}
        </div>
    )
}


export default PersonBookList