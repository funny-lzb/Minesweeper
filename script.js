// 1.展示10x10的网格出来
/* 
  2.左键点击tile，实现翻牌
      a.如果离mine远，则展示空
      b.如果离mine近，则展示离你当前点击的tile附近3x3的网格里有几个mine
      c.如果刚好是mine，则Game Over

  难点：
      1.该采用什么数据结构来设计这个网格？
        数据结构 -> 二位数组，两个for循环生成10 x 10的网格
      2.怎么随机生成雷，并把雷跟html绑定在一起？
        随机生成雷 -> 生成一个x取0 ~ 9的随机数，生成一个y取0 ~ 9的随机数 
      2.1"随机生成雷"该采用什么数据结构来存储？
      3.对于mine附近的tile，怎么去让其智能识别周围的3x3网格里有几颗mine？
*/
// 3.右键点击tile，做标记
// 4.如果剩余tile数等于mine数量，则Win

// Display/UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from './minesweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener('click', () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener('contextmenu', e => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})
boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = 'You Win'
  }
  if (lose) {
    messageText.textContent = 'You Lose'
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}
