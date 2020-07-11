import React, { useState } from 'react';
import { isNull } from 'lodash';

import { Button } from './Controls/Buttons'

import BookSearch from './Books/BookSearch';

const NavStates = [
    null,
    'authorSearch',
    'popularity'
]

function renderActivePane (navState) {
    if (isNull(navState)) {
        return <div><h2>Select a search to begin</h2></div>
    }
    if (navState === NavStates[1] || navState === NavStates[2]) {
        return <BookSearch searchMethod={navState}></BookSearch>
    }
}

function Home (props) {
    const [nav, setNav] = useState(null)

    return (
        <div className='rootElem'>
            <div className='homeNav'>
                <Button 
                    active={isNull(nav)}
                    onClick={() => setNav(null)}>
                    Home
                </Button>
                <Button 
                    active={(nav === NavStates[1])}
                    onClick={() => setNav(NavStates[1])}>
                    Author Search
                </Button>
                <Button 
                    active={(nav === NavStates[2])}
                    onClick={() => setNav(NavStates[2])}>
                    Popularity Search
                </Button>
            </div>
            {renderActivePane(nav)}
        </div>
    )
}

export default Home