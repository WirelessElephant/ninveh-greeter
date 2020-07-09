import { debounce } from 'lodash';

import Api from '../services/Api';
import React, { useState } from 'react';
import styled from 'styled-components';

import BookList from "./BookList"


const p = styled.p``
const i = styled.i``
const b = styled.b``
const input = styled.input``
const div = styled.div``
const h2 = styled.h2``

async function UpdateBooks(searchValue, updateFunc) {
    if (searchValue) {
        const books = await Api.get(`book/?author__name__icontains=${searchValue}`)
        return updateFunc(books.data.results)
    } else {
        return updateFunc([])
    }
}

const debouncedUpdate = debounce((value, bookUpdate) => {
    return UpdateBooks(value, bookUpdate)
}, 200)

function BookSearch(props) {
    const [books, setBooks] = useState([])
    const [searchStr, setSearchStr] = useState('')

    function getBookList () {
        return books.map(book => {
            return (
                <BookList key={book.id} book={book}></BookList>
            )
        })
    }



    function handleUpdate (event) {
        setSearchStr(event.target.value)
        debouncedUpdate(event.target.value, setBooks)
    }
    

    return (
        <div>
            <h2>Author Search</h2>
            <input value={searchStr} onChange={ handleUpdate } ></input>
            <div>
                {getBookList()}
            </div>
        </div>
    )
}

export default BookSearch