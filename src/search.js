const getCharacters = require('../util/api_util').getCharacters;
const getStories = require('../util/api_util').getStories;

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let searchTerm = '';
let characters;

const fetchCharacters = async() => {
    characters = await getCharacters().then(res => res[data][results]);
}

const showResults = async() => {
    searchResults.innerHTML = '';
    await fetchCharacters();
    const ul = document.createElement('ul');
    ul.classList.add('search-result-list');
    characters.filter(character => 
        character.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ).forEach(character => {
        const li = document.createElement('li');
        li.classList.add('search-result-item');
        li.innerText(character.name);
        ul.appendChild(li);
    })

    searchResults.appendChild(ul);
};

searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    showResults()
});