import { getRelated } from './api_util';
import { drawGraph } from '../src/graph';

const data = {};
const nodes = [];

export const fetchCharacter = async (resouceURI) => {
    await getRelated(resouceURI).then(async (res) => {
        let character = res['data']["results"][0]
        data[character.id] = character;
        data[character.id]['group'] = 'character'
        nodes.push(data[character.id])
        drawGraph(nodes)
        // await fetchComics(character)
        console.log('data updated')
    });
};

const fetchComics = async (character) => {
    let collectionURI = character.comics.collectionURI;
    await getRelated(collectionURI).then(res => {
        console.log(res)
    });
};