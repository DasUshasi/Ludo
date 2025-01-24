let board = document.getElementById("board")
let cells = []

for (let index = 0; index < 15 * 15; index++) {
    let cell = document.createElement("div")
    cell.className = "cell"
    // cell.innerHTML = index
    board.appendChild(cell)
    cells.push(cell)
}

identifiers()

// for (let index = 0; index < 15 * 15; index++) {
//     cells[index].innerHTML = cells[index].id
// }

const players = ['p0', 'p1', 'p2', 'p3']

const playerName = {
    p0: "Player 1",
    p1: "Player 2",
    p2: "Player 3",
    p3: "Player 4"
}

const basePos = {
    p0: [32, 33, 47, 48],
    p1: [167, 168, 182, 183],
    p2: [176, 177, 191, 192],
    p3: [41, 42, 56, 57]
}

const inBase = {
    p0: [true, true, true, true],
    p1: [true, true, true, true],
    p2: [true, true, true, true],
    p3: [true, true, true, true]
}

const startpos = {
    p0: 91,
    p1: 201,
    p2: 133,
    p3: 23
}

const turn = {
    p0: 40,
    p1: 27,
    p2: 14,
    p3: 1
}

let playerPositions = {
    p0: [32, 33, 47, 48],
    p1: [167, 168, 182, 183],
    p2: [176, 177, 191, 192],
    p3: [41, 42, 56, 57]
}

let out = {
    p0: 0,
    p1: 0,
    p2: 0,
    p3: 0
}

let toHome = {
    p0: [false, false, false, false],
    p1: [false, false, false, false],
    p2: [false, false, false, false],
    p3: [false, false, false, false]
}

let inHomePath = {
    p0: [false, false, false, false],
    p1: [false, false, false, false],
    p2: [false, false, false, false],
    p3: [false, false, false, false]
}

let win = {
    p0: [false, false, false, false],
    p1: [false, false, false, false],
    p2: [false, false, false, false],
    p3: [false, false, false, false]
}

let homePath = {
    p0: [106, 107, 108, 109, 110, 111],
    p1: [202, 187, 172, 157, 142, 127],
    p2: [118, 117, 116, 115, 114, 113],
    p3: [22, 37, 52, 67, 82, 97]
}

setHome()

function movePlayer(player, playerIdx, dice) {
    let newPos = ((parseInt(dice) + parseInt(playerPositions[player][parseInt(playerIdx)]))) % 52

    // cannot move player piece if it has won
    if (win[player][parseInt(playerIdx)])
        return false

    // check if player is in home path
    if (inHomePath[player][parseInt(playerIdx)]) {
        // player piece wins
        if (parseInt(dice) === 5 - parseInt(playerPositions[player][parseInt(playerIdx)])) {
            cells[homePath[player][5]].appendChild(document.querySelector(`[player-id = "${player}"][index = "${playerIdx}"]`))
            win[player][parseInt(playerIdx)] = true
            extra++
            return true
        }
        // player piece moves some cells in the home path
        else if (parseInt(dice) < 5 - parseInt(playerPositions[player][parseInt(playerIdx)])) {
            let i = parseInt(playerPositions[player][parseInt(playerIdx)]) + parseInt(dice)
            playerPositions[player][parseInt(playerIdx)] = i
            cells[homePath[player][i]].appendChild(document.querySelector(`[player-id = "${player}"][index = "${playerIdx}"]`))
            return true
        }
        // else this player piece cannot move
        else
            return false
    }

    // check if player piece will enter towards home
    if (toHome[player][parseInt(playerIdx)] && (newPos - turn[player]) <= 6 && (newPos - turn[player]) > 0) {
        // calculate which cell in the home path will this piece be in
        let idx = parseInt(dice) - (turn[player] - parseInt(playerPositions[player][parseInt(playerIdx)]) + 52) % 52 - 1
        playerPositions[player][parseInt(playerIdx)] = idx
        inHomePath[player][parseInt(playerIdx)] = true
        cells[homePath[player][idx]].appendChild(document.querySelector(`[player-id = "${player}"][index = "${playerIdx}"]`))
        // piece directly wins
        if (idx === 5) {
            win[player][parseInt(playerIdx)] = true
            extra++
        }
        return true
    }

    let finalCell = document.getElementById(newPos + "")
    playerPositions[player][parseInt(playerIdx)] = newPos  // move to this position

    // if this position already has some pieces of other players in it (and it is not a star cell), then the piece at the top is eaten
    if (finalCell.children.length > 0 && !finalCell.classList.contains("star")) {
        let child = finalCell.children[finalCell.children.length - 1]
        let delPlayer = child.getAttribute('player-id')
        let delIdx = child.getAttribute('index')

        // eaten piece
        if (delPlayer !== player) {
            playerPositions[delPlayer][parseInt(delIdx)] = basePos[delPlayer][parseInt(delIdx)]
            finalCell.removeChild(child)
            cells[basePos[delPlayer][parseInt(delIdx)]].appendChild(child)
            out[delPlayer]--
            inBase[delPlayer][parseInt(delIdx)] = true
            toHome[delPlayer][parseInt(delIdx)] = false
            extra++
        }
    }

    finalCell.appendChild(document.querySelector(`[player-id = "${player}"][index = "${playerIdx}"]`))
    if ((newPos - parseInt(cells[startpos[player]].id) + 52) % 52 >= 26)
        toHome[player][parseInt(playerIdx)] = true
    return true
}

