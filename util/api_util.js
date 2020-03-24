const $ = require("jQuery");
const MD5 = require("crypto-js/md5");
const privateKey = "680747c71381930a32b071c07a8a55d07a874bcb";
const publicKey = "af11c90b361c0c84785f26a81c8b450f";
let timestamp = Date.now();
let hash = MD5(timestamp + privateKey + publicKey);

const getCharacters = () => (
    $.ajax({
        url: `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hash}`,
        headers: {
            ts: Date.now(),
        },
    })
);

const getStories = () => (
    $.ajax({
        url: `https://gateway.marvel.com:443/v1/public/stories?apikey=${publicKey}&ts=${timestamp}&hash=${hash}`,
        headers: {
            ts: Date.now()
        },
    })
);

const getRelated = resourceURI => (
    $.ajax({
        url: `${resourceURI}?apikey=${publicKey}&ts=${timestamp}&hash=${hash}`,
        headers: {
            ts: Date.now()
        }
    })
);

module.exports = {
    getCharacters,
    getStories,
    getRelated
}