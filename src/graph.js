import { 
    select, 
    scaleLinear, 
    scaleOrdinal, 
    schemeCategory10,
    json,
    forceSimulation,
    forceCenter,
    forceX,
    forceY,
    forceManyBody,
    max,
    forceLink
} from 'd3'
import { buildRelatedUrl, buildOffsetUrl } from '../util/api_util';

let graph = {
    nodes: [],
    links: []
};

let width = document.querySelector('.chart-area').offsetWidth;
let height = document.querySelector('.chart-area').offsetHeight;

const svg = select('svg')
svg.attr('width', width).attr('height', height)

window.addEventListener('resize', () => {
    width = document.querySelector('.chart-area').offsetWidth;
    height = document.querySelector('.chart-area').offsetHeight;
    svg.attr('width', width).attr('height', height);
    resizeGraph()
});

const resizeGraph = () => {
    svg.select('g').remove();
    render()
};

function render() {
    const margin = { top: 70, bottom: 50, left: 50, right: 50 }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const container = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const graphLayout = forceSimulation(graph.nodes)
        .force('charge', forceManyBody().strength(-500))
        .force('center', forceCenter().x(innerWidth / 2).y(innerHeight / 2))
        .force('forceX', forceX().strength(1).x(innerWidth / 2))
        .force('forceY', forceY().strength(1).y(innerHeight / 2))
        .force('link', forceLink(graph.links)
            .id(d => d.id)
            .distance(60)
            .strength(1)
        );
    graphLayout.stop()

    const characterRadius = d => d.type === 'character' ? d.comics.available : 1;
    const rScale = scaleLinear()
        .domain([1, max(graph.nodes, d => characterRadius(d))])
        .range([10, 30]);
    const sizeBubble = d => {
        let size = 5;
        if (d.type === 'character') size = rScale(characterRadius(d));
        return size;
    };

    const colorId = d => d.type === 'character' ? d.id : 1;
    const colorScale = scaleOrdinal(schemeCategory10);

    const link = container.append('g')
        .attr('class', 'links')
        .selectAll('line').data(graph.links)
            .enter().append('line')
            .attr("stroke", "#aaa")
            .attr("stroke-width", "1px");

    const node = container.append('g')
        .attr('class', 'nodes')
        .selectAll('circle').data(graph.nodes)
            .enter().append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => sizeBubble(d))
            .attr('fill', d => colorScale(colorId(d)))

    graphLayout.on('tick', d => {
        node.call(updateNode);
        link.call(updateLink);
    });
    graphLayout.restart();

    const fixna = x => {
        if (isFinite(x)) return x;
        return 0;
    }

    const updateNode = node => {
        node.attr('cx', d => fixna(d.x))
        node.attr('cy', d => fixna(d.y))
    };

    const updateLink = link => {
        link.attr('x1', d => fixna(d.source.x))
        link.attr('y1', d => fixna(d.source.y))
        link.attr('x2', d => fixna(d.target.x))
        link.attr('y2', d => fixna(d.target.y))
    }
};

const store = {};
const formatCharacterData = character => {
    store[character.id] = character;
    store[character.id]['type'] = 'character';
    graph['nodes'] = Object.values(store);
};

const formatComicData = (comics, characterId) => {
    comics.forEach(comic => {
        store[comic.id] = comic;
        store[comic.id]['type'] = 'comic';
        let newLink = {
            target: characterId,
            source: comic.id
        };
        graph.links.push(newLink);
    });
    graph['nodes'] = Object.values(store);
};

const fetch100Comics = async(collectionURI, characterId) => {
    return json(buildOffsetUrl(collectionURI, 0)).then(data => {
        let comics = data['data']['results']
        formatComicData(comics, characterId)
        console.log(`API Called`)
        // render();
    });
}

const fetchAllComics = (collectionURI, characterId, comicsAvailable) => {
    let offset = 0;
    let allComics = [];
    while (offset < comicsAvailable) {
        allComics.push(fetch100Comics(collectionURI, characterId))
        offset += 100
    }
    Promise.all(allComics).then(() => render())
}

export const fetchCharacter = async (resourceURI) => {
    await json(buildRelatedUrl(resourceURI)).then(data => {
        let character = data['data']["results"][0]
        svg.select('g').remove();
        formatCharacterData(character)
        let collectionURI = character['comics']['collectionURI'];
        let comicsAvailable = character['comics']['available'];
        // fetch100Comics(collectionURI, character.id);
        fetchAllComics(collectionURI, character.id, comicsAvailable)
    }).catch(error => console.log(error));
};