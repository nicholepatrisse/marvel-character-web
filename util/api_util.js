import { ajax } from 'jquery'
import { MD5 } from 'crypto-js'

const privateKey = "680747c71381930a32b071c07a8a55d07a874bcb";
const publicKey = "af11c90b361c0c84785f26a81c8b450f";
let timestamp = Date.now();
let hash = MD5(timestamp + privateKey + publicKey);

export const getCharacters = queryString => (
  ajax({
    url: `https://cors-anywhere.herokuapp.com/https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&nameStartsWith=${queryString}`
  })
);

export const buildRelatedUrl = resourceURI => (
  `https://cors-anywhere.herokuapp.com/${resourceURI}?apikey=${publicKey}&ts=${timestamp}&hash=${hash}`
);

export const buildOffsetUrl = (resourceURI, offset) => (
  `https://cors-anywhere.herokuapp.com/${resourceURI}?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&offset=${offset}&limit=50`
);