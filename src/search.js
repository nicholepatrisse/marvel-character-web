const getCharacters = require('../util/api_util').getCharacters;
// const getStories = require('../util/api_util').getStories;

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let searchTerm = '';
let characters;

const fetchCharacters = async() => {
    await getCharacters(searchTerm).then(res => {
        characters = res['data']['results']
        console.log(characters);
    });
}

const showResults = async() => {
    searchResults.innerHTML = '';
    if (searchTerm.length > 0) {
        await fetchCharacters()
        const ul = document.createElement('ul');
        ul.classList.add('search-result-list');
        characters.filter(character => 
            (character.name.toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
            character.stories.available > 0)
        ).forEach(character => {
            const li = document.createElement('li');
            li.classList.add('search-result-item');
            li.id = character.id;

            const img = document.createElement('img');
            img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            li.appendChild(img);

            const div = document.createElement('div')
            const h1 = document.createElement('h1')
            h1.innerText = character.name;
            div.appendChild(h1);
            const stories = document.createElement('div')
            stories.classList.add('story-count')
            stories.innerText += `${character.stories.available} Stories`
            div.appendChild(stories);
            li.appendChild(div);
            
            li.addEventListener('click', e => {
                console.log(e.currentTarget.id)
                // Create function to lookup character and add them to the canvas
            });
            ul.appendChild(li);
        });
        searchResults.appendChild(ul);
    }
};

searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    showResults()
});