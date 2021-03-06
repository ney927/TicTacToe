import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.coloured) {
    return (
      <button className="boldSquare" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}


class Board extends React.Component {

  renderSquare(i) {
    let colourSquares = [false, false, false, false, false, false]
    const winner = calculateWinner(this.props.squares);
    if (winner){
      for(let i=0; i<winner.length; i++){
        colourSquares[winner[i]] = true;
      }
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        coloured = {colourSquares[i]}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      asc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  }

  jumpTo(step) {
    this.setState ({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  orderMoves() {
    document.getElementById('orderButton').innerHTML = this.state.asc ? 'Ascending' : 'Descending'
    this.setState ({
      asc: !this.state.asc,
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      move = this.state.asc ? move : history.length-1-move;
      const desc = move ? 'Go to move #'+move : 'Go to start';
      if (move===this.state.stepNumber){
        return (
          <li key={move}>
            <button style={{fontWeight:'bold'}} onClick ={()=> this.jumpTo(move) } >
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick ={()=> this.jumpTo(move) } >
              {desc}
            </button>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
  
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button id='orderButton' onClick={()=>this.orderMoves()}>Descending</button>
        </div>
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === squares[b] && squares[a] === squares[c] && squares[c] === squares[b] && squares[a]!==null) {
      return [a, b, c];
    }
  }
  if (!squares.includes(null)){
    return 'No one ??\\_(???)_/?? '
  }
  return null;
}