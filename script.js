const bookmarks = document.querySelectorAll('.actions span')

let library = {
    'books': []
}

function firstLoad () {
    sessionStorage.setItem('library', JSON.stringify(library))
}

if (sessionStorage === null) {
    firstLoad()
}

const userLibrary = sessionStorage.getItem('library')


bookmarks.forEach((bookmark) => {
    bookmark.addEventListener('click', function (e) {
        e.preventDefault
        let currentTitle = this.parentNode.parentNode.querySelector('h2').innerText
        if (this.className === 'bookmark') {
            this.className = 'bookmark-fill'
            setBookmark(currentTitle)
        } else if (this.className === 'bookmark-fill') {
            this.className = 'bookmark'
            removeBookmark(currentTitle)
        }
    //select innerText of h2 of parent element(book title)
    //CRIMINALLY UGLY:
    // let currentTitle = this.parentNode.parentNode.firstChild.nextSibling.firstChild.nextSibling.innerText
    })
})

function setBookmark (work) {
        library = JSON.parse(userLibrary)
        console.log(JSON.parse(userLibrary))
        console.log('initial load is ' + library)
        console.log(library['books'])
        library['books'].push(work)
        sessionStorage.setItem('library', JSON.stringify(library))
        console.log('session storage is ' + userLibrary)

    // library.books.push(work)
    // console.log(library.books)

    // localStorage.setItem()
}

function removeBookmark (work) {
    let index = library['books'].indexOf(work)
    library['books'].splice(index, 1)
    sessionStorage.setItem('library', JSON.stringify(library))
    console.log(console.log('session storage is ' + userLibrary))
}