
//maybe:
// user ratings? add comments?
// share excerpt to social media


//------- SITE LIBRARY MANAGEMENT -------//

const fullLibrary = []

let libraryEntry = class {
    constructor (title, authorFirst, authorLast, id, summ, year, chap, wc) {
        this.title = title;
        this.authorFirst = authorFirst;
        this.authorLast = authorLast;
        this.id = id;
        this.summ = summ;
        this.year = year;
        this.chap = chap;
        this.wc = wc;
        fullLibrary.push(this)
    }
}

let id1 = new libraryEntry('Dracula', 'Bram', 'Stoker', 'id1',
'The classic vampire novel.',
1897, 27, 161774)
let id2 = new libraryEntry('Moby Dick', 'Herman', 'Melville', 'id2',
"Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
1851, 135, 206052)
let id3 = new libraryEntry('Pride and Prejudice', 'Jane', 'Austen', 'id3',
"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. <br> However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
 1813, 61, 124713)
 let id4 = new libraryEntry('The Strange Case of Dr Jekyll and Mr Hyde', 'Robert Louis','Stevenson', 'id4', 'summary goes here', 1886, 10, 25497)
 let id5 = new libraryEntry('The Picture of Dorian Gray', 'Oscar', 'Wilde', 'id5', 'A classic philosophical novel', 1891, 20, 65105)



//to use when creating blurbs so URL is correctly formatted
function getURL (work) {
    let title = work.title.toLowerCase()
    let URL = title.replaceAll(' ', '-')
    return URL
}


//------INITIALIZE LIBRARY-------//

let library = []

if (sessionStorage.getItem('library')) {
    library = JSON.parse(sessionStorage.getItem('library'))
} else {
    sessionStorage.setItem('library', JSON.stringify(library))
}

let getLibrary = sessionStorage.getItem('library')

let bookmarks = document.querySelectorAll('.actions span')

//-------SORTING & FILTERING---------//


if (document.getElementById('sort-by')) {
    const sortBy = document.getElementById('sort-by')
        // looks for a change in the sort dropdown, removes and regenerates content in the correct order
    sortBy.addEventListener('change', (e) => {
        let blurbSpace = document.querySelector('.blurb-space')
        let libraryToSort = getLibraryToSort()
        let sortedLibrary = sortBooks(libraryToSort)
        while (blurbSpace.firstChild) {
            blurbSpace.removeChild(blurbSpace.firstChild)
        }

        for (let i = 0; i < sortedLibrary.length; i++) {
            createBlurb(sortedLibrary[i])
        }
        enableBookmarks()
        findBookmarks()
    })
    const viewMore = document.getElementById('view-more')
    const moreOptions = document.getElementById('more-options')
        // toggles visibility of additional filter options
    viewMore.addEventListener('click', (e) => {
        e.preventDefault()
        if (moreOptions.className == 'hidden') {
            moreOptions.removeAttribute('class')
            viewMore.innerText = 'Hide additional options'
        } else {
            moreOptions.setAttribute('class', 'hidden')
            viewMore.innerText = 'View more options'
        }
    })
        //applies search filter
    moreOptions.addEventListener('submit', (e) => {
        e.preventDefault()
        filterBooks(moreOptions)
    })
}

// get book blurbs from the current page that are eligible for sorting
function getLibraryToSort () {
    let currentLibrary = document.querySelectorAll('.blurb')
    let libraryIDs = []
    for (let lib = 0; lib < currentLibrary.length; lib++) {
        libraryIDs.push(currentLibrary[lib].id)
        console.log(currentLibrary[lib].id)
    }

    //get the actual workable object from fulllibrary instead of the node, then return it for sorting
    let libraryToSort = fullLibrary.filter((book) => {
        if (libraryIDs.indexOf(book.id) != -1) {
            return true
        }
    })
    console.log(libraryToSort)
    return libraryToSort
}

