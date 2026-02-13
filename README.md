# MT Step by Step Handwriting Recognition

mt-step-by-step-handwriting is a web application for step-by-step handwritten math input, powered by the MathType hand.js library (WIRIS). Users can write mathematical expressions in multiple handwriting canvases, preview recognized math, and render all results at once.

## Features
- Multiple handwriting canvases for math input
- Math recognition and preview for each canvas
- Render all preview images with a single button
- Merge all recognized MathML equations into a single aligned MathML expression

## Getting Started

### Prerequisites
- Internet connection (loads Wiris hand.js from CDN)
- Modern web browser
- Node.js (for development mode)

### Installation & Running
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd mt-step-by-step-handwriting
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server URL (usually http://localhost:5173).

## Usage
- The main page displays a handwriting canvas. Write your math expression in the canvas.
- To add more canvases, press **CTRL + ENTER** (only if the latest canvas has received changes). Each new canvas allows you to write a new equation.
- To render all preview images, click the **Render Results** button. All preview images from each canvas will be displayed below.
- The application can also merge all recognized MathML equations into a single aligned MathML block for further processing or display.

## Customizing Keyboard Shortcuts
- The keyboard shortcut for adding new canvases is **CTRL + ENTER** by default.
- You can change this shortcut in **line 20 of src/main.js**. Modify the event handler to use different keys as needed.

## How it Works
- Each time a new canvas is created, a new instance of the Wiris handwriting editor is inserted into the page.
- The application listens for content changes and enables the creation of new canvases only after the latest one is used.
- Preview images are generated automatically by the Wiris library and can be collected for display.
- MathML for each equation is gathered and can be merged for aligned display.

## File Structure
- `index.html` – Main HTML file, includes the Render Results button and containers.
- `src/main.js` – Main JavaScript logic for canvas creation, event handling, and MathML processing.
- `src/style.css` – Basic styles for the application.
- `package.json` – Project metadata and scripts.

---

For more details, see the code and comments in `src/main.js`.

---

## License
This demo project is for demonstration purposes. Please ensure you have appropriate licenses for:
- MathType: License required for MathType integration

## Support
You can also contact the WIRIS Technical Support Team at support@wiris.com
