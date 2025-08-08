const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

function setWidth(value) {
    myGame.grid.newGrid(myGame.grid.nRows, value);
    myGame.grid.draw();
}

function setHeight(value) {
    myGame.grid.newGrid(value, myGame.grid.nCols);
    myGame.grid.draw();
}


class Grid 
{
    constructor(nRows, nCols) 
    {
        this.newGrid(nRows, nCols);
    }

    // helper function to get column number from x coordinate
    getColumn(x) 
    {
        return Math.floor(x / this.sizeR);
    }

    // clear canvas and reset game grid
    newGrid(nRows, nCols) 
    {
        ctx.fillStyle = '#468ec9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.nRows = nRows;
        this.nCols = nCols;
        this.cells = [];

        this.sizeR = Math.floor(canvas.width / this.nCols); // length of each row
        this.sizeC = Math.floor(canvas.height / this.nRows); // height of each column

        // get x and y coordinates of the center of the circle
        this.circleX = Math.floor(this.sizeR / 2);
        this.circleY = Math.floor(this.sizeC / 2);

        // get circle radius used for sizing the circles
        this.circleRadius = Math.min(this.circleX, this.circleY)

        for (var i = 0; i < this.nRows; i++)
        {
            for (var j = 0; j < this.nCols; j++)
            {
                this.cells.push(
                    { x: this.circleX + j * this.sizeR,
                      y: this.circleY + i * this.sizeC,
                      color: 'white'
                     });
            }
        }
    }

    // draws the board in current state
    draw() 
    {
        for (let r = 0; r < this.nCols; r++ )
        {
            ctx.beginPath();
            ctx.moveTo(r * this.sizeR , 0);
            ctx.lineTo(r * this.sizeR , canvas.height);

            // Draw the Path
            ctx.stroke();
        }

        for (let c = 0; c < this.nRows; c++ )
        {
            ctx.beginPath();
            ctx.moveTo(0, c * this.sizeC);
            ctx.lineTo(canvas.width, c * this.sizeC );

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
                const numInCol = myGame.gameState.pieces[this.getColumn(event.clientX)];
                // calculate the position of the circle based on the column and number of pieces
                const offset = Math.floor(numInCol * this.sizeC);

                const x = this.circleX +  this.getColumn(event.clientX) * (this.sizeR);
                const y = canvas.height - this.circleY - offset;

                ctx.arc(x,y, this.circleRadius * 0.6, 0, 2 * Math.PI);
                ctx.fillStyle = 'yellow';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "grey";
                ctx.stroke();
        });
    }

    click() 
    {
        canvas.addEventListener('click', (event) => {
                this.draw();
                const numInCol = myGame.gameState.pieces[this.getColumn(event.clientX)];
                // calculate the position of the circle based on the column and number of pieces
                const offset = (this.sizeC * (this.nRows-1)) - Math.floor(numInCol * this.sizeC);

                // y position to place the piece
                const y = this.circleY + offset;
                const x = this.circleX +  this.getColumn(event.clientX) * (this.sizeR);

                // getting the correct cell
                if ( y > 0) {
                    const cell = this.cells.find(cell => 
                        x == cell.x &&
                        y == cell.y);
                    
                    console.log("Clicked on cell:", cell);
                    console.log(`X: ${x}, Y: ${y}`);
                    cell.color = 'yellow';
                    myGame.gameState.pieces[this.getColumn(event.clientX)]++;
                    this.draw();
                }
        });
    }
}

class Game 
{
    constructor(columns, rows)
    {
        this.columns = columns;
        this.rows = rows;
        console.log("Game initialized with columns:", this.columns, "and rows:", this.rows);
    }

    grid;
    gameState;

    run() 
    {
        this.grid.draw();
        this.grid.hover();
        this.grid.click();
    }
}

var myGame = new Game(5,4);
myGame.grid = new Grid(myGame.rows, myGame.columns);
myGame.gameState = new GameState(myGame.columns, myGame.rows); // columns first here
myGame.run();