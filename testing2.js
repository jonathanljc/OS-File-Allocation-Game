import { Application, Assets, Sprite, Text, TextStyle, Graphics, Container, SCALE_MODES } from './pixi.mjs';

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the bunny texture as a placeholder for files
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    // Create rich text style
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 280   // Adjust the wrap width to fit within the rectangle
    });

    // Create instructions text
    const instructions = new Text('Drag and drop the files into the correct allocation method zone', style);
    instructions.x = 50;
    instructions.y = 20;
    app.stage.addChild(instructions);

    // Create drop zones
    const dropZones = [
        { label: 'Contiguous Allocation', color: 0xff0000, x: 50, y: 100 },
        { label: 'Extent-based Contiguous Allocation', color: 0x00ff00, x: 50, y: 300 }
    ];

    // Loop through each drop zone and create graphics and text for them
    dropZones.forEach(zone => {
        const graphics = new Graphics();
        graphics.beginFill(zone.color);
        graphics.drawRect(0, 0, 300, 150); // Draw a rectangle for the drop zone
        graphics.endFill();
        graphics.x = zone.x;
        graphics.y = zone.y;
        app.stage.addChild(graphics); // Add the graphics to the stage

        const zoneText = new Text(zone.label, style); // Create text for the drop zone label
        zoneText.anchor.set(0.5); // Set anchor point to center
        zoneText.x = zone.x + 150; // Center horizontally
        zoneText.y = zone.y + 75; // Center vertically
        app.stage.addChild(zoneText); // Add the text to the stage
    });

    // Create larger and centralized cylinder shape
    const baseWidth = app.screen.width * 0.5; // Reduce the width to 50% of the screen
    const baseHeight = app.screen.height * 0.7; // Increase the height to 70% of the screen
    const baseX = (app.screen.width - baseWidth) / 2;
    const baseY = (app.screen.height - baseHeight) / 2;

    const cylinder = new Graphics();
    // Draw base rectangle
    cylinder.beginFill(0xff0000);
    cylinder.drawRect(0, baseHeight / 4, baseWidth, baseHeight / 2); // Draw a rectangle for the base
    // Draw top ellipse
    cylinder.drawEllipse(baseWidth / 2, baseHeight / 4, baseWidth / 2, baseHeight / 4); // Draw an ellipse at the top
    // Draw bottom ellipse
    cylinder.drawEllipse(baseWidth / 2, baseHeight * 3 / 4, baseWidth / 2, baseHeight / 4); // Draw an ellipse at the bottom
    cylinder.endFill();
    
    // Set position of cylinder
    cylinder.x = baseX;
    cylinder.y = baseY;

    // Add the cylinder to the stage
    app.stage.addChild(cylinder);

    // Create grid container within the cylinder
    const gridContainer = new Container();
    cylinder.addChild(gridContainer); // Add grid container to the cylinder

    // Create a 5x5 grid of squares in the grid container
    const gridSizeX = 5;
    const gridSizeY = 5;
    const blockWidth = baseWidth / gridSizeX;
    const blockHeight = baseHeight / (2 * gridSizeY);
    const blocks = [];

    // Loop to create grid blocks
    for (let i = 0; i < gridSizeX * gridSizeY; i++) {
        let x = (i % gridSizeX) * blockWidth;
        let y = Math.floor(i / gridSizeX) * blockHeight;
        const block = new Graphics();
        block.beginFill(0xc34288); // Set block color
        block.drawRect(0, 0, blockWidth - 2, blockHeight - 2); // Draw rectangle for each block
        block.endFill();
        block.lineStyle(2, 0xffffff); // Set line style for block outline
        block.drawRect(0, 0, blockWidth - 2, blockHeight - 2); // Draw outline rectangle for each block
        block.x = x;
        block.y = y;
        block.allocated = false; // Initialize allocated status
        gridContainer.addChild(block); // Add block to the grid container
        blocks.push(block); // Push block to blocks array
    }

    // Center the grid container within the cylinder
    gridContainer.x = (baseWidth - gridContainer.width) / 2;
    gridContainer.y = baseHeight / 4;

    // Create draggable bunnies (files)
    for (let i = 0; i < 4; i++) {
        createBunny(150 + i * 100, 700, (i + 1) * 3); // Create bunnies with varying lengths
    }

    // Function to create draggable bunnies
    function createBunny(x, y, length) {
        // Create the bunny sprite
        const bunny = new Sprite(texture);

        // Enable interactivity for the bunny
        bunny.interactive = true;
        bunny.buttonMode = true;

        // Set anchor point to center
        bunny.anchor.set(0.5);

        // Scale up the bunny sprite
        bunny.scale.set(3);

        // Set position for the bunny sprite
        bunny.x = x;
        bunny.y = y;

        // Store the length of the file in a custom property
        bunny.length = length;

        // Setup events for mouse and touch interactions
        bunny.on('pointerdown', onDragStart)
             .on('pointerup', onDragEnd)
             .on('pointerupoutside', onDragEnd)
             .on('pointermove', onDragMove);

        // Add the bunny to the stage
        app.stage.addChild(bunny);

        console.log('Bunny created at position:', x, y);
    }

    let dragTarget = null;

    // Function to handle the start of dragging
    function onDragStart(event) {
        this.data = event.data; // Store event data for the bunny
        this.alpha = 0.5; // Reduce transparency of the bunny sprite
        this.dragging = true; // Set dragging flag to true
        dragTarget = this; // Set dragTarget to this bunny
    }

    // Function to handle the end of dragging
    function onDragEnd() {
        this.alpha = 1; // Restore transparency of the bunny sprite
        this.dragging = false; // Set dragging flag to false
        this.data = null; // Clear stored event data

        // Check if the bunny was dropped in any drop zone
        const dropPosition = dragTarget.getGlobalPosition(); // Get global position of the bunny
        let droppedInZone = false; // Flag to track if dropped in any zone

        // Loop through drop zones to check collision
        dropZones.forEach(zone => {
            const zoneBounds = {
                x: zone.x,
                y: zone.y,
                width: 300,
                height: 150
            };

            // Check if bunny's drop position is within zone bounds
            if (dropPosition.x > zoneBounds.x && dropPosition.x < zoneBounds.x + zoneBounds.width &&
                dropPosition.y > zoneBounds.y && dropPosition.y < zoneBounds.y + zoneBounds.height) {
                console.log(`Dropped in ${zone.label}`); // Log which zone bunny was dropped in
                droppedInZone = true; // Set droppedInZone flag to true

                // Allocate blocks based on zone label
                if (zone.label === 'Contiguous Allocation') {
                    contiguousAllocation(dragTarget.length); // Allocate using contiguous allocation
                    app.stage.removeChild(dragTarget);  // Remove the bunny from the stage
                } else if (zone.label === 'Extent-based Contiguous Allocation') {
                    extentBasedAllocation(dragTarget.length); // Allocate using extent-based contiguous allocation
                    app.stage.removeChild(dragTarget);  // Remove the bunny from the stage
                }
            }
        });

        // Handle if bunny was dropped outside any zone
        if (!droppedInZone) {
            console.log('Dropped outside any zone');
        }

        dragTarget = null; // Reset dragTarget to null
    }

    // Function to handle dragging movement
    function onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent); // Get new position relative to parent
            this.x = newPosition.x; // Update x position of the bunny
            this.y = newPosition.y; // Update y position of the bunny
        }
    }

    // Function to allocate blocks using contiguous allocation strategy
    function contiguousAllocation(length) {
        console.log(`Allocating file of length ${length} using Contiguous Allocation`);

        // Find contiguous space on the grid
        for (let i = 0; i <= blocks.length - length; i++) {
            let canAllocate = true;

            // Check if consecutive blocks are unallocated
            for (let j = 0; j < length; j++) {
                if (blocks[i + j].allocated) {
                    canAllocate = false; // Set canAllocate to false if any block is allocated
                    break;
                }
            }

            // Allocate blocks if contiguous space found
            if (canAllocate) {
                for (let j = 0; j < length; j++) {
                    blocks[i + j].beginFill(0xffcc00); // Set fill color for allocated blocks
                    blocks[i + j].drawRect(0, 0, blockWidth - 2, blockHeight - 2); // Redraw block with fill color
                    blocks[i + j].endFill();
                    blocks[i + j].allocated = true; // Set allocated flag to true for each block
                }
                return; // Exit function after allocation
            }
        }

        console.log('No contiguous space available for allocation.'); // Log if no contiguous space found
    }

    // Function to allocate blocks using extent-based contiguous allocation strategy
    function extentBasedAllocation(length) {
        console.log(`Allocating file of length ${length} using Extent-based Contiguous Allocation`);

        const extentSize = 3; // Example extent size
        let remainingLength = length;
        let startIndex = 0;

        // Allocate blocks in extents until full length allocated
        while (remainingLength > 0) {
            const extentLength = Math.min(extentSize, remainingLength); // Determine extent length
            let canAllocate = false;

            // Check if extent space is available
            for (let i = startIndex; i <= blocks.length - extentLength; i++) {
                canAllocate = true;

                // Check if consecutive blocks in extent are unallocated
                for (let j = 0; j < extentLength; j++) {
                    if (blocks[i + j].allocated) {
                        canAllocate = false; // Set canAllocate to false if any block is allocated
                        break;
                    }
                }

                // Allocate blocks if extent space found
                if (canAllocate) {
                    for (let j = 0; j < extentLength; j++) {
                        blocks[i + j].beginFill(0x0099ff); // Set fill color for allocated blocks
                        blocks[i + j].drawRect(0, 0, blockWidth - 2, blockHeight - 2); // Redraw block with fill color
                        blocks[i + j].endFill();
                        blocks[i + j].allocated = true; // Set allocated flag to true for each block
                    }
                    remainingLength -= extentLength; // Reduce remaining length after allocation
                    startIndex = i + extentLength; // Update start index for next extent allocation
                    break;
                }
            }

            // Handle if no extent space available
            if (!canAllocate) {
                console.log('No space available for extent allocation.');
                break;
            }
        }
    }

})();
