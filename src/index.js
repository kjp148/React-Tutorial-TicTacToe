import React from 'react';
import ReactDOM from "react-dom";
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component
{
  renderSquare(i)
  {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render()
  {
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

class Game extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i)
  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // This allows us to resume from a history state and overwrite future history.
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // Slice creates a copy of the array so we don't mutate the last history object.
    if (calculateWinner(squares) || squares[i]) // Ignore grid clicks if the game has been won.
    {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // Flip between X and O
    this.setState({
      history: history.concat([
        {
          squares: squares,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, // Value used to flip between X and O
    });
  }

  jumpTo(step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const currentType = (move === this.state.stepNumber) ? // Handling for bolding the current history step.
        'history-button-current' :
        'history-button';
      return (
        <li key={move}>
          <button className={currentType} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    let status;
    if (winner)
    {
      status = 'Winner: ' + winner;
    }
    else
    {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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

function calculateWinner(squares)
{
  const lines = [ // Possible winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) // Iterate through each possible winning combination.
  {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) // If each square in the possible combination is equal
    {
      return squares[a];
    }
  }
  // Check if all squares are full but nobody has won
  if (!squares.includes(null))
  {
    return "Nobody";
  }
  else
  {
    return null;
  }
}