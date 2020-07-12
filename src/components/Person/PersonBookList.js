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
        'name': 'Remove'
    }]

    useEffect(() => {
        CoreApi.getPersonBookList().then(bookList => {
            updateBookList(bookList.books)
        })
    }, [])


    return (
        <div>
            {books.length && books.map(book => {
                return <BookItem key={book.id} book={book} bookActions={bookActions}></BookItem>
            })}
        </div>
    )
}


export default PersonBookList