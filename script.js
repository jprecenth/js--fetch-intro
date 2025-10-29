
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
        alert('Write something before clicking "search", moron.');
    }
    
    // API url structure
    const response = await fetch(`${BASE_URL}${wordInput}`);
    // await needed due to async
    const data = await response.json();
    
    // display the searched term in all #chosenWord elements
    const chosenWord = document.querySelectorAll("#chosenWord");
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
        // add search to input field
        const searchTerm = newLi.textContent;
        // give to function
        const input = document.getElementById("word");
        input.value = searchTerm;
        // make it click
        document.getElementById("searchBtn").click();
        // clear the input field
        input.value = "";
    })
    // only keep the last 5 searches
    if (recentSearchList.children.length > 5) {
        recentSearchList.removeChild(recentSearchList.firstElementChild)
    } 
    
    // find IPA in html
    let IPA = document.getElementById("IPA");
    // make the html element read as IPA from API
    IPA.textContent = data[0].phonetics[0].text ?? "[No IPA available]";
    // if url: play, if not: don't play
    currentAudio = data[0].phonetics[0].audio || null;

    
    // display the data points
    document.getElementById("partOfSpeech").textContent = data[0].meanings[0].partOfSpeech;
    document.getElementById("definition").textContent = data[0].meanings[0].definitions[0].definition ?? "";
    document.getElementById("exampleSentence").textContent =
        data[0]?.meanings[0]?.definitions[0]?.example
        ? `❝${data[0]?.meanings[0]?.definitions[0]?.example}❞`
        : "Actually, this word is so goddamn easy that the fucking dictionary itself doesn't provide an example. Consider that, dickwad. Don't hurt yourself in the process.";
    const antonyms = data?.[0]?.meanings?.[0]?.definitions?.[0]?.antonyms ?? [];
    document.getElementById("antonym").textContent =
        antonyms.length > 0
        ? antonyms.join(", ")
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
        const inputList = document.querySelectorAll(".header");
        for (let input of inputList) {
            // for each header, create a paragraph, add class, add svg in HTML
            let bookMark = document.createElement("p");
            bookMark.classList.add("bookMark");
            bookMark.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>';
            // add before every header
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
