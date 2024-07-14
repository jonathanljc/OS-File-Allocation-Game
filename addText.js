import { Text, TextStyle, Color, FillGradient, Container } from './pixi.mjs';

// Create gradient fill
const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
const colors = [0xffffff, 0x00ff11].map((color) => Color.shared.setValue(color).toNumber());
colors.forEach((number, index) =>
{
    const ratio = index / colors.length;
    fill.addColorStop(ratio, number);
});

// Initialize rich text style
const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: { fill },
    stroke: { color: '#4a1850', width: 5, join: 'round' },
    dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 6,
    },
});

export function addStartingText(app)
{
    // Create file allocation method text
    const allocateMethod = new Text({
        text: 'Contiguous File Allocation: click on a file to see how it is allocated',
        style,
    });
    allocateMethod.x = 25;
    allocateMethod.y = 25;
    app.stage.addChild(allocateMethod);

    // Create file storage label
    const storageLabel = new Text({
        text: 'File Storage',
        style,
    });
    storageLabel.anchor.set(0.5);
    storageLabel.x = app.screen.width / 2;
    storageLabel.y = 725;
    app.stage.addChild(storageLabel);
}

export function addGridFullText(app) {
    let gridFullText = new Text ({
        text: "Storage is full!",
        style,
    });
    gridFullText.anchor.set(0.5);
    gridFullText.x = app.screen.width / 2;
    gridFullText.y = app.screen.height / 2;
    app.stage.addChild(gridFullText);
    setTimeout(() => {
        app.stage.removeChild(gridFullText);
    }, 1000);
}

export function addFileInfoText(app, fileSprite, fileBlocks)
{
    // Create file info texts
    const fileNum = new Text({
        text: 'File number: ' + fileSprite.label,
        style,
    });
    fileNum.x = 25;
    fileNum.y = 150;

    const fileBlocksText = new Text({
        text: 'Memory blocks: ' + fileBlocks,
        style,
    });
    fileBlocksText.x = 25;
    fileBlocksText.y = 200;

    return [fileNum, fileBlocksText];
}

// Function to create and display the file allocation table
export function createFileAllocationTable(app, gridPlacement) {
    // Create a container for the table
    const tableContainer = new Container();

    // Define the style for the table text
    const style = new TextStyle({
        fontFamily: 'Courier New', // Monospaced font for proper alignment
        fontSize: 13,              // Smaller font size
        fill: 'white',             // Text color
    });

    // Create the header for the table
    const header = new Text({
        text: "File Allocation Table:", 
        style
    });
    header.x = 10;                // X position of the header
    header.y = 300;               // Y position of the header
    tableContainer.addChild(header); // Add the header to the container

    // Define column titles and their positions
    const titles = ["File-Num", "Start", "Length", "Allocated-Blocks"];
    const columnPositions = [10, 80, 125, 180]; // Adjust column positions to fit better

    // Create and position each column title
    titles.forEach((title, index) => {
        const titleText = new Text({
            text: title, 
            style
        });
        titleText.x = columnPositions[index]; // X position based on columnPositions
        titleText.y = 340;                    // Y position of the titles
        tableContainer.addChild(titleText);   // Add the title to the container
    });

    // Object to store file allocation details
    const fileAllocation = {};

    // Populate fileAllocation object with file details
    gridPlacement.forEach((fileNum, index) => {
        if (fileNum !== 0) {
            if (!fileAllocation[fileNum]) {
                fileAllocation[fileNum] = { start: index, length: 0, blocks: [] };
            }
            fileAllocation[fileNum].length++; // Increment the length for the file
            fileAllocation[fileNum].blocks.push(index); // Add the block index to the file's blocks
        }
    });

    // Starting Y position for the table rows
    let yPos = 360;

    // Iterate over each file in the fileAllocation object
    Object.keys(fileAllocation).forEach(fileNum => {
        const fileInfo = fileAllocation[fileNum];
        let blocksText = fileInfo.blocks.join(", "); // Join block indices into a string

        // Wrap long blocks text after every 5 elements
        const elementsPerLine = 5;
        let wrappedBlocksText = '';
        let elements = blocksText.split(", ");
        for (let i = 0; i < elements.length; i++) {
            if (i > 0 && i % elementsPerLine === 0) {
                wrappedBlocksText += '\n'; // Add a newline after every 5 elements
            }
            wrappedBlocksText += elements[i] + (i < elements.length - 1 ? ", " : "");
        }

        // Create text for each column
        const fileNameText = new Text({
            text: `${fileNum}`,
            style
        });
        fileNameText.x = columnPositions[0]; // X position for file name
        fileNameText.y = yPos;               // Y position for the current row

        const startText = new Text({
            text: fileInfo.start.toString(), 
            style
        });
        startText.x = columnPositions[1];    // X position for start
        startText.y = yPos;                  // Y position for the current row

        const lengthText = new Text({
            text: fileInfo.length.toString(), 
            style
        });
        lengthText.x = columnPositions[2];   // X position for length
        lengthText.y = yPos;                 // Y position for the current row

        const blocksTextElement = new Text({
            text: wrappedBlocksText, 
            style
        });
        blocksTextElement.x = columnPositions[3]; // X position for allocated blocks
        blocksTextElement.y = yPos;               // Y position for the current row

        // Add each column text to the table container
        tableContainer.addChild(fileNameText);
        tableContainer.addChild(startText);
        tableContainer.addChild(lengthText);
        tableContainer.addChild(blocksTextElement);

        // Increase Y position for the next row, considering wrapped text height
        yPos += 20 + (wrappedBlocksText.split('\n').length - 1) * 20;
    });

    // Add the table container to the app stage
    app.stage.addChild(tableContainer);
}

export function addTitleText(app)
{
    const title = new Text({ 
        text: 'File Allocation Game!', 
        style, 
    });

    title.anchor.set(0.5);
    title.x = app.screen.width / 2;
    title.y = 200;

    app.stage.addChild(title);

    const subtitle = new Text({ 
        text: 'Learn how OSes allocate storage space to files, using the contiguous and extent-based methods.', 
        style, 
    });

    subtitle.anchor.set(0.5);
    subtitle.x = app.screen.width / 2;
    subtitle.y = 300;

    app.stage.addChild(subtitle);
}

export function addMenuBtnText(app, x, y, btnLength, btnHeight)
{
    const contiText = new Text({ text: 'Contiguous' });
    
    contiText.anchor.set(0.5);
    contiText.x = x + (btnLength / 2);
    contiText.y = y + (btnHeight / 2);

    app.stage.addChild(contiText);

    const extText = new Text({ text: 'Extent-based' });

    extText.anchor.set(0.5);
    extText.x = x + (btnLength / 2);
    extText.y = y + (btnHeight / 2) + 100;

    app.stage.addChild(extText);
}