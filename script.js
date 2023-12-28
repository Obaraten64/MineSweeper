let minesPlacement = []
let cells = []
let height = 0
let length = 0
let mines = 0
let tilesChecked = 0
let flagWronglyPlaced = false

function createBoard(h, l, m) {
	height = h
	length = l
	mines = m

	if (isNaN(height) || isNaN(length) || isNaN(mines) || height < 0 || length < 0 || height > 100 || length > 100 || mines < 0 || mines >= (height * length)) {
		return alert("Не можливо створити поле з заданих параметрів")
	}

	minesPlacement = []
	cells = []	
	tilesChecked = 0
	flagWronglyPlaced = false
	let r = document.getElementById("tab")
	let i = document.getElementById("info")
	if (r != null && i != null) {
		r.parentNode.removeChild(r)
		i.parentNode.removeChild(i)
	}
	const tab = document.createElement("table")
	const info = document.createElement("div")
	tab.setAttribute("id", "tab")
	info.setAttribute("id", "info")
	info.innerText = "Залишолося мін: " + mines

	for (let i = 0; i < height; i++) {
		const row = document.createElement("tr")
		let cellsRow = []
		for (let j = 0; j < length; j++) {
			const cell = document.createElement("td")
			cell.setAttribute("id", i + "-" + j)
			cell.addEventListener("click", leftClick)
			cell.addEventListener("contextmenu", rightClick)
			cellsRow.push(cell)
			row.appendChild(cell)
		}
		cells.push(cellsRow)
		tab.appendChild(row)
	}
	document.body.appendChild(tab)
	document.body.appendChild(info)

	plantMines()
}

function revealBoard() {
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < length; j++) {
			const cell = cells[i][j]
			if (cell.getAttribute("id") != "clicked") {
				if (minesPlacement.includes(cell.getAttribute("id"))) {
					flagWronglyPlaced = (cell.innerText != "?" || flagWronglyPlaced)
					cell.innerText = "*"
					cell.setAttribute("id", "clicked")
				} else {
					let cord = cell.getAttribute("id").split("-")
					checkMine(+cord[0], +cord[1])
				}
			}
		}
	}
}

function plantMines() {
	let minesToPlace = mines
	while (minesToPlace > 0) {
		let mine = Math.floor(Math.random() * height) + "-" + Math.floor(Math.random() * length)
		if (!minesPlacement.includes(mine)) {
			minesPlacement.push(mine)
			minesToPlace--
		}
	}
}

function leftClick() {
	let cell = this
	if (cell.innerText != "?" && cell.getAttribute("id") != "clicked") {
		if (minesPlacement.includes(cell.getAttribute("id"))) {
			revealBoard()
			document.getElementById("info").innerText = "Ви підірвалися!"
		} else {
			let cord = cell.getAttribute("id").split("-")
			checkMine(+cord[0], +cord[1])
		}
	}
}

function rightClick(event) {
	event.preventDefault()
	let cell = this
	if (cell.getAttribute("id") != "clicked") {
		if (cell.innerText == "") {
			cell.innerText = "?"
			mines--
			if (mines == 0) {
				revealBoard()
				document.getElementById("info").innerText = flagWronglyPlaced ? "Ви підірвалися!" : "Перемога"
			} else {
				document.getElementById("info").innerText = "Залишолося мін: " + mines + "?"
			}
		} else if (cell.innerText == "?") {
			cell.innerText = ""
			mines++
			document.getElementById("info").innerText = "Залишолося мін: " + mines + "?"
		}
	}
}

function checkMine(a, b) {
	if (isInsideBoard(a, b) || cells[a][b].getAttribute("id") == "clicked") {
		return 0
	} 

	let minesFound = 0
	cells[a][b].setAttribute("id", "clicked")
	tilesChecked += 1

	minesFound += checkCell(a - 1, b - 1)
	minesFound += checkCell(a - 1, b)
	minesFound += checkCell(a - 1, b + 1)
	minesFound += checkCell(a + 1, b - 1)
	minesFound += checkCell(a + 1, b)
	minesFound += checkCell(a + 1, b + 1)
	minesFound += checkCell(a, b - 1)
	minesFound += checkCell(a, b + 1)

	if (minesFound > 0) {
		cells[a][b].innerText = minesFound
	} else {
		checkMine(a - 1, b - 1)
		checkMine(a - 1, b)
		checkMine(a - 1, b + 1)
		checkMine(a + 1, b - 1)
		checkMine(a + 1, b)
		checkMine(a + 1, b + 1)
		checkMine(a, b - 1)
		checkMine(a, b + 1)
	}

	if (tilesChecked == height * length - minesPlacement.length) {
		revealBoard()
		document.getElementById("info").innerText = "Перемога"
	}
}

function checkCell(a, b) {
	if (isInsideBoard(a, b)) {
		return 0
	} 
	if (minesPlacement.includes(a + "-" + b)) {
		return 1
	}
	return 0
}

function isInsideBoard(a, b) {
	return a < 0 || a >= height || b < 0 || b >= length
}