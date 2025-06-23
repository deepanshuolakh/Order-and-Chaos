class OrderAndChaos {
    constructor() {
        this.board = Array(6).fill().map(() => Array(6).fill(''));
        this.currentPlayer = 'Order';
        this.selectedSymbol = null;
        this.gameOver = false;
        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.bindEvents();
        this.updateUI();
    }

    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                gameBoard.appendChild(cell);
            }
        }
    }

    bindEvents() {
        document.getElementById('symbol-x').addEventListener('click', () => this.selectSymbol('X'));
        document.getElementById('symbol-o').addEventListener('click', () => this.selectSymbol('O'));
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
    }

    selectSymbol(symbol) {
        this.selectedSymbol = symbol;
        document.querySelectorAll('.symbol-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById(`symbol-${symbol.toLowerCase()}`).classList.add('selected');
    }

    handleCellClick(row, col) {
        if (this.gameOver || this.board[row][col] !== '' || !this.selectedSymbol) {
            return;
        }

        this.board[row][col] = this.selectedSymbol;
        this.updateBoard();
        
        if (this.checkWin()) {
            this.endGame(`${this.currentPlayer} wins!`);
        } else if (this.isBoardFull()) {
            this.endGame('Chaos wins! Board is full.');
        } else {
            this.switchPlayer();
            this.updateUI();
        }
    }

    checkWin() {
        // Check for 5 in a row for Order player
        return this.checkLines('X') || this.checkLines('O');
    }

    checkLines(symbol) {
        // Check horizontal
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col <= 1; col++) {
                if (this.checkLine(row, col, 0, 1, symbol)) return true;
            }
        }

        // Check vertical
        for (let row = 0; row <= 1; row++) {
            for (let col = 0; col < 6; col++) {
                if (this.checkLine(row, col, 1, 0, symbol)) return true;
            }
        }

        // Check diagonal (top-left to bottom-right)
        for (let row = 0; row <= 1; row++) {
            for (let col = 0; col <= 1; col++) {
                if (this.checkLine(row, col, 1, 1, symbol)) return true;
            }
        }

        // Check diagonal (top-right to bottom-left)
        for (let row = 0; row <= 1; row++) {
            for (let col = 4; col < 6; col++) {
                if (this.checkLine(row, col, 1, -1, symbol)) return true;
            }
        }

        return false;
    }

    checkLine(startRow, startCol, deltaRow, deltaCol, symbol) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
            const row = startRow + i * deltaRow;
            const col = startCol + i * deltaCol;
            if (row < 0 || row >= 6 || col < 0 || col >= 6) break;
            if (this.board[row][col] === symbol) {
                count++;
            } else {
                break;
            }
        }
        return count === 5;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'Order' ? 'Chaos' : 'Order';
        this.selectedSymbol = null;
        document.querySelectorAll('.symbol-btn').forEach(btn => btn.classList.remove('selected'));
    }

    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const symbol = this.board[row][col];
            
            cell.textContent = symbol;
            cell.disabled = symbol !== '';
            cell.className = 'cell';
            if (symbol) {
                cell.classList.add(symbol.toLowerCase());
            }
        });
    }

    updateUI() {
        document.getElementById('current-player').textContent = this.currentPlayer;
        const message = this.selectedSymbol 
            ? `${this.currentPlayer} selected ${this.selectedSymbol}. Click a cell to place it.`
            : `${this.currentPlayer}'s turn. Choose X or O.`;
        document.getElementById('game-message').textContent = message;
    }

    endGame(message) {
        this.gameOver = true;
        document.getElementById('game-message').textContent = message;
        document.getElementById('game-message').className = 'game-message winner';
        document.querySelectorAll('.cell').forEach(cell => cell.disabled = true);
        document.querySelectorAll('.symbol-btn').forEach(btn => btn.disabled = true);
    }

    resetGame() {
        this.board = Array(6).fill().map(() => Array(6).fill(''));
        this.currentPlayer = 'Order';
        this.selectedSymbol = null;
        this.gameOver = false;
        
        document.querySelectorAll('.symbol-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected');
        });
        
        document.getElementById('game-message').className = 'game-message';
        
        this.updateBoard();
        this.updateUI();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderAndChaos();
});