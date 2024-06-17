import { addFileSprites } from './addFileSprites.js';
import { addGrid } from './addGrid.js';
import { addText } from './addText.js';
import { testForAABB } from './checkFile.js';
import { Application, Container } from './pixi.mjs';

// Create a new application
const app = new Application();

// Initialize the application
await app.init({ background: '#1099ff', antialias: true, resizeTo: window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Declare file attributes
let files = {
    1: "2",
    2: "5",
    3: "15",
    4: "20",
}

// Create grid container
const container = new Container();
app.stage.addChild(container);
addGrid(app, container);

addText(app);

// Set-up mouse interactivity
let dragTarget = null;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

// Add file sprites with mouse interactivity
addFileSprites(app, files);

function onDragEnd()
{
    if (dragTarget)
    {
        app.stage.off('pointermove', onDragMove);
        if (testForAABB(dragTarget, container))
        {
            app.stage.removeChild(dragTarget);
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