import { getRelated } from '../util/api_util';

const d3 = require('d3');

let width = document.querySelector('svg').clientWidth;
let height = document.querySelector('svg').clientHeight;
document.addEventListener('resize', () => {
    width = document.querySelector('svg').clientWidth;
    height = document.querySelector('svg').clientHeight; 
});

const svg = d3.select('#chart')
    .attr('width', width)
    .attr('height', height)
const container = svg.append('g')

let data = {};
let graph = {
    nodes: [],
    links: []
};
let label = {
    nodes: [],
    links: []
};

const fetchCharacter = async(resouceURI) => {
  await getRelated(resouceURI).then(async(res) => {
    let character = res['data']["results"][0]
    data[character.id] = character;
    data[character.id]['group'] = 'character'
    graph.nodes.push(data[character.id])
    await fetchComics(character)
  });
};

const fetchComics = async(character) => {
    let collectionURI = character.comics.collectionURI;
    await getRelated(collectionURI).then(res => {
        let comics = res['data']["results"]
        comics.forEach(comic => {
            data[comic.id] = comic;
            data[comic.id]['group'] = 'comic'
            if (!graph.nodes.includes(data[comic.id])) {
                graph.nodes.push(data[comic.id])
            };
            graph.links.push({
                source: character,
                target: comic
            });
        });
    });
};

const color = {
    character: 'red',
    comic: 'blue'
};

const structureData = () => {
    graph.nodes.forEach((node, i) => {
        label.nodes.push({node: node})
        label.nodes.push({node: node})
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        })
    })
};

const neigh = (a, b) => {
    return a == b || adjList[a + '-' + b];
}

const fixna = x => {
    if (isFinite(x)) return x;
    return 0;
}

const ticked = () => {
    node.call(updateNode);
    link.call(updateLink);

    labelLayout.alphaTarget(0.3).restart();
    labelNode.each((d, i) => {
        if (i % 2 === 0) {
            d.x = d.node.x;
            d.y = d.node.y;
        } else {
            let b = this.getBBox();
            let diffX = d.x - d.node.x;
            let diffY = d.y - d.node.y;
            let dist = Math.sqrt(diffX * diffX + diffY * diffY);
            let shiftX = b.width * (diffX - dist) / (dist * 2);
            shiftX = Math.max(-b.width, Math.min(0, shiftX));
            let shiftY = 16;
            this.setAttribute("transform", `translate(${shiftX}, ${shiftY})`);
        }
    })
    labelNode.call(updateNode);
}

const focus = d => {
    let index = d3.select(d3.event.target).datum().index;
    node.style('opacity', o => neigh(index, o.index) ? 1 : 0.1);
    labelNode.attr('display', o => neigh(index, o.node.index) ? 'block' : 'none')
    link.style('opacity', o => { 
        o.source.index === index || o.target.index === index ? 1 : 0.1;
    });
};

const unfocus = () => {
    labelNode.attr("display", 'block');
    node.style("opacity", 1);
    link.style("opacity", 1);
};

const updateLink = link => {
    link.attr("x1", d => fixna(d.source.x))
        .attr("y1", d => fixna(d.source.y))
        .attr("x2", d => fixna(d.target.x))
        .attr("y2", d => fixna(d.target.y))
};

const updateNode = node => {
    node.attr("transform", d => `translate(${fixna(d.x)}, ${fixna(d.y)})`)
};

const dragStarted = d => {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
};

const dragged = d => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
};

const dragEnded = d => {
    if (!d3.event.active) graphLayout.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

let labelLayout = d3.forceSimulation(label.nodes)
    .force('charge', d3.forceManyBody().strength(-50))
    .force('link', d3.forceLink(label.links).distance(0).strength(2))

let graphLayout = d3.forceSimulation(graph.nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(1))
    .force('y', d3.forceY(height / 2).strength(1))
    .force('link', d3.forceLink(graph.links).distance(50).strength(1))
    .on('tick', ticked)

let adjList = [];
graph.links.forEach(d => {
    adjList[d.source.index + '-' + d.target.index] = true;
    adjList[d.target.index + '-' + d.source.index] = true;
});

svg.call(
    d3.zoom()
    .scaleExtent([.1, 4])
    .on('zoom', () => container.attr("transform", d3.event.transform))
);

let link = container.append('g').attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', '1px')

let node = container.append('g').attr('class', 'nodes')
.selectAll('g')
.data(graph.nodes)
.enter()
.append('circle')
.attr('r', 5)
.attr('fill', d => color[d.group])

node.on('mouseover', focus).on('mouseout', unfocus);
node.call(
    d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
);

let labelNode = container.append('g').attr('class', 'label-nodes')
    .selectAll('text')
    .data(label.nodes)
    .enter()
    .append('text')
    .text((d, i) => i % 2 == 0 ? "" : d.node.id)
    .style('fill', '#555')
    .style('pointer-events', 'none')

node.on('mouseover', focus).on('mouseout', unfocus);

const buildBubbles = async(resouceURI) => {
    await fetchCharacter(resouceURI);
    structureData();
    console.log(graph);
    console.log(label);
};

export default buildBubbles;