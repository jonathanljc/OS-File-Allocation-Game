import { Graphics } from './pixi.mjs';

export function addGrid(app, container, fileNum, blocks, gridPlacement) 
{   
    // Blocks added counter
    let blocksAdded = 0;

    // Create a 5x5 grid of squares in the container
    const graphics = new Graphics();
    for (let i = 0; i < 30; i++)
    {
        let x = (i % 5) * 100;
        let y = Math.floor(i / 5) * 100;
        // Rectangle + line style 2
        graphics.rect(x, y, 100, 100);
        graphics.stroke({ width: 10, color: 0xffffff });

        // If fileNum is not 0, add the file to the grid
        if(fileNum != 0){
            // If the grid is empty and we haven't added all the blocks yet, add the file
            if (gridPlacement[i] == 0 && blocksAdded < blocks) {
                gridPlacement[i] = fileNum;
                blocksAdded++;
            }
        }

        // Colour the grid based on the file colour
        if (gridPlacement[i] == 0) {
            graphics.fill(0xc34288); // Black
        }else if(gridPlacement[i] == 1){
            graphics.fill(0xA52A2A); // Brown
        }else if(gridPlacement[i] == 2){
            graphics.fill(0x7FFF00); // Chartreuse
        }else if(gridPlacement[i] == 3){
            graphics.fill(0x0000FF); // Blue
        }else{
            graphics.fill(0xFFFF00); // Yellow
        }
    }

    container.addChild(graphics);
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
}

// Colourise the grid based on the files
// Removes the grid and re-adds it with the new file placements
export function colorInGrid(app, fileNum, blocks, gridPlacement, gridContainer)
{
    try {
        let canFill = checkIfCanFill(gridPlacement, blocks);
        if (!canFill) throw new Error('Grid is full');
        addGrid(app, gridContainer, fileNum, blocks, gridPlacement);
        app.stage.removeChild(gridContainer);
        app.stage.addChildAt(gridContainer, 0);
    }
    catch (e) {
        throw e;
    }
}

function checkIfCanFill(gridPlacement, blocks) 
{
    if (blocks == 0) return true;

    let emptySpaces = 0;
    for (let i = 0; i < gridPlacement.length; i++) {
        if (gridPlacement[i] == 0) {
            emptySpaces++;
        }
        else {
            emptySpaces = 0;
        }
    }

    if (emptySpaces < blocks)
        return false;
    else 
        return true;
}