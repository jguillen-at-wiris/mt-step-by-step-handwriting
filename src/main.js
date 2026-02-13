import './style.css'

// Flag to control when a new handwriting canvas can be created
var allowNewHand = false;
// Store MathML results for rendering
var gatheredMaths = [];

window.onload = function () {
  // Get the container for handwriting canvases
  const handsContainer = document.getElementById('handsContainer');
  // Initialize the first handwriting canvas instance on page load
  newHand(handsContainer);

  // Bind the render results function to the button click
  document.getElementById('renderResultsBtn').addEventListener('click', mergeMathMLEquationsAligned);

  // Shortcuts
  window.addEventListener('keydown', function (e) {
    // Check if CTRL + ENTER is pressed and if a new hand can be created
    if (e.ctrlKey && e.key === 'Enter' && allowNewHand) {
      e.preventDefault(); // Prevent default behavior (if any)
      // Initialize a new handwriting canvas instance
      newHand(handsContainer);
    }
  });
}

// Function to create a new handwriting canvas and set up listeners for content changes
function newHand(handsContainer) {
  // Create a new container for the new handwriting canvas
  const newHandContainer = document.createElement('div');
  newHandContainer.className = 'handContainer';
  newHandContainer.id = 'handContainer-' + Date.now();

  // Append the new container to the hands container
  handsContainer.appendChild(newHandContainer);

  // Create a new handwriting canvas instance
  const hand = com.wiris.js.JsHand.newInstance();
  // Insert the new handwriting canvas into the newly created container
  hand.insertInto(newHandContainer);

  // Get the current length of gatheredMaths to know where to store the new MathML result
  let mathsLength = gatheredMaths.length;

  // Add listeners to detect user interactions
  hand.addHandListener({
    contentChanged: function () { // On canvas content change and recognition is complete
      // Store the MathML result for later rendering
      gatheredMaths[mathsLength] = hand.getMathML();

      if (newHandContainer === handsContainer.lastElementChild) {
        // Allow new hand creation only if the user interacted with the latest canvas
        allowNewHand = true;
      }
    }
  });

  // New hand created, disable new hand creation until the user interacts with the newer canvas
  allowNewHand = false;
}

// Function to send MathML to the WIRIS rendering service and display the rendered image
async function renderMathML(mathml) {
  // Prepare parameters for the rendering service
  const params = new URLSearchParams();
  params.append('mml', mathml);
  params.append('centerbaseline', 'false');
  params.append('stats-app', 'hand');
  params.append('viewer', 'image');

  try {
    // Send a POST request to the WIRIS rendering service
    const response = await fetch('https://www.wiris.net/demo/editor/render.png', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) throw new Error('Render service error');
    // Convert the response to a blob and create an object URL for the image
    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    document.getElementById("results").innerHTML = `<img src="${imgUrl}" alt="Rendered MathML" />`;
  } catch (error) {
    // Handle errors during rendering
    console.error('Error rendering MathML:', error);
    document.getElementById("results").textContent = 'Error rendering MathML';
  }

}

// Function to merge all MathML equations into a single aligned MathML expression
async function mergeMathMLEquationsAligned() {
  // Check if there are any MathML equations to render
  if (gatheredMaths.length === 0) return false; // No equations to render

  // Remove outer <math> tags and collect inner content
  const innerMaths = gatheredMaths.map(mml => {
    const match = mml.match(/<math[^>]*>([\s\S]*?)<\/math>/);
    return match ? match[1] : mml;
  });
    
  // Split each equation into left, center (=), and right parts
  function splitEquation(mathml) {
    // Find the first <mo>=</mo>
    const eqMatch = mathml.match(/([\s\S]*?)(<mo>=<\/mo>)([\s\S]*)/);
    if (eqMatch) {
      return [eqMatch[1], eqMatch[2], eqMatch[3]];
    } else {
      // If no =, put all in the left column
      return [mathml, '', ''];
    }
  }

  // Create rows for the mtable by splitting each equation and aligning them
  const rows = innerMaths.map(eq => {
    const [left, center, right] = splitEquation(eq);
    return `<mtr>\n  <mtd>${left.trim()}</mtd>\n  <mtd>${center.trim()}</mtd>\n  <mtd>${right.trim()}</mtd>\n</mtr>`;
  }).join('\n');
  
  // Construct the final aligned MathML with an mtable
  const alignedMathML = `<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mtable columnalign=\"right center left\">${rows}</mtable></math>`;
  // Render the final aligned MathML
  renderMathML(alignedMathML);
}
