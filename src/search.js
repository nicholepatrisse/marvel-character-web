import { fetchCharacter } from '../util/graph_builder';
import { getCharacters } from '../util/api_util';

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let searchTerm = '';
let characters;

const fetchCharacters = async() => {
    await getCharacters(searchTerm).then(res => {
        characters = res['data']['results']
    });
};

const handleClick = e => {
    // buildBubbles(e.currentTarget.id)
    fetchCharacter(e.currentTarget.id);
    searchInput.value = '';
    searchResults.innerHTML = "";
};

const addCharacterInfo = character => {
    const div = document.createElement('div')

    const h1 = document.createElement('h1')
    h1.innerText = character.name;
    div.appendChild(h1);

    const comics = document.createElement('div')
    comics.classList.add('story-count')
    comics.innerText += `${character.comics.available} Comics`
    div.appendChild(comics);

    return div;
};

const buildListItem = character => {
    const li = document.createElement('li');
    li.classList.add('search-result-item');
    li.id = character.resourceURI;
    
    const img = document.createElement('img');
    img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    li.appendChild(img);
    
    const div = addCharacterInfo(character);
    li.appendChild(div);
    
    li.addEventListener('click', handleClick);
    return li;
};

const showResults = async() => {
    searchResults.innerHTML = '';
    if (searchTerm.length > 0) {
        await fetchCharacters()
        const ul = document.createElement('ul');
        ul.classList.add('search-result-list');
        characters.filter(character => 
            (character.name.toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
            character.comics.available > 0)
        ).forEach(character => {
            let li = buildListItem(character);
            ul.appendChild(li);
        });
        searchResults.appendChild(ul);
    }
};

searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    console.log(searchTerm);
    showResults()
});