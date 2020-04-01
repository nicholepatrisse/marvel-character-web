import { fetchCharacter } from './graph';
import { getCharacters } from '../util/api_util';

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let searchTerm = '';
let characters = [];

const fetchCharacters = async() => {
    await getCharacters(searchTerm).then(res => {
        characters = res['data']['results']
    }).catch(err => {
        showErrorMessage()
        console.log(err.responseJSON);
    });
};

const showErrorMessage = () => {
    let errors = document.getElementById('errors');
    let gif = document.createElement('img');
    gif.src = 'https://media1.giphy.com/media/M9TuBZs3LIQz6/giphy.gif?cid=ecf05e47f347ee95b4ed2e0246bc780fc82d4932e9dd7c55&rid=giphy.gif'
    errors.appendChild(gif)
    let text = document.createElement('div');
    text.innerText = 'Oops, something went wrong.';
    errors.appendChild(text)
    errors.classList.add('display-errors')
}

const handleClick = e => {
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
    errors.innerText = '';
    searchTerm = e.target.value;
    showResults()
});