function sortBooks (array) {
    const sortBy = document.getElementById('sort-by')
    let currentSort = sortBy.value
    let newSort
    if (currentSort === 'title') {
        newSort = array.sort((a, b) => {
            return a.title < b.title ? -1 : 1
        })
    }
    if (currentSort === 'title-reverse') {
        newSort = array.sort((a, b) => {
            return a.title > b.title ? -1 : 1
        })
    }
    if (currentSort === 'author-surname') {
        newSort = array.sort((a, b) => {
            return a.authorLast < b.authorLast ? -1 : 1
        })
    }
    if (currentSort === 'year-old') {
        newSort = array.sort((a, b) => {
            return a.year < b.year ? -1 : 1
        })
    }
    if (currentSort === 'year-new') {
        newSort = array.sort((a, b) => {
            return a.year > b.year ? -1 : 1
        })
    }

    console.log(newSort)
    return newSort
}

function filterBooks (moreOptions) {
    let listSpace = document.getElementById('browse') || document.getElementById('my-library')
    let listItems = listSpace.getElementsByClassName('blurb')
    let fAuthor = moreOptions.querySelector('#aname').value.toLowerCase()
    let bTitle = moreOptions.querySelector('#btitle').value.toLowerCase()
    let minWC = moreOptions.querySelector('#min-wc').value
    let maxWC = moreOptions.querySelector('#max-wc').value
    console.log('initial type of minwc is', typeof minWC)
    
    let searchTerms = [fAuthor, bTitle, minWC, maxWC]
    console.log(searchTerms)

    const pageInfo = document.querySelector('.page-info')
    // const textFields = moreOptions.querySelectorAll['input[type="select"]']

    // console.log(textFields)
        //removes any existing search term blurb; else creates a line informing of the current filters
    if (document.getElementById('clear-btn')) {
        let lineToRemove = pageInfo.querySelector('p')
        lineToRemove.remove()
    }

    let filterInfo = document.createElement('p')
    let filterInfoText = 'Filtering for: '
    for (let t = 0; t < searchTerms.length; t++) {
        console.log(searchTerms[t])
        if (searchTerms[t]) {
            filterInfoText = `${filterInfoText} '${searchTerms[t]}'`
        }
    }
    filterInfo.innerHTML = `${filterInfoText}  <button id ='clear-btn'>Clear filters?</button>`
    pageInfo.appendChild(filterInfo)
        // enables button to clear filters
    let clearButton = document.getElementById('clear-btn')
    clearButton.addEventListener('click', (e) => {
        e.preventDefault()
        for (let item of listItems) {
            item.classList.remove('hidden')
        }
        filterInfo.remove()
    })
    
    //need to clear all "hidden" when searching, otherwise it only narrows current list
    // maybe clear boxes when 'clear filters' clicked?


    for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('hidden')
        for (let j = 0; j < searchTerms.length; j++) {
            if (searchTerms[j] == undefined || searchTerms[j] == '') {
                continue
            }
            // is there a risk here that checking what search term is this way could cause false positives?
                //for example, searchTerm[j] = 'ar' and both fauthor and btitle = ar
            if (searchTerms[j] == fAuthor) {
                let blurbName = listItems[i].querySelector('h3').innerText.toLowerCase()
                if (!blurbName.includes(fAuthor)) {
                    console.log(blurbName)
                    listItems[i].className+= ' hidden'
                }
            }
            if (searchTerms[j] == bTitle) {
                let blurbTitle = listItems[i].querySelector('h2 a').innerText.toLowerCase()
                if (!blurbTitle.includes(bTitle)) {
                    listItems[i].className+= ' hidden'
                }
            }
            let blurbWC = listItems[i].querySelector('.wc').innerText
            blurbWC = blurbWC.replaceAll(',', '')
            blurbWC = +blurbWC
            console.log('blurbWC: ', blurbWC)
            if (searchTerms[j] == minWC) {
                let minWCNumber
                //keep this contained so it doesn't throw errors on rerun because minWC is now a number
                if (typeof minWC == 'string') {
                    if (minWC.indexOf(',') != -1) {
                        minWCNumber = minWC.replaceAll(',', '')
                    }
                    minWCNumber = +minWCNumber
                }
                console.log(minWCNumber <= blurbWC)
                if (blurbWC < minWCNumber) {
                    listItems[i].className+= ' hidden'
                }

            }
            if (searchTerms[j] == maxWC) {
                let maxWCNumber
                if (typeof maxWC == 'string') {
                    if (maxWC.indexOf(',') != -1) {
                        maxWCNumber = maxWC.replaceAll(',', '')   
                    }
                    maxWCNumber = +maxWCNumber
                }
                console.log(maxWCNumber >= blurbWC)
                if (blurbWC > maxWCNumber) {
                    listItems[i].className+= ' hidden'
                }
            }
        }
    }
}