let diceRolled = false
let playerSelected = false
let currPlayer = 0
let index;
let dice;
let extra = 0;

let playerDiv = document.getElementById("player")
let diceDiv = document.getElementById("dice")
let diceImg = document.getElementById("roll")

document.addEventListener('click', (event) => {
    let target = event.target

    // selected piece must be of the current player
    if (diceRolled && target.getAttribute('player-id') === players[currPlayer]) {
        index = target.getAttribute('index')

        // see if this piece can move
        if (out[players[currPlayer]] > 0 && inBase[players[currPlayer]][parseInt(index)] && dice !== 6)
            playerSelected = false
        else
            playerSelected = true
    }
})

function waitForTrue() {
    return new Promise(resolve => {
        const checkCondition = setInterval(() => {
            if (playerSelected) {
                clearInterval(checkCondition);  // Stop the interval
                resolve();  // Resolve the promise
            }
        }, 100);  // Check every 100ms
    });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function diceRoll() {
    // roll dice
    dice = Math.floor(Math.random() * 6) + 1
    diceDiv.innerHTML = "Dice : "
    diceImg.setAttribute("src", "dice" + dice + ".png")
    diceButton.disabled = true

    // if dice is not 6 and no piece of this player is out then this player cannot play any move
    if (dice !== 6 && out[players[currPlayer]] === 0) {
        diceRolled = false
        playerSelected = false
        index = null
        await wait(1000)
        currPlayer = (currPlayer + 1) % 4
        diceButton.disabled = false
        highlightCurrentPlayerHome();
        diceDiv.innerHTML = "Roll!!"
        playerDiv.innerHTML = playerName[players[currPlayer]]
        return
    }

    // check if there is any move
    let flag = false
    for (let i = 0; i < 4; i++) {
        // if piece is in base and dice is 6 then there is move
        if (inBase[players[currPlayer]][i] && dice === 6) {
            flag = true
            break
        }
        // if piece has won or is in base it cannot move
        else if (win[players[currPlayer]][i] || inBase[players[currPlayer]][i])
            continue
        // if piece is not in home path it can move
        else if (!inHomePath[players[currPlayer]][i]) {
            flag = true
            break
        }
        // if piece is in home path it needs the correct dice to move
        else if (inHomePath[players[currPlayer]][i]) {
            if (dice <= 5 - parseInt(playerPositions[players[currPlayer]][i])) {
                flag = true
                break
            }
            else
                continue
        }
    }
    // if there is no valid moves of this player then move to next player
    if (!flag) {
        diceRolled = false
        playerSelected = false
        index = null
        await wait(1000)
        currPlayer = (currPlayer + 1) % 4
        diceButton.disabled = false
        highlightCurrentPlayerHome();
        diceDiv.innerHTML = "Roll!!"
        playerDiv.innerHTML = playerName[players[currPlayer]]
        return
    }

    diceRolled = true
    // put all player pieces to the top so they can be seen
    for (let i = 0; i < 4; i++) {
        let p = document.querySelector(`[player-id = "${players[currPlayer]}"][index = "${i}"]`)
        let parent = p.parentNode
        parent.removeChild(p)
        parent.appendChild(p)
    }

    await waitForTrue()  // wait till a piece is chosen

    let result;

    // if the piece is in base then it can only move if dice is 6
    if (inBase[players[currPlayer]][parseInt(index)]) {
        if (dice === 6) {
            playerPositions[players[currPlayer]][parseInt(index)] = cells[startpos[players[currPlayer]]].id
            cells[startpos[players[currPlayer]]].appendChild(document.querySelector(`[player-id = "${players[currPlayer]}"][index = "${index}"]`))
            out[players[currPlayer]]++
            inBase[players[currPlayer]][parseInt(index)] = false
            diceRolled = false
            playerSelected = false
            index = null
            diceButton.disabled = false
            diceDiv.innerHTML = "Roll!!"
            return
        }
        else
            result = false
    }
    else {
        // otherwise move the piece
        result = movePlayer(players[currPlayer], index, dice)
        if (dice === 6)
            extra++
    }

    // check win
    if (result && checkWin(players[currPlayer])) {
        diceDiv.innerHTML = "Win!!"
        return
    }

    // if the move was valid or the player is not getting any extra moves then move forward to next person
    if (result && extra === 0) {
        currPlayer = (currPlayer + 1) % 4
        playerDiv.innerHTML = playerName[players[currPlayer]]
    }

    // update states
    playerSelected = false
    index = null
    if (result) {
        dice = null
        diceRolled = false
        diceButton.disabled = false
        diceDiv.innerHTML = "Roll!!"
    }
    if (extra > 0)
        extra--
    highlightCurrentPlayerHome();
}

// check if current player has won
function checkWin(player) {
    return win[player][0] && win[player][1] && win[player][2] && win[player][3]
}

let diceButton = document.getElementById("button")
diceButton.addEventListener('click', diceRoll)
playerDiv.innerHTML = playerName[players[currPlayer]]
diceDiv.innerHTML = "Roll!!"

function highlightCurrentPlayerHome() {
    // Remove highlight from all homes
    const homes = document.querySelectorAll('.homeBox');
    homes.forEach(home => {
        home.classList.remove('highlight');
    });

    // Highlight the current player's home
    const currentHome = document.querySelector(`[player-id = "${players[currPlayer]}"].homeBox`)
    currentHome.classList.add('highlight');
}

highlightCurrentPlayerHome();

function setHome() {
    // place pieces in home
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let p = "p" + i
            let idx = j + ""
            let pos = basePos[p][idx]
            let piece = document.querySelector(`[player-id = "${p}"][index = "${idx}"]`)
            cells[pos].appendChild(piece)
        }
    }
}

