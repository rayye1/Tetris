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
  var frozen = false
  const colors = ['#0341AE', '#4EEC2E', '#A232F7 ', '#FFD500', '#42ECE1', '#FF3213', '#FF971C']

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
    [0, width, width*2, width*3],
    [width, width+1, width+2, width+3],
    [0, width, width*2, width*3],
    [width, width+1, width+2, width+3]
  ]
  const b_zTetromino = [
    [width, width+1, width*2+1, width*2+2],
    [width, width*2, width+1, 1],
    [width, width+1, width*2+1, width*2+2],
    [width, width*2, width+1, 1]
  ]

  const b_lTetromino = [
    [0, 1, width+1, width*2+1],
    [width+2, width*2, width*2+1, width*2+2],
    [0, width, width*2, width*2+1],
    [width, width*2, width+1, width+2]
  ]



  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, b_zTetromino, b_lTetromino]

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
    console.log("currentPosition" + currentPosition)
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
    if (!game_over) {
      if (e.keyCode == 80) {
        if (timerId) {
          clearInterval(timerId)
          timerId = null
          frozen = true
        }
        else {
          draw()
          timerId = setInterval(moveDown, game_speed)
          //nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          frozen = false
          displayShape()
        }
      }
    }
  }
  document.addEventListener('keydown', p_key)

  //drops all the way down
  function auto_drop(e) {
    if (!game_over) {
      if (e.keyCode == 67) {
        while (!frozen) {
          moveDown()
        }
      }
    }
  }
  document.addEventListener('keydown', auto_drop)

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
      frozen = true
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
    else {
      frozen = false
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
    //For l and backwards l tetromino
    if ((random == 0 || random == 6) && (currentRotation == 1 || currentRotation == 3) && (currentPosition % 10 == 8)) {
      currentPosition -= 1; //For l and backwards l tetromino
    }
    //For I tetromino
    if ((random == 4) && (currentRotation == 1 || currentRotation == 3)) {
      if (currentPosition % 10 == 7) {
        currentPosition -= 1
      }
      else if (currentPosition % 10 == 8) {
        currentPosition -= 2
      }
      else if (currentPosition % 10 == 9) {
        currentPosition -= 3
      }
    }
    //For Z-Tetromino
    if ((random == 1 || random == 5) && (currentRotation == 0 || currentRotation == 2) && (currentPosition % 10 == 8)) {
      currentPosition -= 1
    }
    else if ((random == 1 || random == 5) && (currentRotation == 1 || currentRotation == 3) && (currentPosition % 10 == 7)) {
      currentPosition += 1
    }
    if ((random == 2) && (currentRotation == 0) && (currentPosition % 10 == 8)) {
      currentPosition -= 1
    }
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
      [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2],
      [0, 1, displayWidth+1, displayWidth*2+1]
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
      if (!game_over) {
        if (timerId) {
          clearInterval(timerId)
          timerId = null
          frozen = true
        }
        else {
          draw()
          timerId = setInterval(moveDown, game_speed)
          //nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          frozen = false
          displayShape()
        }
      }
      else {
        document.location.reload() //allows refresh for game
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
