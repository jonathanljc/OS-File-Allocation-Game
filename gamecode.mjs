import { addFileSprites } from './addFileSprites.js';
import { addGrid } from './addGrid.js';
import { addText } from './addText.js';
import { testForAABB } from './checkFile.js';
import { addFileInfoText } from './addFileInfoText.js';
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

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Iterate over the keys of the files dictionary and assign a new random value
Object.keys(files).forEach(key => {
    // Assuming you want the random value to be between 1 and 20
    files[key] = getRandomInt(1, 20).toString();
});

// Create grid container
const gridContainer = new Container();
app.stage.addChild(gridContainer);
addGrid(app, gridContainer);

// Create instructional text
addText(app);

// Set-up mouse interactivity
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

// Add file sprites with mouse interactivity
const fileSpriteContainer = new Container();
app.stage.addChild(fileSpriteContainer);
addFileSprites(fileSpriteContainer, files);

function onDragEnd()
{
    if (dragTarget)
    {
        app.stage.off('pointermove', onDragMove);
        // check if file is within bounds of grid
        if (testForAABB(dragTarget, gridContainer))
        {
            fileSpriteContainer.removeChild(dragTarget);
            app.stage.removeChild(app.stage.getChildByLabel('fileInfo'));
            dragTarget = null;
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