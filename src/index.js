import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
      return (
        <Square
        value= {this.props.squares[i]} 
        onClick = {() => this.props.onClick(i)}
        />
      )
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
        squares: Array(9).fill(null),
      }],
      coordHistory: [],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  render() {
    const history = this.state.history;
    const coordHistory = this.state.coordHistory;
    const currentState = history[this.state.stepNumber];

    const winner = calculateWinner(currentState.squares);
    const status = winner ? 'Winner is ' + winner : 'Next player: ' + this.state.xIsNext ? 'X' : 'O';

    const moves = history.map((step, move) => {
      const desc = move ? 
      'Go to move #' + move :
      'To start of game';

      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
          <h4>Coords: {coordHistory[move]}</h4>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {currentState.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentState = history[history.length - 1];
    const squares = currentState.squares.slice();

    const coordHistory = this.state.coordHistory.slice(0, this.state.stepNumber + 1);
    if (squares[i] || calculateWinner(squares)) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      coordHistory: coordHistory.concat(`${(~~(i / 3)) + 1}, ${(i % 3) + 1}: ` + squares[i]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })

  }
}

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