//----------BROWSING AND BLURB CREATION----------//

if (document.getElementById('browse')) {
    populateBrowse()
}

function populateBrowse () {
    let sortedLibrary = sortBooks(fullLibrary)
    for (let i = 0; i < sortedLibrary.length; i++) {
        createBlurb(sortedLibrary[i])
    }
    enableBookmarks()
    findBookmarks()
}

function createBlurb (currentBook) {
    const blurbSpace = document.querySelector('.blurb-space')
        // get properties of current book object
    let currentTitle = currentBook.title
    let currentAuthor = `${currentBook.authorFirst} ${currentBook.authorLast}`
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
    newActions.innerHTML = `<p class='bookmark-click'></p><span class='bookmark'></span>`
    newBlurb.appendChild(newActions)
    blurbSpace.appendChild(newBlurb)
}


//-------PERSONAL LIBRARY ---------//

if (document.getElementById('my-library')) {
    populateLibrary()
}

//as a note, this does fire even when reopening the page via back-button.
// if you go to a book page from your library and unbookmark the book from that page,
    //when you hit back to your library the unbookmarked book is not loaded.

function populateLibrary () {
    library = JSON.parse(sessionStorage.getItem('library'))
        //can't sort at this point, library is only ids
    let mySortedLibrary = []
    for (let i = 0; i < library.length; i++) {
        let thisIndex = fullLibrary.findIndex((item) => item.id === library[i])
        console.log(thisIndex)
        let thisWork = fullLibrary[thisIndex]
        mySortedLibrary.push(thisWork)
    }
    mySortedLibrary = mySortedLibrary.sort((a, b) => {
        return a.title < b.title ? -1 : 1
    })
    console.log(mySortedLibrary)
    for (let work of mySortedLibrary) {
        console.log(work)
        createBlurb(work)
    }
    enableBookmarks()
    findBookmarks()
}

//----------BOOK PAGES-----------//

if (document.getElementById('book-head')) {
    console.log('populating!')
    populateBook()
}

function populateBook () {
    let thisID = document.querySelector('.book-id').id
    let thisIndex = fullLibrary.findIndex((item) => item.id === thisID)
    let thisWork = fullLibrary[thisIndex]
    createBlurb(thisWork)
    enableBookmarks()
    findBookmarks()
}

let currentMarks = []

if (sessionStorage.getItem('currentMarks')) {
    currentMarks = JSON.parse(sessionStorage.getItem('currentMarks'))
} else {
    sessionStorage.setItem('currentMarks', JSON.stringify(currentMarks))
}

if (document.getElementById('main-text')) {
    addNoteBtns()
    addMarks() //mind this order, if marks added before note btns it looks weird
    checkMarks()
    closeNotes()
    expandNotes()
}

function addMarks () {
    const chapHeadings = document.querySelectorAll('#main-text h2')
    chapHeadings.forEach((head) => {
        head.innerHTML +=  "<span class='mark'></span>"
    })
}

