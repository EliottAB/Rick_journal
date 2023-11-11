import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};
const app = initializeApp(firebaseConfig);

const rickHead = document.querySelector(".head")
const paupieres = document.querySelectorAll(".paupiere")
const leftPupil = document.querySelector(".eye-left .pupil")
const rightPupil = document.querySelector(".eye-right .pupil")
const eyebrows = document.querySelector(".eyebrows")
const video = document.querySelector("video")
const booksContainerContainer = document.querySelector(".books-container")
const booksContainer = document.querySelector(".books")
const changeDateText = document.querySelector(".change-date p")
const changeDateLeft = document.querySelector(".arrow-left")
const changeDateRight = document.querySelector(".arrow-right")
let randomBlinkInterval = Math.random() * (6000 - 3000) + 3000

let rickMiddle = rickHead.clientWidth/2 + rickHead.offsetLeft
let middleScreen = window.innerWidth/2
let rickMiddleFromScreenMiddle = (middleScreen - rickMiddle)*100/window.innerWidth

let mousePositionX = 50
let mousePositionY = 0
let maxX = 90
let maxY = 90
let minX = 10

window.addEventListener("mousemove", (e)=>{

    //get the position of rick from the middle to put the pupils on the right axe
    rickMiddle = rickHead.clientWidth/2 + rickHead.offsetLeft
    middleScreen = window.innerWidth/2
    rickMiddleFromScreenMiddle = (middleScreen - rickMiddle)*100/window.innerWidth

    mousePositionX = (e.clientX)/window.innerWidth * 100
    mousePositionY = (e.clientY)/window.innerHeight * 100
    maxX = 90
    maxY = 90
    minX = 10

    //modify the max left and top position of the pupils to get a circular look
    if (mousePositionY>51.8) {
        maxX = maxX - (mousePositionY - 51.8)/5
        minX = minX + (mousePositionY - 51.8)/5
    }
    if (mousePositionX>=50) {
        maxY = maxY - (mousePositionX-50)/5
    }else{
        maxY = maxY - (-mousePositionX+50)/5
    }

    leftPupil.style.left = `clamp(${minX}%, ${mousePositionX + rickMiddleFromScreenMiddle}% , ${maxX}%)`
    rightPupil.style.left = `clamp(${minX}%, ${mousePositionX + rickMiddleFromScreenMiddle}% , ${maxX}%)`
    leftPupil.style.top = `clamp(51.8%, ${mousePositionY}% , ${maxY}%)`
    rightPupil.style.top = `clamp(51.8%, ${mousePositionY}% , ${maxY}%)`
})

setInterval(() => {
    paupieres.forEach(paupiere => {
        paupiere.style.height = "100%"
        paupiere.style.top = "0"
        paupiere.style.borderRadius = "100vw"
        leftPupil.style.transition = "top .08s"
        rightPupil.style.transition = "top .08s"
        leftPupil.style.top = `clamp(51.8%, 90% , ${maxY}%)`
        rightPupil.style.top = `clamp(51.8%, 90% , ${maxY}%)`

        setTimeout(() => {
            paupiere.style.height = ""
            paupiere.style.top = ""
            paupiere.style.borderRadius = ""
            leftPupil.style.top = `clamp(51.8%, ${mousePositionY}% , ${maxY}%)`
            rightPupil.style.top = `clamp(51.8%, ${mousePositionY}% , ${maxY}%)`
            leftPupil.style.transition = ""
            rightPupil.style.transition = ""
        }, 100);
    });
    randomBlinkInterval = Math.random() * (6000 - 3000) + 3000
}, randomBlinkInterval);

function emote(emotion){
    eyebrows.classList.remove("enerve")
    eyebrows.classList.remove("triste")
    switch (emotion) {
        case "enerve":
            eyebrows.classList.add("enerve")
            break;
        case "triste":
            eyebrows.classList.add("triste")
            break;
        default:
            break;
    }
}

const mockedBooksData = [
    {
        title: "first book",
        content: "This is the first book",
        date: new Date(2023, 8, 21)
    },
    {
        title: "second book",
        content: "This is the second book",
        date: new Date(2023, 9, 22)
    },
    {
        title: "third book",
        content: "This is the third book",
        date: new Date(2023, 9, 29)
    }
]

const moisTxt = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const actualDay = new Date().getDate()
const actualMonth = new Date().getMonth()
const actualYear = new Date().getFullYear()
let selectedMonth = actualMonth
let selectedYear = actualYear
let daysInMonth = new Date(2023, selectedMonth+1, 0).getDate()
generateBooks()

function generateBooks(){
    changeDateText.innerHTML = `${selectedYear}<br/>${moisTxt[selectedMonth]}`
    for (let index = 1; index <= daysInMonth; index++) {
        if (new Date(selectedYear, selectedMonth, index) <= new Date()) {
            const bookGroup = document.createElement("div")
            bookGroup.classList.add("book-group")
            const book = document.createElement("img")
            book.classList.add("bookicon")
            const bookDate = document.createElement("i")
            bookDate.innerText = index
            bookDate.classList.add("bookicon-date")
            if (new Date(selectedYear, selectedMonth, index).toISOString() == new Date(actualYear, actualMonth, actualDay).toISOString()) {
                bookGroup.classList.add("active-book")
                book.src = "assets/icons/livrevierge.png"
                bookGroup.classList.add("opened")
            }else if(mockedBooksData.find(book => book.date.toISOString() == new Date(selectedYear, selectedMonth, index).toISOString())){
                book.src = "assets/icons/livreouvert.png"
                bookGroup.classList.add("opened")
            }else{
                book.src = "assets/icons/livre.png"
            }
            book.addEventListener('click', () => {
                openBook(mockedBooksData.find(book => book.date.toISOString() == new Date(selectedYear, selectedMonth, index).toISOString()))
            })
            bookDate.addEventListener('click', () => {
                openBook(mockedBooksData.find(book => book.date.toISOString() == new Date(selectedYear, selectedMonth, index).toISOString()))
            })
            bookGroup.appendChild(book)
            bookGroup.appendChild(bookDate)
            booksContainer.appendChild(bookGroup)
        }
    }
}

function changeDate(dirrection){
    let changeDateFactor = dirrection === "right" ? 2 : 0
    selectedYear = new Date(selectedYear, selectedMonth + changeDateFactor, 0).getFullYear()
    selectedMonth = new Date(selectedYear, selectedMonth + changeDateFactor, 0).getMonth()
    console.log("after", selectedMonth)
    daysInMonth = new Date(2023, selectedMonth+1, 0).getDate()
    booksContainer.innerHTML = ""
    generateBooks()
    if ((selectedYear <= actualYear && selectedMonth<actualMonth) || selectedYear<actualYear) {
        changeDateRight.classList.add("show-row")
    }else{
        changeDateRight.classList.remove("show-row")
    }
}

changeDateLeft.addEventListener("click", () => {
    changeDate("left")
})

changeDateRight.addEventListener("click", () => {
    changeDate("right")
})

function openBook(bookDatas){
    booksContainerContainer.classList.add("disappear-books")
}