function identifiers() {
    // identifiers to cells
    cells[6].id = "0"
    cells[7].id = "1"
    cells[8].id = "2"
    cells[23].id = "3"
    cells[38].id = "4"
    cells[53].id = "5"
    cells[68].id = "6"
    cells[83].id = "7"
    cells[99].id = "8"
    cells[100].id = "9"
    cells[101].id = "10"
    cells[102].id = "11"
    cells[103].id = "12"
    cells[104].id = "13"
    cells[119].id = "14"
    cells[134].id = "15"
    cells[133].id = "16"
    cells[132].id = "17"
    cells[131].id = "18"
    cells[130].id = "19"
    cells[129].id = "20"
    cells[143].id = "21"
    cells[158].id = "22"
    cells[173].id = "23"
    cells[188].id = "24"
    cells[203].id = "25"
    cells[218].id = "26"
    cells[217].id = "27"
    cells[216].id = "28"
    cells[201].id = "29"
    cells[186].id = "30"
    cells[171].id = "31"
    cells[156].id = "32"
    cells[141].id = "33"
    cells[125].id = "34"
    cells[124].id = "35"
    cells[123].id = "36"
    cells[122].id = "37"
    cells[121].id = "38"
    cells[120].id = "39"
    cells[105].id = "40"
    cells[90].id = "41"
    cells[91].id = "42"
    cells[92].id = "43"
    cells[93].id = "44"
    cells[94].id = "45"
    cells[95].id = "46"
    cells[81].id = "47"
    cells[66].id = "48"
    cells[51].id = "49"
    cells[36].id = "50"
    cells[21].id = "51"

    cells[91].classList.add("star")
    cells[36].classList.add("star")
    cells[23].classList.add("star")
    cells[102].classList.add("star")
    cells[133].classList.add("star")
    cells[188].classList.add("star")
    cells[201].classList.add("star")
    cells[122].classList.add("star")
}