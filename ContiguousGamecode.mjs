import { addFileSprites } from './addFileSprites.js';
import { addGrid, colorInGrid, removeColoredSquares } from './addGraphics.js';
import { addStartingText, addGridFullText, addFileInfoText, createFileAllocationTable } from './addText.js';
import { Application, Container } from './pixi.mjs';

// Create a new application
const app = new Application();
globalThis.__PIXI_STAGE__ = app.stage;
globalThis.__PIXI_RENDERER__ = app.renderer;

// Initialize the application
await app.init({ background: '#96c9ff', antialias: true, width: 1200, height: 800});

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Dictionary of files' size attribute, in blocks of memory.
let files = {
    '1': "0",
    '2': "0",
    '3': "0",
    '4': "0",
}

// Iterate over the keys of the files dictionary and assign a new random value
Object.keys(files).forEach(key => {
    // Randomise value to be between 1 and 20
    let min = 5;
    let max = 15;
    files[key] = (Math.floor(Math.random() * (max - min)) + min).toString();
});

// Grid array to keep track of which blocks are used (0 means empty, 1-4 is a file)
let gridPlacement = new Array(30);
gridPlacement.fill(0);

// Create grid container
const gridContainer = new Container();
app.stage.addChild(gridContainer);
addGrid(app, gridContainer, 0, 0, gridPlacement);

// Create instructional text
addStartingText(app);

// Create allocation table text
createFileAllocationTable(app, gridPlacement);

// Set-up mouse interactivity
let targetFile = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// Add file sprites with mouse interactivity
const fileSpriteContainer = new Container();
app.stage.addChild(fileSpriteContainer);
// let originalSpritePos = {};
addFileSprites(fileSpriteContainer, files);

export function onHover() 
{
    const fileBlocks = files[this.label];
    const fileInfoText = addFileInfoText(app, this, fileBlocks)

    const fileInfoContainer = new Container();
    fileInfoContainer.label = 'fileInfo';

    for (let fileInfo of fileInfoText) 
    {
        fileInfoContainer.addChild(fileInfo);
    }

    app.stage.addChild(fileInfoContainer);
}

export function onStopHovering()
{
    app.stage.removeChild(app.stage.getChildByLabel('fileInfo'));
}

export function onClick()
{
    if (this.alpha == 1) 
    {
        targetFile = this;
        targetFile.alpha = 0.25;
        try {
            colorInGrid(app, targetFile.label, files[targetFile.label], gridPlacement, gridContainer); // color-in grids based on num of blocks of memory that the selected file needs
            createFileAllocationTable(app, gridPlacement); // Update the file allocation table
            // fileSpriteContainer.removeChild(targetFile);
            // app.stage.removeChild(app.stage.getChildByLabel('fileInfo'));
            targetFile = null;
        }
        catch (e) {
            // Catch error thrown when not enough empty blocks in storage to hold file
            // targetFile.position = originalSpritePos[targetFile.label.valueOf()-1] // return sprite to original position
            targetFile.alpha = 1;
            targetFile = null;
            addGridFullText(app);
        }
    }
    else 
    {
        targetFile = this;
        targetFile.alpha = 1;
        removeColoredSquares(app, targetFile.label, files[targetFile.label], gridPlacement, gridContainer);
        createFileAllocationTable(app, gridPlacement);
    }
}