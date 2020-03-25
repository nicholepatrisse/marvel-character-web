const d3 = require('d3');
const $ = require('jquery');
const getRelated = require('../util/api_util').getRelated

let viewWidth = document.querySelector('svg').clientWidth;
let viewHeight = document.querySelector('svg').clientHeight;
document.addEventListener('resize', () => {
    viewWidth = document.querySelector('svg').clientWidth;
    viewHeight = document.querySelector('svg').clientHeight; 
});

const data = {};
const fetchCharacter = async(resouceURI) => {
  await getRelated(resouceURI).then(res => {
    let character = res['data']["results"][0]
    data[character.id] = character;
    fetchStories(character)
  });
};

const fetchStories = async(character) => {
    let collectionURI = character.stories.collectionURI;
    data[character.id]['children'] = [];
    await getRelated(collectionURI).then(res => {
        let stories = res['data']["results"]
        stories.forEach(story => {
            data[character.id]['children'].push(story);
        })
    });
};

const svg = d3.select('#chart');
const rScale = d3.scaleLinear().range([10, 50])
const color = d3.scaleOrdinal(d3.schemePaired)

const renderCharacterBubbles = () => {
    let nodes = Object.values(data);
    if (nodes.length < 2) {
        let maxStories = nodes[0].stories.available || 100;
        rScale.domain([1, maxStories])
    } else {
        rScale.domain(d3.extent(nodes, d => d.stories.available))
    };
    color.domain(nodes.map(character => character.id))

    let bubbles = svg.selectAll('.bubble').data(nodes)
    bubbles.enter().append('circle')
            .attr('cx', Math.random() * 500)
            .attr('cy', Math.random() * 500)
            .attr('class', 'bubble')
            .style('fill', d => color(d.stories.available))
            .style('opacity', 0.5)
            .attr('r', d => rScale(d.stories.available))

    bubbles.attr('r', d => rScale(d.stories.available))
    bubbles.exit().remove();
};

const buildBubbles = async(resouceURI) => {
    await fetchCharacter(resouceURI);
    console.log(data);
    renderCharacterBubbles();
    // svg.selectAll('.node').remove();
    // Object.values(nodes).forEach(character => {
    //     radius = character.stories.available > 1000 
    //         ? character.stories.available / 100
    //         : character.stories.available > 100
    //         ? character.stories.available / 10
    //         : 5;

    //     svg.append('circle')
    //         .attr('cx', Math.random() * 500)
    //         .attr('cy', Math.random() * 500)
    //         .attr('class', 'node')
    //         .attr('r', radius)
    //         .style('fill', 'blue')
    //         .style('opacity', 0.5)

    //     storyBubbles(character);
    // })
};

module.exports = buildBubbles;