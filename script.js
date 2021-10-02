
//TO-DO:
// ideally figure out some kind of replace function on URLs
//    so I can have it automatically parse dashes for the URLs/no dashes for display
// or figure out if I can have files with %20 as spaces or if spaces be auto parsed that way????

// add filtering feature

//------- SITE LIBRARY MANAGEMENT -------//

const fullLibrary = []

let libraryEntry = class {
    constructor (title, author, id, summ, year, chap, wc) {
        this.title = title;
        this.author = author;
        this.id = id;
        this.summ = summ;
        this.year = year;
        this.chap = chap;
        this.wc = wc;
        fullLibrary.push(this)
    }
}

let id1 = new libraryEntry('Dracula', 'Bram Stoker', 'id1',
'The classic vampire novel.',
1897, 27, 161774)
let id2 = new libraryEntry('Moby Dick', 'Herman Melville', 'id2',
"Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
1851, 135, 206052)
let id3 = new libraryEntry('Pride and Prejudice', 'Jane Austen', 'id3',
"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. <br> However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
 1813, 61, 124713)
let id4 = new libraryEntry('The Picture of Dorian Gray', 'Oscar Wilde', 'id4', 'A classic philosophical novel', 1891, 20, 65105)

//to use when creating blurbs so URL is correctly formatted
function getURL (work) {
    let title = work.title.toLowerCase()
    let URL = title.replaceAll(' ', '-')
    return URL
}

//-------BROWSING---------//

if (document.getElementById('browse')) {
    populateBrowse()
}


function populateBrowse () {
    for (let i = 0; i < fullLibrary.length; i++) {
        createBlurb(fullLibrary[i])
    }
}

function createBlurb (currentBook) {
    const blurbSpace = document.querySelector('.blurb-space')
        // get properties of current book object
    let currentTitle = currentBook.title
    let currentAuthor = currentBook.author
    let currentID = currentBook.id
    let currentSumm = currentBook.summ
    let currentYear = currentBook.year
    let currentChap = currentBook.chap
    let currentWC = currentBook.wc
    let currentURL = getURL(currentBook)
        // create new book blurb
    let newBlurb = document.createElement('div')
    newBlurb.className = 'blurb'
    newBlurb.id = currentID
    let newBasics = document.createElement('div')
    newBasics.className = 'book-basics'
    let newTitle = document.createElement('h2')
    newTitle.innerHTML = `<a href="books/${currentURL}.html">${currentTitle}</a>`
    newBasics.appendChild(newTitle)
    let newAuthor = document.createElement('h3')
    newAuthor.innerHTML = currentAuthor
    newBasics.appendChild(newAuthor)
    newBlurb.appendChild(newBasics)
    let newSumm = document.createElement('div')
    newSumm.innerHTML = `<p>${currentSumm}</p>`
    newSumm.className = 'summary'
    newBlurb.appendChild(newSumm)
    let newMeta = document.createElement('div')
    newMeta.className = 'meta'
    newBlurb.appendChild(newMeta)
    let newYear = document.createElement('p')
    newYear.innerHTML = `Year: <span class='year'>${currentYear}</span>`
    newMeta.appendChild(newYear)
    let newChap = document.createElement('p')
    newChap.innerHTML = `Chapters: <span class='chapters'>${currentChap}</span>`
    newMeta.appendChild(newChap)
    let newWC = document.createElement('p')
    newWC.innerHTML = `Words: <span class='wc'>${currentWC.toLocaleString()}</span>`
    newMeta.appendChild(newWC)
    let newActions = document.createElement('div')
    newActions.className = 'actions'
    newActions.innerHTML = `<span class='bookmark'></span>`
    newBlurb.appendChild(newActions)
    blurbSpace.appendChild(newBlurb)
}

//------INITIALIZE LIBRARY-------//

let library = []

if (sessionStorage.getItem('library')) {
    library = JSON.parse(sessionStorage.getItem('library'))
} else {
    sessionStorage.setItem('library', JSON.stringify(library))
}

