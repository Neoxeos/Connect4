const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

function setWidth(value) {
    let num = parseInt(value);
    myGame.reset(num, myGame.grid.nRows);
    myGame.grid.draw();
}

function setHeight(value) {
    let num = parseInt(value);
    myGame.reset(myGame.grid.nCols, num);
    myGame.grid.draw();
}

function startGame() {
    myGame.reset(7, 6);
    myGame.grid.draw();
}

function setTypeOne() {
    const playerOneSelect = document.getElementById("selectType");
    console.log(`Player One selected: ${playerOneSelect.value}`);
    if (playerOneSelect.value == "Human") {
        myGame.playerOne = null;
    }
    else if (playerOneSelect.value == "Bot") {
        myGame.playerOne = new Player_User({limit:0, maxDepth:2}); // will add config here
    }
    else if (playerOneSelect.value == "Random") {
        myGame.playerOne = new Player_Random();
    }
    else if (playerOneSelect.value == "Greedy") {
        myGame.playerOne = new Player_Greedy();
    }
}

function setTypeTwo() {
    const playerTwoSelect = document.getElementById("selectType2");
    console.log(`Player Two selected: ${playerTwoSelect.value}`); 
    if (playerTwoSelect.value == "Human") {
        myGame.playerTwo = null;
    }
    else if (playerTwoSelect.value == "Bot") { 
        myGame.playerTwo = new Player_User({limit:0, maxDepth:3}); // will add config here
    }
    else if (playerTwoSelect.value == "Random") {
        myGame.playerTwo = new Player_Random();
    }
    else if (playerTwoSelect.value == "Greedy") {
        myGame.playerTwo = new Player_Greedy();
    }  
}


class Grid 
{
    constructor(nRows, nCols) 
    {

        // x: column index
        // y: row index
        ctx.fillStyle = '#468ec9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.nRows = nRows;
        this.nCols = nCols;
        this.cells = [];

        this.sizeC = Math.floor(canvas.width / this.nCols); // length of each column
        this.sizeR = Math.floor(canvas.height / this.nRows); // height of each row

        // get x and y coordinates of the center of the circle
        this.circleX = Math.floor(this.sizeC / 2);
        this.circleY = Math.floor(this.sizeR / 2);

        // get circle radius used for sizing the circles
        this.circleRadius = Math.min(this.circleX, this.circleY)

        for (var i = 0; i < this.nCols; i++)
        {
            for (var j = 0; j < this.nRows; j++)
            {
                this.cells.push(
                    { x: this.circleX + i * this.sizeC,
                      y: this.circleY + j * this.sizeR,
                      color: 'white'
                     });
            }
        }
    }

    // helper function to get column number from x coordinate
    getColumn(x) 
    {
        return Math.floor(x / this.sizeC);
    }

    // clear canvas and reset game grid
    newGrid(nRows, nCols) 
    {
        // x: column index
        // y: row index
        ctx.fillStyle = '#468ec9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.nRows = nRows;
        this.nCols = nCols;
        this.cells = [];

        this.sizeC = Math.floor(canvas.width / this.nCols); // length of each column
        this.sizeR = Math.floor(canvas.height / this.nRows); // height of each row

        // get x and y coordinates of the center of the circle
        this.circleX = Math.floor(this.sizeC / 2);
        this.circleY = Math.floor(this.sizeR / 2);

        // get circle radius used for sizing the circles
        this.circleRadius = Math.min(this.circleX, this.circleY)

        for (var i = 0; i < this.nCols; i++)
        {
            for (var j = 0; j < this.nRows; j++)
            {
                this.cells.push(
                    { x: this.circleX + i * this.sizeC,
                      y: this.circleY + j * this.sizeR,
                      color: 'white'
                     });
            }
        }
    }

    // draws the board in current state
    draw() 
    {
        // vertical lines
        for (let r = 0; r < this.nCols; r++ )
        {
            ctx.beginPath();
            ctx.moveTo(r * this.sizeC , 0);
            ctx.lineTo(r * this.sizeC , canvas.height);

            // Draw the Path
            ctx.stroke();
        }

        //horizontal lines
        for (let c = 0; c < this.nRows; c++ )
        {
            ctx.beginPath();
            ctx.moveTo(0, c * this.sizeR);
            ctx.lineTo(canvas.width, c * this.sizeR );
            // Draw the Path
            ctx.stroke();
        }

        for (const cell of this.cells)
        {
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, this.circleRadius * 0.9, 0, 2 * Math.PI);
            ctx.fillStyle = cell.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "grey";
            ctx.stroke();
        }
    }

    // displays next piece to be played
    hover() 
    {
        canvas.addEventListener('mousemove', (event) => {
            this.draw();
            ctx.beginPath();
            // how many pieces are in the column
            const numInCol = gameState.pieces[this.getColumn(event.clientX)];

            // calculate the position of the circle based on the column and number of pieces
            const offset = Math.floor(numInCol * this.sizeR);

            const x = this.circleX +  this.getColumn(event.clientX) * (this.sizeC);
            const y = canvas.height - this.circleY - offset;

            ctx.arc(x,y, this.circleRadius * 0.6, 0, 2 * Math.PI);
            if (gameState.player == PLAYER_ONE) {ctx.fillStyle = 'red';}
            else {ctx.fillStyle = 'yellow';}
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "grey";
            ctx.stroke();
        });
    }

    getPosition(event)
    {
        const numInCol = gameState.pieces[this.getColumn(event)];
        // calculate the position of the circle based on the column and number of pieces
        const offset = (this.nRows-1) * this.sizeR - Math.floor(numInCol * this.sizeR);

        const y = offset + this.circleY;
        const x = this.circleX +  this.getColumn(event) * (this.sizeC);
        return  [ x, y ];
    }

    displayAction(x,y)
    {
        const cell = this.cells.find(cell => 
            x == cell.x &&
            y == cell.y);
        if (gameState.player == PLAYER_ONE) {cell.color = 'red';}
        else {cell.color = 'yellow';}
        gameState.doAction(this.getColumn(x));
        this.draw();
    }

    click() 
    {
        canvas.addEventListener('click', (event) => {
            this.draw();
            const [x, y] = this.getPosition(event.clientX);

            // getting the correct cell
            if ( y > 0) {
                this.displayAction(x,y);
            }

            // call bot move if needed
            if (myGame.playerTwo != null)
            {
                const botAction = myGame.playerTwo.getAction(gameState);
                console.log(`Bot selected action: ${botAction}`);
                const [botX, botY] = this.getPosition(botAction * this.sizeR);
                console.log(`Bot played at x: ${botX}, y: ${botY}`);

                if ( botY > 0) {
                    this.displayAction(botX, botY);
                }
            }
        });
    }
}

class Game 
{
    constructor()
    {
        this.playerOne;
        this.playerTwo;
    }

    columns = 7;
    rows = 6;
    grid;

    reset(columns, rows)
    {
        this.columns = columns;
        this.rows = rows;
        gameState.reset(this.rows, this.columns);
        this.grid.newGrid(this.rows, this.columns);
    }

    run() 
    {
        this.grid.draw();
        this.grid.hover();
        this.grid.click();
    }
}

let myGame = new Game();
myGame.grid = new Grid(myGame.rows, myGame.columns);
let gameState = new GameState(myGame.columns, myGame.rows); // columns first here
console.log(gameState);
myGame.run();