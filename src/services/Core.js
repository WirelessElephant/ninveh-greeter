import _ from 'lodash';
import Api from './NinvehApi';


function _generateRandomName () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return 'critic_' + Math.random().toString(36).substr(2, 9);
}

async function _initializeNewUser () {
    const generatedName = _generateRandomName()

    const personResponse = await Api.post(`person/`, {
        name: generatedName
    })

    localStorage.setItem('personId', personResponse.data.id)
    sessionStorage.setItem('personObj', personResponse.data)
    return personResponse.data
}

async function _loadExistingUser (personId) {
    const possibleUserObj = sessionStorage.getItem('personObj')
    if (possibleUserObj) {
        return JSON.parse(possibleUserObj)
    }
    const PersonResponse = await Api.get(`person/${personId}/`)

    sessionStorage.setItem('userObj', JSON.stringify(PersonResponse.data))
    return PersonResponse.data
}

async function annotateBookList (bookList) {
    const mappedBooks = await Api.get(`book/?id__in=${bookList.books.join(',')}`)

    const transformedBookList = {
        books: bookList.books.map(bookId => {
            return mappedBooks.data.results.find(mappedBook => mappedBook.id === bookId)
        })
    }
    const newBookList = Object.assign(
        bookList,
        transformedBookList
    )
    return newBookList
}

async function whoAmI () {
    const personId = localStorage.getItem('personId');
    if (_.isNull(personId)) {
        return await _initializeNewUser()
    } else {
        return await _loadExistingUser(personId)
    }
}

async function getPersonBookList (annotated=true) {
    /*
        Determines who the person is, and returns their list.
        If an annotated list is not required (ids instead of whole book items),
        it is more efficient to use annotated=false.
    */
    const person = await whoAmI()
    const possiblePersonBookList = sessionStorage.getItem(`person${person.id}BookList`)

    if (possiblePersonBookList && annotated) {
        return JSON.parse(possiblePersonBookList)
    } else if (possiblePersonBookList && !annotated) {
        const storedList = JSON.parse(possiblePersonBookList)
        const idOnlyBooks = storedList.books.map(book => book.id)
        return Object.assign(storedList, {books: idOnlyBooks})
    }
    const List = await Api.get(`booklist/?owner=${person.id}`)
    
    if (annotated) {
        const annotatedBookList = await annotateBookList(List.data.results[0])
        sessionStorage.setItem(`person${person.id}BookList`, JSON.stringify(annotatedBookList))
        return annotatedBookList
    }
    return List.data.results[0]
}

async function removeBookFromList (book) {
    /*
        Takes a book item and removes it from the user's list, then returns the
        new list. If full book item is not available, using {id: bookId} will be
        ok.
    */
    const targetList = await getPersonBookList(false)

    if (!targetList.books.includes(book.id)) {
        // Book isn't in the list, just return the list
        console.warn("Attempted to remove a book not in user's list")
        return targetList
    }
    const newBookList = targetList.books.filter(bookId => book.id !== bookId)
    const transformedBookList = Object.assign(
        targetList,
        { books: newBookList }
    )

    const BookListResponse = await Api.put(`booklist/${targetList.id}/`, transformedBookList)

    // Update the local cache
    const annotatedBookList = await annotateBookList(BookListResponse.data)
    sessionStorage.setItem(`person${annotatedBookList.owner}BookList`, JSON.stringify(annotatedBookList))
    
    return annotatedBookList
}

async function addBookToList (book) {
    /*
        Takes a book item and adds it to the user's list, then returns the
        new list. If full book item is not available, using {id: bookId} will be
        ok.
    */
    const targetList = await getPersonBookList(false)

    if (targetList.books.includes(book.id)) {
        // Book isn't in the list, just return the list
        console.warn("Attempted to add a book already in user's list")
        return targetList
    }
    const newBookList = targetList.books.concat([book.id])
    const transformedBookList = Object.assign(
        targetList,
        { books: newBookList }
    )

    const BookListResponse = await Api.put(`booklist/${targetList.id}/`, transformedBookList)

    // Update the local cache
    const annotatedBookList = await annotateBookList(BookListResponse.data)
    sessionStorage.setItem(`person${annotatedBookList.owner}BookList`, JSON.stringify(annotatedBookList))
    
    return annotatedBookList


}

const CoreApi = {
    whoAmI,
    getPersonBookList,
    addBookToList,
    removeBookFromList
}

export default CoreApi