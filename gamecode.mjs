import { addFileSprites } from './addFileSprites.js';
import { addGrid, colorInGrid } from './addGraphics.js';
import { addStartingText, addGridFullText, addFileInfoText, createFileAllocationTable } from './addText.js';
import { testForAABB } from './checkFileInsideStorage.js';
import { Application, Container } from './pixi.mjs';

// Create a new application
const app = new Application();
globalThis.__PIXI_STAGE__ = app.stage;
globalThis.__PIXI_RENDERER__ = app.renderer;

// Initialize the application
await app.init({ background: '#1099ff', antialias: true, width: 1200, height: 800});

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
    let min = 10;
    let max = 20;
    files[key] = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
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

// Set-up mouse interactivity
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

// Add file sprites with mouse interactivity
const fileSpriteContainer = new Container();
app.stage.addChild(fileSpriteContainer);
let originalSpritePos = {};
addFileSprites(fileSpriteContainer, files, originalSpritePos);


function onDragEnd()
{
    if (dragTarget)
    {
        app.stage.off('pointermove', onDragMove);
        // check if file is within bounds of storage grid graphic
        if (testForAABB(dragTarget, gridContainer))
        {
            try {
                colorInGrid(app, dragTarget.label, files[dragTarget.label], gridPlacement, gridContainer, files); // color-in grids based on num of blocks of memory that the selected file needs
                createFileAllocationTable(app, gridPlacement); // Update the file allocation table
                fileSpriteContainer.removeChild(dragTarget);
                app.stage.removeChild(app.stage.getChildByLabel('fileInfo'));
                dragTarget = null;
            }
            catch (e) {
                // Catch error thrown when not enough empty blocks in storage to hold file
                dragTarget.position = originalSpritePos[dragTarget.label.valueOf()-1] // return sprite to original position
                dragTarget.alpha = 1;
                dragTarget = null;
                addGridFullText(app);
            }
        }
        else
        {
            dragTarget.alpha = 1;
            dragTarget = null;
        }
    }
}

function onDragMove(event)
{
    if (dragTarget)
    {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
}

export function onDragStart()
{
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    this.alpha = 0.5;
    dragTarget = this;
    app.stage.on('pointermove', onDragMove);
}

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