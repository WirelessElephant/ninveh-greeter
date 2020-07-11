import { debounce } from 'lodash';

import Api from '../../services/NinvehApi';
import React, { useState, useEffect } from 'react';

import BookList from "./BookList"


async function SearchAuthor(searchValue, updateFunc) {
    if (searchValue) {
        const books = await Api.get(`book/?author__name__icontains=${searchValue}`)
        return updateFunc(books.data.results)
    } else {
        return updateFunc([])
    }
}

async function SearchFrequency(searchValue, updateFunc) {
    if (searchValue) {
        const books = await Api.get(`book/frequency/?count=${searchValue}`)
        return updateFunc(books.data.results)
    } else {
        return updateFunc([])
    }
}

const debouncedAuthorSearch = debounce((value, bookUpdate) => {
    return SearchAuthor(value, bookUpdate)
}, 200)

const debouncedFrequencySearch = debounce((value, bookUpdate) => {
    return SearchFrequency(value, bookUpdate)
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

    function handleAuthorUpdate (event) {
        setSearchStr(event.target.value)
        debouncedAuthorSearch(event.target.value, setBooks)
    }
    
    function handleFrequencyUpdate (event) {
        setSearchStr(event.target.value)
        debouncedFrequencySearch(event.target.value, setBooks)
    }

    const searchTitle = (props.searchMethod === 'authorSearch') ? 'Author Search' : 'Popularity Search'

    useEffect(() => {
        setSearchStr('')
        setBooks([])
    }, [props.searchMethod])

    return (
        <div>
            <h2>{ searchTitle }</h2>
            {props.searchMethod === 'authorSearch' && 
                <input value={searchStr} onChange={ handleAuthorUpdate } ></input>
            }   
            {props.searchMethod === 'popularity' && 
                <input type="number" value={searchStr} onChange={ handleFrequencyUpdate } ></input>
            }   
            <div>
                {getBookList()}
            </div>
        </div>
    )
}

export default BookSearch