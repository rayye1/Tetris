document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  var game_over = false
  var game_speed = 750
  const colors = ['green', 'red', 'purple', 'orange', '#42ECE1', 'yellow']

  //The Terominoes
  const lTetromino = [
    [0, width, width*2, 1],
    [width, width+1, width+2, width*2+2],
    [width*2, 1, width+1, width*2+1],
    [width, width*2, width*2+1, width*2+2]
  ]
  const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ]
  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]
  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]
  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]
  const b_zTetromino = [
    [width, width+1, width*2+1, width*2+2],
    [width, width*2, width+1, 1],
    [width, width+1, width*2+1, width*2+2],
    [width, width*2, width+1, 1]
  ]



  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, b_zTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //random select
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]


  //draw the first teromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  //movement for the Terominoes
  //timerId = setInterval(moveDown, 1000)

  //keycode listeners
  function control(e) {
    if (!game_over) {
      if (timerId) {
        if (e.keyCode == 37) {
          moveLeft()
        }
        else if (e.keyCode == 38) {
          rotate()
        }
        else if (e.keyCode == 39) {
          moveRight()
        }
        else if (e.keyCode == 40) {
          moveDown()
        }
      }
    }
  }
  document.addEventListener('keydown', control)

  //pause game with key p
  function p_key(e) {
    if (e.keyCode == 80) {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      else {
        draw()
        timerId = setInterval(moveDown, game_speed)
        //nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
    }
  }
  document.addEventListener('keydown', p_key)

  //movedown function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //new Tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if (!isAtLeftEdge) currentPosition -= 1
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
      }
      draw()
    }

    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width == width-1)
      if (!isAtRightEdge) currentPosition += 1
      if (current.some(index=> squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
      }
      draw()
    }

    //rotate tetromino
    function rotate() {
      undraw()
      currentRotation++
      if (currentRotation == current.length) {
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
      draw()
    }

    //next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //The tetrominoes
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2],
      [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],
      [1, displayWidth, displayWidth+1, displayWidth+2],
      [0, 1, displayWidth, displayWidth+1],
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
      [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2]
    ]

    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }

    //start/pause button
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      else {
        draw()
        timerId = setInterval(moveDown, game_speed)
        //nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
    })

    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }

    function gameOver() {
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'GAME OVER'
        //alert('GAME OVER')
        game_over = true;
        //document.location.reload();
        clearInterval(timerId)
      }
    }




})
