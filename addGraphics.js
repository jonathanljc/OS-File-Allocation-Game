import { Graphics } from './pixi.mjs';
import { createFileAllocationTable } from './addText.js';
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
            graphics.fill(0xc34288); // Magenta (default)
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

export function removeFile(app, container, fileNum, blocks, gridPlacement) 
{   
    // Create a 5x5 grid of squares in the container
    const graphics = new Graphics();
    for (let i = 0; i < 30; i++)
    {
        let x = (i % 5) * 100;
        let y = Math.floor(i / 5) * 100;
        // Rectangle + line style 2
        graphics.rect(x, y, 100, 100);
        graphics.stroke({ width: 10, color: 0xffffff });

        // If fileNum is not 0, and still have file blocks allocated, remove file from the grid
        if(fileNum != 0 && blocks != 0){
            // if grid is not default, and grid is same colour as filenum, set grid back to default, then decrement blocks left to deallocate
            if (gridPlacement[i] != 0 && gridPlacement[i] == fileNum) {
                gridPlacement[i] = 0;
                blocks--;
            }

    // Add the call to update the file allocation table
    createFileAllocationTable(app, gridPlacement);
            
        }

        // Colour the grid based on the colour code
        if (gridPlacement[i] == 0) {
            graphics.fill(0xc34288); // Magenta (default)
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

export function removeColoredSquares(app, fileNum, blocks, gridPlacement, gridContainer)
{
    removeFile(app, gridContainer, fileNum, blocks, gridPlacement);
    app.stage.removeChild(gridContainer);
    app.stage.addChildAt(gridContainer, 0);

    // Add the call to update the file allocation table
    createFileAllocationTable(app, gridPlacement);
}

function checkIfCanFill(gridPlacement, blocks) 
{
    if (blocks == 0) return true;

    let emptySpaces = 0;
    for (let i = 0; i < gridPlacement.length; i++) {
        if (gridPlacement[i] == 0) {
            emptySpaces++;
            if (emptySpaces >= blocks)
                return true;
        }
        else {
            emptySpaces = 0;
        }
    }

    return false;
}

export function addMenuBtn(app, x, y, btnLength, btnHeight)
{
    const contiBtn = new Graphics();
    
    contiBtn.rect(x,y,btnLength,btnHeight);
    contiBtn.fill(0x69ed5c);

    app.stage.addChild(contiBtn);

    contiBtn.eventMode = 'static';
    contiBtn.on('pointerdown', goContiguous, contiBtn);

    const extBtn = new Graphics();
    y = y + 100;
    extBtn.rect(x,y,btnLength,btnHeight);
    extBtn.fill(0xd8eb4d);

    app.stage.addChild(extBtn);

    extBtn.eventMode = 'static';
    extBtn.on('pointerdown', goExtentBased, extBtn);
}