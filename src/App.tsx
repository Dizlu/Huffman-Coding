import * as React from 'react';
import * as _ from 'lodash';
import './App.css';
import HuffmanCoding from './utils/coding';
import HuffmanTree from './components/HuffmanTree';
import generateRandomSigns from './utils/generateRandomSigns';
import HuffmanStats from './components/HuffmanStats';

class App extends React.Component {
    textTemp = '';
    state = {
        text: 'test value for lolz'
    };

    setText = (text) => {
        this.setState(state => ({...this.state, text}));
    }

    setTempText = (event) => {
        this.textTemp = event.target.value;
    }

    render() {
        const huffmanCode = new HuffmanCoding(generateRandomSigns(this.state.text));
        const leaf = _.get(huffmanCode.root, 'leftLeaf.leftLeaf.leftLeaf.rightLeaf', null);
        console.log(huffmanCode.getNodeCode(leaf));
        return (
            <div className="App">
                <div style={{display: 'flex', height: '40px', padding: '10px', justifyContent: 'space-around'}}>
                    <p>Enter your code: </p>
                    <input onChange={this.setTempText}/>
                    <button onClick={() => this.setText(this.textTemp)}> Generate tree!</button>
                </div>
                <div style={{display: 'flex'}}>
                    <HuffmanTree huffmanCode={huffmanCode}/>
                    <HuffmanStats huffmanCode={huffmanCode} />
                </div>
            </div>
        );
    }
}

export default App;
