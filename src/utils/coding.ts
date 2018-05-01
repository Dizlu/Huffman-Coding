import Sign from './Sign';
import generateRandomSigns from './generateRandomSigns';
import GraphNode from './GraphNode';
import Signs from '../interfaces/Signs';

interface SerializedNode {
    name: string;
    attributes: {
        p: number
    };
    children: SerializedNode[];
}

class HuffmanCoding {
    initialData: Signs;
    dataSigns: Sign[];
    graphNodes: GraphNode[];
    root: GraphNode;
    serialized: SerializedNode[];

    constructor(initialData: Signs = generateRandomSigns('asdasdasdasd')) {
        this.initialData = initialData;
        this.dataSigns = initialData
            .signs
            .sort()
            .filter( (el, index) => !index || el !== initialData.signs[index - 1]) // dirty done - get only unique ones
            .map(this.mapStringToSign);
        this.graphNodes = this.dataSigns.map(this.mapSignToGraphNode);

        this.createGraph();

        this.serialized = this.serializeGraph();
    }

    getNodeCode = (node: GraphNode) => {
        let code = '';
        let tempNode = node;
        console.log(tempNode);
        while (tempNode.parent) {
            if (tempNode.parent.leftLeaf === tempNode) {
                code += '1';
            } else if (tempNode.parent.rightLeaf === tempNode) {
                code += '0';
            }
            tempNode = tempNode.parent;
        }
        return code.split('').reverse().join('');
    }

    countGraphEntropy = () => {
        let entropy = 0;
        this.dataSigns
            .forEach( sign => {
                entropy += sign.p * Math.log2( 1 / sign.p);
            });
        return entropy;
    }

    mapGraphNodeToSerializedData = (node: GraphNode): SerializedNode => {
        const serializedNode = {
            name: node.sign.name || '',
            attributes: {
                p: +node.sign.p.toFixed(2)
            },
            children: []
        };

        if (node.leftLeaf) {
            const leftLeafSerialized: SerializedNode = this.mapGraphNodeToSerializedData(node.leftLeaf);
            serializedNode.children.push(leftLeafSerialized);
        }
        if (node.rightLeaf) {
            const rightLeafSerialized: SerializedNode = this.mapGraphNodeToSerializedData(node.rightLeaf);
            serializedNode.children.push(rightLeafSerialized);
        }

        return serializedNode;
    }

    serializeGraph = () => {
        return [this.mapGraphNodeToSerializedData(this.root)];
    }

    mapStringToSign = (sign: string): Sign => {
        return new Sign(sign, this.initialData[sign].count / this.initialData.stats.length);
    }

    mapSignToGraphNode = (sign: Sign): GraphNode => {
        return new GraphNode(sign);
    }

    createNewRootNode = (root: GraphNode) => {
        // Create new graph node with no sign
        let rightNode: GraphNode = this.graphNodes[0];
        this.graphNodes
            .forEach( (node) => {
                if (node.sign.p < rightNode.sign.p) {
                    rightNode = node;
                }
            });
        this.graphNodes = this.graphNodes.filter( filter => filter !== rightNode);

        // Add their propabilities and insert it to graph's sign's p
        const rootSign = new Sign('', root.sign.p + rightNode.sign.p);
        const rootNode = new GraphNode(rootSign, root, rightNode);

        root.parent = rootNode;
        rightNode.parent = rootNode;

        // Overwrite root node
        this.root = rootNode;
    }

    attachNodeLeft = (rootNode: GraphNode, childrenNode: GraphNode): GraphNode => {
        rootNode.leftLeaf = childrenNode;
        childrenNode.parent = rootNode;

        return rootNode;
    }

    attachNodeRight = (rootNode: GraphNode, childrenNode: GraphNode): GraphNode => {
        rootNode.rightLeaf = childrenNode;
        childrenNode.parent = rootNode;

        return rootNode;
    }

    createGraph = (): void => {
        // Get two least probable nodes (and delete them from this.graphNodes)
        const rootNode: GraphNode = this.graphNodes
            .reduce( (prev, next) => {
                return next.sign.p < prev.sign.p ? next : prev;
            });
        this.graphNodes = this.graphNodes.filter( filter => filter !== rootNode);
        this.root = rootNode;

        this.createNewRootNode(this.root);
        this.graphNodes.forEach( graphNode => {
            this.createNewRootNode(this.root);
        });

    }
}

export default HuffmanCoding;