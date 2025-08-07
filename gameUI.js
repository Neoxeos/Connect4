

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;
ctx.fillStyle = '#468ec9ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function setWidth(value) {
    canvas.width = value;
}

function setHeight(value) {
    canvas.height = value; 
}


class Grid 
{
    constructor(nRows, nCols) 
    {
        this.nRows = nRows;
        this.nCols = nCols;
        this.cells = [];
        this.sizeR = canvas.width / this.nCols; // top left 
        this.sizeC = canvas.height / this.nRows; // top right
        this.circleRadius = (this.sizeR + this.sizeC) / 4; // radius of the circle
        //this.circleRadius = (canvas.width / (2 * this.nRows));

        for (var i = 0; i < this.nRows; i++)
        {
            for (var j = 0; j < this.nCols; j++)
            {
                this.cells.push(
                    { x: this.circleRadius + i * this.sizeR,
                      y: this.circleRadius + j * this.sizeC,
                      color: 'white'
                     });
            }
        }
    }

    // helper function to get column number from x coordinate
    getColumn(x) 
    {
        return Math.floor(x / this.sizeR);
    }

    // draws the board in current state
    draw() 
    {
        for (let r = 0; r < this.nRows; r++ )
        {
            ctx.beginPath();
            ctx.moveTo(r * this.sizeR , 0);
            ctx.lineTo(r * this.sizeR , canvas.height);

            // Draw the Path
            ctx.stroke();
        }

        for (let c = 0; c < this.nCols; c++ )
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
            ctx.arc(cell.x, cell.y, this.circleRadius * 0.8, 0, 2 * Math.PI);
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
            if (event.clientX >= 0 &&
                event.clientX <= canvas.width &&
                event.clientY >= 0 &&
                event.clientY <= canvas.height) 
                {
                    this.draw();
                    ctx.beginPath();
                    // how many pieces are in the column
                    const numInCol = myGame.gameState.pieces[this.getColumn(event.clientX)];
                    // calculate the position of the circle based on the column and number of pieces
                    const offset = numInCol * this.sizeC;

                    const x = this.circleRadius +  Math.floor(event.clientX / this.sizeR) * (this.sizeR);
                    //const y = (this.circleRadius +  Math.floor(event.clientY / this.sizeC) * (this.sizeC));
                    const y = canvas.height - this.circleRadius - offset;

                    // console.log(Math.floor(event.clientY / this.sizeC));
                    // console.log(`Hovering over cell at (${event.screenX}, ${event.screenY})`);
                    ctx.arc(x,y, this.circleRadius * 0.6, 0, 2 * Math.PI);
                    ctx.fillStyle = 'yellow';
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "grey";
                    ctx.stroke();
                }
        });
    }

    click() 
    {
        canvas.addEventListener('click', (event) => {
            if (event.clientX >= 0 &&
                event.clientX <= canvas.width &&
                event.clientY >= 0 &&
                event.clientY <= canvas.height) 
                {
                    this.draw();
                    const numInCol = myGame.gameState.pieces[this.getColumn(event.clientX)];
                    // calculate the position of the circle based on the column and number of pieces
                    const offset = numInCol * this.sizeC;

                    // y position to place the piece
                    const y = canvas.height - this.circleRadius - offset;

                    if ( y > 0 ){
                        // getting the correct cell
                        const cell = this.cells.find(cell => 
                            event.clientX >= cell.x - this.circleRadius &&
                            event.clientX <= cell.x + this.circleRadius && 
                            y == cell.y);
                        

                        cell.color = 'yellow';
                        myGame.gameState.pieces[this.getColumn(event.clientX)]++;
                        this.draw();
                    }
                }
        });
    }
}

class Game 
{
    constructor()
    {
        this.columns = 5;
        this.rows = 5;
        console.log("Game initialized with columns:", this.columns, "and rows:", this.rows);
        this.grid = new Grid(this.rows, this.columns);
        this.gameState = new GameState(this.rows, this.columns);
    }

    run() 
    {
        console.log(this.gameState.board);
        this.grid.draw();
        this.grid.hover();
        this.grid.click();
    }
}

var myGame = new Game();
myGame.run();