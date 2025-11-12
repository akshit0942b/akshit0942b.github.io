/**
 * TestData.js
 * 
 * Loads test coordinates from test_points.txt file
 * 
 * To use:
 * 1. Edit test_points.txt and add your coordinates (x, y format, one per line)
 * 2. Set USE_TEST_FILE = true below
 * 3. Reload the page
 * 
 * Or use the browser console: loadTestFile()
 */

// Set this to true to auto-load test points from test_points.txt on page load
var USE_TEST_FILE = true;

/**
 * Load points from uploaded file
 */
function loadPointsFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    console.log('Loading points from: ' + file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseAndLoadPoints(text);
    };
    reader.onerror = function(e) {
        console.error('Error reading file:', e);
        alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
}

/**
 * Load test points from test_points.txt file
 */
function loadTestFile() {
    console.log('Loading test points from test_points.txt...');
    
    fetch('test_points.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load test_points.txt');
            }
            return response.text();
        })
        .then(text => {
            parseAndLoadPoints(text);
        })
        .catch(error => {
            console.error('Error loading test file:', error);
            console.log('Make sure test_points.txt exists in the same directory');
        });
}

/**
 * Parse text content and load points
 */
function parseAndLoadPoints(text) {
    // Clear existing points
    clearNodes();
    
    // Get canvas dimensions
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    
    // Split into lines
    var lines = text.split('\n');
    var loadedCount = 0;
    var skippedCount = 0;
    
    // Calculate canvas boundaries
    var offset = 50;
    var maxX = canvas.width - offset;
    var maxY = canvas.height - offset;
    
    lines.forEach(function(line, index) {
        // Remove whitespace
        line = line.trim();
        
        // Skip empty lines and comments
        if (line === '' || line.startsWith('#')) {
            return;
        }
        
        // Parse coordinates
        var parts = line.split(',');
        if (parts.length !== 2) {
            console.warn('Line ' + (index + 1) + ' has invalid format: ' + line);
            skippedCount++;
            return;
        }
        
        var inputX = parseFloat(parts[0].trim());
        var inputY = parseFloat(parts[1].trim());
        
        // Validate
        if (isNaN(inputX) || isNaN(inputY)) {
            console.warn('Line ' + (index + 1) + ' has invalid numbers: ' + line);
            skippedCount++;
            return;
        }
        
        if (inputX < 0 || inputX > maxX || inputY < 0 || inputY > maxY) {
            console.warn('Line ' + (index + 1) + ' out of bounds (' + inputX + ', ' + inputY + '). Max: (' + maxX + ', ' + maxY + ')');
            skippedCount++;
            return;
        }
        
        // Transform coordinates (bottom-left origin to canvas coordinates)
        var canvasX = canvas.left + offset + inputX;
        var canvasY = canvas.top + (canvas.height - offset - inputY);
        
        // Create the point
        CreateAutoPoint(canvasX, canvasY);
        loadedCount++;
    });
    
    console.log('✓ Successfully loaded ' + loadedCount + ' points');
    if (skippedCount > 0) {
        console.log('⚠ Skipped ' + skippedCount + ' invalid lines');
    }
}


/**
 * Load the active test case into the points array
 * This function is called automatically if USE_TEST_DATA is true
 */
function loadTestData() {
    if (!USE_TEST_DATA) {
        console.log('Test data loading is disabled. Set USE_TEST_DATA = true to enable.');
        return;
    }
    
    var testCase = TEST_CASES[ACTIVE_TEST_CASE];
    
    if (!testCase) {
        console.error('Test case "' + ACTIVE_TEST_CASE + '" not found!');
        return;
    }
    
    console.log('Loading test case: ' + ACTIVE_TEST_CASE);
    console.log('Points to load: ' + testCase.length);
    
    // Clear existing points
    clearNodes();
    
    // Get canvas dimensions
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    
    // Calculate canvas boundaries
    var offset = 50;
    var maxX = canvas.width - offset;
    var maxY = canvas.height - offset;
    
    // Load each point
    testCase.forEach(function(coord, index) {
        var inputX = coord[0];
        var inputY = coord[1];
        
        // Validate coordinates
        if (inputX < 0 || inputX > maxX || inputY < 0 || inputY > maxY) {
            console.warn('Point ' + index + ' (' + inputX + ', ' + inputY + ') is out of bounds. Skipping.');
            return;
        }
        
        // Transform coordinates (bottom-left origin to canvas coordinates)
        var canvasX = canvas.left + offset + inputX;
        var canvasY = canvas.top + (canvas.height - offset - inputY);
        
        // Create the point
        CreateAutoPoint(canvasX, canvasY);
    });
    
    console.log('Successfully loaded ' + points.length + ' points');
}

/**
 * Manually load a specific test case
 * Usage: loadSpecificTestCase('square')
 */
function loadSpecificTestCase(testCaseName) {
    if (!TEST_CASES[testCaseName]) {
        console.error('Test case "' + testCaseName + '" not found!');
        console.log('Available test cases:', Object.keys(TEST_CASES).join(', '));
        return;
    }
    
    ACTIVE_TEST_CASE = testCaseName;
    USE_TEST_DATA = true;
    loadTestData();
}

/**
 * Export current points as a test case
 * Useful for saving manually created point sets
 */
function exportCurrentPoints() {
    if (points.length === 0) {
        console.log('No points to export');
        return;
    }
    
    // Get canvas dimensions
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    
    var offset = 50;
    var output = '# Exported points (' + points.length + ' total)\n';
    
    points.forEach(function(p) {
        // Convert canvas coordinates back to input coordinates
        var inputX = Math.round(p.x - canvas.left - offset);
        var inputY = Math.round(canvas.height - offset - (p.y - canvas.top));
        output += inputX + ', ' + inputY + '\n';
    });
    
    console.log('Copy this to test_points.txt:');
    console.log(output);
    return output;
}
