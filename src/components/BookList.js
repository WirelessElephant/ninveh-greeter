import React from 'react';

function BookList (props) {

    return (
        <div>
            <p>
                <i>{props.book.title}</i> by <b>{props.book.author}</b>
            </p>
        </div>
    )
}

export default BookList