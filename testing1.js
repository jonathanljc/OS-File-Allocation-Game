import { Application, Assets, Sprite, SCALE_MODES, Text, TextStyle, Color, FillGradient, Container, Graphics } from './pixi.mjs';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application with specific properties
    await app.init({ background: '#1099ff', antialias: true, resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create a container for the grid
    const container = new Container();
    app.stage.addChild(container);
    
    // Create a 5x8 grid of smaller squares in the container (total 40 blocks)
    const gridGraphics = new Graphics();
    const squareSize = 70; // Set the size of each square in the grid
    for (let i = 0; i < 40; i++)
    {
        let x = (i % 5) * squareSize;
        let y = Math.floor(i / 5) * squareSize;
        // Define the rectangle and its style
        gridGraphics.lineStyle(2, 0xffffff, 1);
        gridGraphics.beginFill(0xc34288);
        gridGraphics.drawRect(x, y, squareSize, squareSize);
        gridGraphics.endFill();
    }

    // Add the grid to the container and position it
    container.addChild(gridGraphics);
    container.x = 450; // Set the x-position of the container
    container.y = 150; // Set the y-position of the container

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // Set the texture's scale mode to nearest to preserve pixelation
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

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
        fontSize: 36,
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

    // Create rich text
    const richText = new Text({
        text: 'Drag and drop bunnies',
        style,
    });
    richText.x = 450; // Set the x-position of the text
    richText.y = 50; // Set the y-position of the text
    app.stage.addChild(richText);

    // Create contiguous allocation box
    const allocationBox = new Graphics();
    allocationBox.beginFill(0xff0000);
    allocationBox.drawRect(0, 0, 200, 100);
    allocationBox.endFill();
    allocationBox.x = 100; // Set the x-position of the allocation box
    allocationBox.y = 250; // Set the y-position of the allocation box
    app.stage.addChild(allocationBox);

    // Create text for the allocation box
    const allocationText = new Text('Contiguous Allocation', {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'white'
    });
    allocationText.x = allocationBox.x + 10; // Set the x-position of the text
    allocationText.y = allocationBox.y + 30; // Set the y-position of the text
    app.stage.addChild(allocationText);

    // Create a container for the table
    const tableContainer = new Container();
    app.stage.addChild(tableContainer);

    // Function to create table rows
    function createTableRow(fileName, start, length, allocatedBlocks) {
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 'white'
        });

        const fileNameText = new Text(fileName, textStyle);
        const startText = new Text(start.toString(), textStyle);
        const lengthText = new Text(length.toString(), textStyle);
        const allocatedBlocksText = new Text(allocatedBlocks.join(', '), textStyle);

        // Add text objects to the table container
        tableContainer.addChild(fileNameText);
        tableContainer.addChild(startText);
        tableContainer.addChild(lengthText);
        tableContainer.addChild(allocatedBlocksText);

        const rowHeight = 30;
        const rowIndex = tableContainer.children.length / 4 - 1;

        // Set positions of the text objects
        fileNameText.x = 880;
        fileNameText.y = 150 + rowIndex * rowHeight;

        startText.x = fileNameText.x + 150;
        startText.y = fileNameText.y;

        lengthText.x = startText.x + 100;
        lengthText.y = fileNameText.y;

        allocatedBlocksText.x = lengthText.x + 100;
        allocatedBlocksText.y = fileNameText.y;
    }

    // Create table headers
    createTableRow('File Name', 'Start', 'Length', ['Allocated Blocks']);

    // Array to store allocation lengths for each bunny
    const allocationLengths = [2, 4, 6, 8];

    // Create bunnies and place them on the stage
    let x = 150;
    let y = 400;
    for (let i = 0; i < 4; i++)
    {
        if (i === 2) { // Move to the next row after two bunnies
            x = 150;
            y += 150;
        }
        createBunny(x, y, `Bunny ${i + 1}`, allocationLengths[i]);
        x += 150; // Adjust the horizontal position for each bunny
    }

    // Function to create a bunny
    function createBunny(x, y, name, length)
    {
        // Create a bunny sprite
        const bunny = new Sprite(texture);

        // Enable the bunny to be interactive
        bunny.interactive = true;
        bunny.buttonMode = true;

        // Center the bunny's anchor point
        bunny.anchor.set(0.5);

        // Make the bunny larger
        bunny.scale.set(1.5);

        // Setup events for mouse and touch interactions
        bunny.on('pointerdown', onDragStart);
        bunny.on('pointerup', onDragEnd);
        bunny.on('pointerupoutside', onDragEnd);
        bunny.on('pointermove', onDragMove);

        // Set the bunny's position
        bunny.x = x;
        bunny.y = y;

        // Add the bunny to the stage
        app.stage.addChild(bunny);

        // Add label for the bunny
        const labelStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 'white'
        });
        const bunnyLabel = new Text(name, labelStyle);
        bunnyLabel.x = x - 40; // Set the x-position of the label
        bunnyLabel.y = y + 30; // Set the y-position of the label
        app.stage.addChild(bunnyLabel);

        // Store name and length for table
        bunny.name = name;
        bunny.length = length;
    }

    let dragTarget = null;
    let nextStart = 0;

    // Function to handle drag start
    function onDragStart(event)
    {
        // Store a reference to the data
        this.data = event.data;
        this.alpha = 0.5; // Make the bunny semi-transparent
        this.dragging = true;
        dragTarget = this;
    }

    // Function to handle drag end
    function onDragEnd()
    {
        this.alpha = 1; // Restore the bunny's transparency
        this.dragging = false;
        this.data = null;
        if (dragTarget && hitTestRectangle(dragTarget, allocationBox)) {
            dragTarget.parent.removeChild(dragTarget);
            highlightGrid(dragTarget.name, dragTarget.length);
        }
        dragTarget = null;
    }

    // Function to handle drag move
    function onDragMove()
    {
        if (this.dragging)
        {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x; // Update the bunny's position
            this.y = newPosition.y; // Update the bunny's position
        }
    }

    // Function to check if two rectangles intersect
    function hitTestRectangle(r1, r2)
    {
        const r1Bounds = r1.getBounds();
        const r2Bounds = r2.getBounds();
        return r1Bounds.x + r1Bounds.width > r2Bounds.x &&
            r1Bounds.x < r2Bounds.x + r2Bounds.width &&
            r1Bounds.y + r1Bounds.height > r2Bounds.y &&
            r1Bounds.y < r2Bounds.y + r2Bounds.height;
    }

    // Function to highlight the grid
    function highlightGrid(name, length)
    {
        const shadingGraphics = new Graphics();
        const start = nextStart;
        const allocatedBlocks = [];

        for (let i = start; i < start + length; i++) {
            let x = (i % 5) * squareSize;
            let y = Math.floor(i / 5) * squareSize;
            shadingGraphics.lineStyle(2, 0xffffff, 1);
            shadingGraphics.beginFill(0xffff00, 0.5); // Highlight color
            shadingGraphics.drawRect(x, y, squareSize, squareSize);
            shadingGraphics.endFill();
            allocatedBlocks.push(i);
        }

        container.addChild(shadingGraphics);
        createTableRow(name, start, length, allocatedBlocks);

        nextStart = start + length; // Update the next start position
    }
})();
