const PLAYER_ONE = 0;
const PLAYER_TWO = 1;
const PLAYER_NONE = 2;
const PLAYER_DRAW = 3;

class GameState {

    constructor(width, height) {
        this.width = width;
        this.height = height;

        //pices[n] = number of pieces in column n
        this.pieces = (new Array(width)).fill(0);

        this.totalPieces = 0;
        this.board = new Array(width).fill(0).map( x => new Array(height).fill(PLAYER_NONE));

        // current player
        this.player = PLAYER_ONE;

        this.dirs = [[1, 0], [0, 1], [1, 1], [1, -1]]; // horizontal, vertical, diagonal right, diagonal left

        // needed to check for a win
        this.connect = 4;

        this.winInfo = [null, null, null];
    }

    // returns piece type at x,y
    get (x,y) {
        return this.board[x][y];
    }

    // returns wheter or not the given x,y position is on board
    isOnBoard (x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    // do given action
    // action is integer rep of column index
    // action places pieces and switches player
    doAction(action) {
        this.board[action][this.pieces[action]++] = this.player;
        this.player = (this.player + 1) % 2;
        this.totalPieces++;
    } 

    undoAction(action) {
        if (this.pieces[action] == 0) {
            console.log("Warning: undoAction called on empty column", action);
             return;
        }

        this.board[action][--this.pieces[action]] = PLAYER_NONE;
        this.player = (this.player + 1) % 2;
        this.totalPieces--;
    }

    // Check to see if action legal
    // acion is integer rep of column index
    // action legal if col not full
    isLegalAction(action) {
        return action >= 0 && action < this.width && this.pieces[action] < this.height;
    }

    // returns array of legal actions
    // checks each column to see if a piece can be put there and adds it to the array
    getLegalActions() {
        let actions = [];
        for (let i = 0; i < this.width; i++) {
            if (this.isLegalAction(i)) {
                actions.push(i);
            }
        }
        return actions;
    }

    // check to see if there is a win in direction
    isWin() {
        let p = this.get(x,y);
        if (p == PLAYER_NONE) {
            return;
        }

        let cx = x, cy = y;
        for (let c = 0; c < connect - 1; c++)
        {
            cx += dir[0]; cy += dir[1];
            if (!this.isOnBoard(cx,cy)) {return false;}
            if (this.get(cx,cy) != p) { return false;}
        }
        return true;
    }   

    // check to see if win on board
    winner() {
        for (let d = 0; d < this.dirs.length; d++)
        {
            for (let y = 0; y < this.height; y++)
            {
                if (this.checkWin(x,y,this.dirs[d], this.connect))
                {
                    if (this.checkWin(x,y,this.dirs[d], this.connect))
                    {
                        this.winInfo = [x,y,this.dirs[d]];
                        return this.get(x,y);
                    }
                }
            }
        }

        if (this.totalPieces == this.width * this.height) {return PLAYER_DRAW;}
        else {return PLAYER_NONE;}
    }

    // make a deep copy of state
    copy() {
        let state = new GameState(this.width, this.height);
        state.player = this.player;
        state.totalPieces = this.totalPieces;
        for (let x = 0; x < this.width; x++)
        {
            state.pieces[x] = this.pieces[x];
            for (let y = 0; y < this.height; y++)
            {
                state.board[x][y] = this.board[x][y];
            }
        }
        return state;
    }
}