let getLibrary = sessionStorage.getItem('library')


//-------PERSONAL LIBRARY ---------//

if (document.getElementById('my-library')) {
    populateLibrary()
}

function populateLibrary () {
    library = JSON.parse(sessionStorage.getItem('library'))
    for (let i = 0; i < library.length; i++) {
        let thisIndex = fullLibrary.findIndex((item) => item.id === library[i])
        console.log(thisIndex)
        let thisWork = fullLibrary[thisIndex]
        console.log(thisWork)
        createBlurb(thisWork)
    }
}

//----------BOOK PAGES-----------//

//note: when 

if (document.getElementById('book-head')) {
    console.log('populating!')
    populateBook()
}

function populateBook () {
    let thisID = document.querySelector('.book-id').id
    let thisIndex = fullLibrary.findIndex((item) => item.id === thisID)
    let thisWork = fullLibrary[thisIndex]
    createBlurb(thisWork)
}

//------- BOOKMARKING FUNCTIONALITY --------//

const bookmarks = document.querySelectorAll('.actions span')
//NOTE this must be placed AFTER the blurb creation script
// otherwise it will not have the newly created blurbs in its node list and bookmark scripts won't function

bookmarks.forEach((bookmark) => {
    let currentWork = bookmark.parentNode.parentNode.id
    console.log(currentWork)
    if (getLibrary.includes(currentWork)) {
        bookmark.className = 'bookmark-fill'
    }
})

bookmarks.forEach((bookmark) => {
    bookmark.addEventListener('click', function (e) {
        e.preventDefault
        let currentWork = this.parentNode.parentNode.id
        if (this.className === 'bookmark') {
            this.className = 'bookmark-fill'
            setBookmark(currentWork)
        } else if (this.className === 'bookmark-fill') {
            this.className = 'bookmark'
            removeBookmark(currentWork)
        }
    //select innerText of h2 of parent element(book title)
    //CRIMINALLY UGLY:
    // let currentTitle = this.parentNode.parentNode.firstChild.nextSibling.firstChild.nextSibling.innerText
    })
})

function setBookmark (work) {
        console.log('initial load is ' + library)
        library.push(work)
        sessionStorage.setItem('library', JSON.stringify(library))
        console.log('session storage is ' + JSON.parse(sessionStorage.getItem('library')))

    // library.books.push(work)
    // console.log(library.books)

    // localStorage.setItem()
}

function removeBookmark (work) {
    library = JSON.parse(sessionStorage.getItem('library'))
    let index = library.indexOf(work)
    library.splice(index, 1)
    sessionStorage.setItem('library', JSON.stringify(library))
    console.log(library)
    }



    // SUPER MESSY ATTEMPT TO INSERT COMMAS INTO LARGE NUMBERS
// BEFORE I REALIZED THERE WAS A MUCH EASIER WAY
// const testToSplit = '0123456789'
// let calculatedSplit = []
// console.log('the length', testToSplit.length/3)
// let trip = 0
// for (let j = 1; j <= testToSplit.length/3; j++) {
//     trip = trip+3
//     calculatedSplit.push(trip)
// }

// console.log(calculatedSplit)

// let splitArray = []
// for (let k = 0; k < calculatedSplit.length; k++) {
//     let currentSplit = ''
//     currentSplit = testToSplit.slice(-(calculatedSplit[k]), -(calculatedSplit[k])+3)
//     console.log((-(calculatedSplit[k]), -(calculatedSplit[k])+3))
//     console.log('currentSplit is', currentSplit)
//     splitArray.push[currentSplit]
//     console.log(splitArray)
// }
// splitArray.push(testToSplit.slice(0, testToSplit%3))
// console.log(splitArray)

// let finalSplitWC = splitArray[splitArray.length-1]
// for (let jk = splitArray.length-2; jk >= 0; jk--) {
//     finalSplitWc = finalSplitWC.concat(',', splitArray[jk])
// }
// console.log(finalSplitWC)