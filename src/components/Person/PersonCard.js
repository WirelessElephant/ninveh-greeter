import React, { useState, useEffect } from 'react';

import CoreApi from '../../services/Core'

function UserCard (props) {
    const [person, setPerson] = useState({})

    useEffect(() => {
        CoreApi.whoAmI().then(person => {
            setPerson(person)
        })
        CoreApi.getPersonBookList().then(eyy => {
            console.log(eyy)
        })
    }, [])

    return (
        <div>
            {person.name && 
                <span>You are {person.name}</span>
            }
        </div>
    )
}

export default UserCard