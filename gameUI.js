const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Grid 
{
    constructor(nRows, nCols) 
    {
        this.nRows = nRows;
        this.nCols = nCols;
        this.cells = [];
        this.sizeR = canvas.width / this.nRows;
        this.sizeC = canvas.height / this.nCols;
        this.circleRadius = (canvas.width / (2 * this.nRows));

        for (var i = 0; i < this.nRows; i++)
        {
            for (var j = 0; j < this.nCols; j++)
            {
                this.cells.push(
                    { x: (this.sizeR/2) + i * this.sizeR,
                      y: (this.sizeC/2) + j * this.sizeC,
                      color: 'white'
                     });
            }
        }
    }

    draw() 
    {
        for (let r = 0; r < this.nRows; r++ )
        {
            ctx.beginPath();
            ctx.moveTo(2 * r * this.circleRadius , 0);
            ctx.lineTo(2 * r * this.circleRadius , canvas.height);

            // Draw the Path
            ctx.stroke();
        }

        for (let c = 0; c < this.nCols; c++ )
        {
            ctx.beginPath();
            ctx.moveTo(0, 2 * c * this.circleRadius);
            ctx.lineTo(canvas.width, 2 * c * this.circleRadius );

            // Draw the Path
            ctx.stroke();
        }

        for (const cell of this.cells)
        {
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, this.circleRadius * 0.8, 0, 2 * Math.PI);
            ctx.fillStyle = cell.color;
            ctx.fill();
            ctx.stroke();
        }
    }
}

class Game 
{

    constructor(){};
    grid = new Grid(10, 10);

    run() 
    {
        this.grid.draw();
    }
}

var myGame = new Game();
myGame.run();