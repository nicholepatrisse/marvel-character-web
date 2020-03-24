const $ = require("jQuery");
const MD5 = require("crypto-js/md5");
const config = {
    privateKey: "680747c71381930a32b071c07a8a55d07a874bcb",
    publicKey: "af11c90b361c0c84785f26a81c8b450f"
};
let timestamp = Date.now();
let hash = MD5(timestamp + config.privateKey + config.publicKey);

const getCharacters = () => (
    $.ajax({
        url: `https://gateway.marvel.com:443/v1/public/characters?apikey=${config.publicKey}&ts=${timestamp}&hash=${hash}`,
        headers: {
            ts: Date.now(),
        },
        xhrFields: {
                withCredentials: true
        },
    })
);

const getStories = () => (
    $.ajax({
        url: `https://gateway.marvel.com:443/v1/public/stories?apikey=${config.publicKey}`,
        headers: {
            ts: Date.now(),
        }
    })
)

const getRelated = resourceURI => (
    $.ajax({
        url: `${resourceURI}?apikey=${config.publicKey}`,
        headers: {
            ts: Date.now(),
        }
    })
)

module.exports = {
    getCharacters,
    getStories,
    getRelated
}