function checkMarks () {
    const marks = document.querySelectorAll('.mark')
    const currentBook = document.querySelector('.book-id').id
    console.log(currentBook)
    marks.forEach((mark) => {
        const thisLink = mark.parentNode.querySelector('a')
        for (let i in currentMarks) {
            console.log(thisLink.id)
            if (currentMarks[i].book === currentBook && currentMarks[i].chapter === thisLink.id) {
                mark.className += ' active'
                changeMarkTOC('add', thisLink.id)
            }
        }
        mark.addEventListener('click', (e) => {
            if (e.target.className === 'mark') {
                e.target.className += ' active'
                changeMarkTOC('add', thisLink.id)
                setMark('add', thisLink.id)

            } else if (e.target.className === "mark active") {
                e.target.classList.remove('active')
                changeMarkTOC('remove', thisLink.id)
                setMark('remove', thisLink.id)
            }
        }
        )
    })
}

//adds or removes marks from storage (triggered by event on h2 chapter marks)
function setMark(action, chapterID) {
    const bookID = document.querySelector('.book-id').id
    console.log(bookID)
    if (action === 'add') {
        currentMarks.push({'book': bookID, 'chapter': chapterID})
        sessionStorage.setItem('currentMarks', JSON.stringify(currentMarks))
    }
    if (action === 'remove') {
        for (let i in currentMarks) {
            if (currentMarks[i].book == bookID && currentMarks[i].chapter == chapterID) {
                currentMarks.splice(i, 1)
                sessionStorage.setItem('currentMarks', JSON.stringify(currentMarks))
            }
        }
    }    
}

function changeMarkTOC (action, id) {
    // eligible actions are 'add' and 'remove'
    const rowsTOC = document.querySelectorAll ('#toc tr')
    let sourceLink = `#${id}`
    console.log(sourceLink)
    for (let i = 0; i < rowsTOC.length; i++) {
        let currentLink = rowsTOC[i].querySelector('a').getAttribute('href')
        if (sourceLink === currentLink && action == 'add') {
            console.log(currentLink)
            let newMark = document.createElement('td')
            newMark.innerHTML = '<span class="mark active"></span>'
            rowsTOC[i].appendChild(newMark)
        }
        if(sourceLink === currentLink && action == 'remove') {
            let markToRemove = rowsTOC[i].querySelector('.mark')
            console.log(markToRemove)
            markToRemove.parentNode.remove()
        }
    }
}

//--------COMMENT BOX--------------//

let commentStorage = []

if (sessionStorage.getItem('commentStorage')) {
    commentStorage = JSON.parse(sessionStorage.getItem('commentStorage'))
} else {
    sessionStorage.setItem('commentStorage', JSON.stringify(commentStorage))
}

let getComments = sessionStorage.getItem('commentStorage')


function addNoteBtns () {
    const commentBox = document.querySelector('.comment-box')
    const rowsTOC = document.querySelectorAll('#toc tr')
    rowsTOC.forEach((row) => {
        let noteBtn = document.createElement('td')
        noteBtn.innerHTML = '<button class="note-btn">Add or view notes</button>'
            //confirmed my suspicion that the new element must be created within the forEach function for it to be appended correctly
        row.appendChild(noteBtn)
    })
    // unhide comment box and enable comment creation
    const noteBtns = document.querySelectorAll('.note-btn') 
    noteBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (commentBox.classList.contains('hidden')) {
                commentBox.classList.remove('hidden')
            } else {
                let commentHead = commentBox.querySelector('span')
                commentBox.removeChild(commentHead)
            }
            let newCommentHead = document.createElement('span')
            let btnContext = btn.parentNode.parentNode.querySelector('a')
            let btnID = btnContext.getAttribute('href').slice(1) // the href minus #
            newCommentHead.innerText = btnContext.innerText
            newCommentHead.className = btnID
            commentBox.appendChild(newCommentHead) //the chapter title
        })
    })
    // enable saving notes
    const saveBtn = document.querySelector('.save-btn')
    saveBtn.addEventListener('click', (e) => {
        createNote()
    })
}

function expandNotes () {
    const expandBtn = document.querySelector('.expand-btn')
    const cmtBox = document.querySelector('.comment-box')
    const cmtContainer = document.querySelector('.cmt-container')
    const cmtTxt = document.querySelector('.comment-text')


    expandBtn.addEventListener('click', (e) => {
        if (expandBtn.innerText == '‹‹') {
            cmtBox.className += ' expanded'
            cmtContainer.className += ' expanded'
            cmtTxt.className += ' expanded'
            expandBtn.innerText = '>>'
        } else {
            cmtBox.classList.remove('expanded')
            cmtContainer.classList.remove('expanded')
            cmtTxt.classList.remove('expanded')
            expandBtn.innerText = '‹‹'
        }
    })
}

