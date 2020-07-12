import React from 'react';

import { isArray } from 'lodash';

import { Button } from '../Controls/Buttons'
import { HorizontalDiv, BookItemDiv } from '../Elements/Elements'

function BookItem (props) {
    function getBookActions () {
        if (isArray(props.bookActions)) {
            return props.bookActions.map(bookAction => {
                return ( <Button 
                    key={bookAction.name} 
                    onClick={() => bookAction.action(props.book) }>
                        {bookAction.name}
                </Button> )
            })
        }
    }

    return (
        <HorizontalDiv>
            <BookItemDiv><i>{props.book.title}</i> by <b>{props.book.author}</b></BookItemDiv>
            <BookItemDiv>{getBookActions()}</BookItemDiv>
        </HorizontalDiv>
    )
}

export default BookItem