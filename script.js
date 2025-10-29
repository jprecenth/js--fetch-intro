
const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// eventlistener to IPA click
let currentAudio = null;
const IPAcontainer = document.getElementById("IPA-container");
// function to make audio play 
IPAcontainer.addEventListener("click", function() {
    if (currentAudio) new Audio(currentAudio).play();
})

async function fetchData(event) {
    // no reload pls
    event.preventDefault();
    
    // get input
    let wordInput = document.getElementById("word").value.trim();
    // if input is empty, alert
    if (wordInput == "") {
        alert('Write something before clicking "search", moron (◡‿◡✿)');
    }
    
    // get the API (with correct url structure)
    const response = await fetch(`${BASE_URL}${wordInput}`);
    // check if input exists but is not a word
    if (wordInput !== "" && !response.ok) {
        alert("That's not even a word, Einstein. Maybe try spelling it correctly instead?")
    }
    
    // await needed due to async
    const data = await response.json();
    
    // display the searched term in all .chosenWord elements
    const chosenWord = document.querySelectorAll(".chosenWord");
    for (let word of chosenWord) {
        word.textContent = data[0].word;
    }
    
    // create bullets in recent list
    let newLi = document.createElement("li");
    const recentSearchList = document.getElementById("recentSearchList");
    newLi.textContent = data[0].word;
    // check if it has already been searched, append if not
    if (!Array.from(recentSearchList.children).some(li => li.textContent === newLi.textContent)) {
        recentSearchList.appendChild(newLi);
    }
    // eventlistener to recent search
    newLi.addEventListener("click", function() {
        const searchTerm = newLi.textContent;
        const input = document.getElementById("word");
        // add the word to input field
        input.value = searchTerm;
        // make it click
        document.getElementById("searchBtn").click();
        // clear the input field, cause it's prettier
        input.value = "";
    })
    // only keep the last 5 searches
    if (recentSearchList.children.length > 5) {
        recentSearchList.removeChild(recentSearchList.firstElementChild)
    } 
    
    // find IPA in html
    let IPA = document.getElementById("IPA");
    // input IPA in HTML, if none exist, display error text
    IPA.textContent = data[0].phonetics[0].text ?? "[No IPA available]";
    // if url: play, if not: don't play
    currentAudio = data[0].phonetics[0].audio || null;
    
    // display the data points
    document.getElementById("partOfSpeech").textContent = data[0].meanings[0].partOfSpeech;
    document.getElementById("definition").textContent = data[0].meanings[0].definitions[0].definition ?? "";
    document.getElementById("exampleSentence").textContent =
        data[0]?.meanings[0]?.definitions[0]?.example
        // if definition exists, add quotations
        ? `❝${data[0]?.meanings[0]?.definitions[0]?.example}❞`
        // if not, display message
        : "Actually, this word is so goddamn easy that the fucking dictionary itself doesn't provide an example. Consider that, dickwad. Don't hurt yourself in the process.";
    const antonyms = data?.[0]?.meanings?.[0]?.definitions?.[0]?.antonyms ?? [];
    document.getElementById("antonym").textContent =
        // if more than 1 antonym, make list
        antonyms.length > 0
        ? antonyms.join(", ")
        // if none, display message
        : "None. Because how the fuck would that work, idiot?";
    
    // clear input
    document.getElementById("word").value = "";
    // visually
    document.getElementById("resultString").style.display = "flex";
    document.getElementById("noSearch").style.display = "none";
    
    // create books above every .header
    const allBookMarks = document.querySelectorAll(".bookMark");
    // only proceed if there are no bookmarks already, as to not create more with every search
    if (allBookMarks.length === 0) {
        // get all headers from resultstring
        const allHeaders = document.querySelectorAll(".header");
        // exclude the first one
        const inputList = Array.from(allHeaders).slice(1);
        
        // for each header, create paragraph, add stuff
        for (let input of inputList) {
            let bookMark = document.createElement("p");
            bookMark.classList.add("bookMark");
            bookMark.innerHTML = '❀';
            input.before(bookMark);
        }
    }
}

// create footer 
function createFooter() {
    for (let i = 0; i < 5; i++) {
        let flowerPower = document.getElementById("flower-power");
        let clone = flowerPower.cloneNode(true);
        document.querySelector("footer").appendChild(clone);    
    }
}
