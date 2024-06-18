import { Text, TextStyle, Container } from './pixi.mjs';

// Function to create and display the file allocation table
export function createFileAllocationTable(app, files, gridPlacement) {
    // Create a container for the table
    const tableContainer = new Container();

    // Define the style for the table text
    const style = new TextStyle({
        fontFamily: 'Courier New', // Monospaced font for proper alignment
        fontSize: 10,              // Smaller font size
        fill: 'white',             // Text color
    });

    // Create the header for the table
    const header = new Text("File Allocation Table:", style);
    header.x = 10;                // X position of the header
    header.y = 300;               // Y position of the header
    tableContainer.addChild(header); // Add the header to the container

    // Define column titles and their positions
    const titles = ["File-Name", "Start", "Length", "Allocated-Blocks"];
    const columnPositions = [10, 80, 130, 180]; // Adjust column positions to fit better

    // Create and position each column title
    titles.forEach((title, index) => {
        const titleText = new Text(title, style);
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
        const fileNameText = new Text(`File ${fileNum}`, style);
        fileNameText.x = columnPositions[0]; // X position for file name
        fileNameText.y = yPos;               // Y position for the current row

        const startText = new Text(fileInfo.start.toString(), style);
        startText.x = columnPositions[1];    // X position for start
        startText.y = yPos;                  // Y position for the current row

        const lengthText = new Text(fileInfo.length.toString(), style);
        lengthText.x = columnPositions[2];   // X position for length
        lengthText.y = yPos;                 // Y position for the current row

        const blocksTextElement = new Text(wrappedBlocksText, style);
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