// 

//adds a new note to comment-box, make sure not to call this redundantly or weird things happen
function createNote () {
    const commentCont = document.querySelector('.cmt-container')
    const commentText = document.querySelector('.comment-text')
    const commentBox = document.querySelector('.comment-box')

    let newNote = document.createElement('div')
    newNote.className = 'comment'
    newNote.innerHTML = "<button class='close-btn'>X</button><p class='cmt-date'></p> <p class='cmt-p'></p><hr>"
    commentCont.appendChild(newNote)
    let newP = newNote.querySelector('.cmt-p')
    newP.innerText = commentText.value
    commentText.value = ''
    let newDate = newNote.querySelector('.cmt-date')
    let date = new Date ()
    newDate.innerText = date.toLocaleString()
    let newCloseButton = newNote.querySelector('button')
    newCloseButton.addEventListener('click', (e) => {
        console.log('removing: ', e.target.parentNode)
        let confirmation = confirm('Are you sure?')
        if (confirmation) {
            e.target.parentNode.remove(e.target.parentNode)
        }
    })

    const bookID = document.querySelector('.book-id').id
    const chapterID = commentBox.querySelector('span').className
    console.log({'book': bookID, 'chapter': chapterID, 'date': newDate.innerText, 'comment': newP.innerText})
    // commentStorage.push({'book': bookID, 'chapter': chapterID, 'date': newDate.innerText, 'comment': newP.innerText})
}

// hide comment-box or delete note, depending on which close-button is clicked
function closeNotes () {
    let closeBtns = document.querySelectorAll('.close-btn')
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (btn.parentNode.className == 'comment') {
                let confirmation = confirm('Are you sure?')
                if (confirmation) {
                    btn.parentNode.remove(btn.parentNode)
                }
            } else if (btn.parentNode.className == 'comment-box' || btn.parentNode.className == 'comment-box expanded') {
                btn.parentNode.className += ' hidden'
                let btnContext = btn.parentNode.querySelector('span')
                btn.parentNode.removeChild(btnContext)
            }
        })
    })
}

//------- BOOKMARKING FUNCTIONALITY --------//

//bookmark initialization happens in library management, otherwise blah blah called before initialization etc
//need to rerun functions after regenerating list, eg filtering

function enableBookmarks () {
    bookmarks = document.querySelectorAll('.actions span')
    
    bookmarks.forEach((bookmark) => {
        let currentWork = bookmark.parentNode.parentNode.id
        let library = JSON.parse(sessionStorage.getItem('library'))
        if (library.includes(currentWork)) {
            bookmark.className = 'bookmark-fill'
        } else {
            bookmark.className = 'bookmark'
        }
    })
}

function findBookmarks () {
    bookmarkClicks = document.querySelectorAll('.bookmark-click')
    bookmarkClicks.forEach((bookmark) => {
        bookmark.addEventListener('click', function (e) {
            e.preventDefault
            let currentBlurb = this.parentNode.parentNode
            let currentWork = currentBlurb.id
            let currentMark = currentBlurb.querySelector('.actions span')
            console.log(currentWork, currentMark)
            if (currentMark.className === 'bookmark') {
                console.log('setting bookmark')
                currentMark.className = 'bookmark-fill'
                setBookmark(currentWork)
            } else if (currentMark.className === 'bookmark-fill') {
                console.log('removing bookmark')
                currentMark.className = 'bookmark'
                removeBookmark(currentWork)
            }
        })
    })
}


function setBookmark (work) {
        console.log('initial load is ' + library)
        library.push(work)
        sessionStorage.setItem('library', JSON.stringify(library))
        console.log('session storage is ' + JSON.parse(sessionStorage.getItem('library')))
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