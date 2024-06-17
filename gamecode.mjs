import { addFileSprites } from './addFileSprites.js';
import { addGrid } from './addGrid.js';
import { addText } from './addText.js';
import { Application } from './pixi.mjs';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099ff', antialias: true, resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    let files = {
        1: "2",
        2: "5",
        3: "15",
        4: "20",
    }

    addGrid(app);

    addText(app);
    
    addFileSprites(app, files);
})();
