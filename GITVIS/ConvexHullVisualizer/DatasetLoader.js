// Toggle sidebar open/closed
function toggleSidebar() {
    var sidebar = document.getElementById('dataSidebar');
    sidebar.classList.toggle('open');
}

// Parse dataset and generate points
function generateFromDataset() {
    var input = document.getElementById('datasetInput').value.trim();
    var statusDiv = document.getElementById('datasetStatus');
    
    if (!input) {
        showStatus('Please enter some coordinates!', 'error');
        return;
    }
    
    // Clear existing points
    clearNodes();
    
    // Parse the input
    var lines = input.split('\n');
    var validPoints = 0;
    var invalidLines = [];
    
    // Get canvas boundaries
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    let offset = 50;
    
    lines.forEach(function(line, index) {
        line = line.trim();
        if (!line) return; // Skip empty lines
        
        // Try to parse the line - support multiple formats
        // Formats: "x, y" or "x y" or "(x, y)" or "x,y"
        var coords = line.replace(/[()]/g, '').split(/[,\s]+/).map(function(s) {
            return parseFloat(s.trim());
        });
        
        if (coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            var x = coords[0];
            var y = coords[1];
            
            // Validate coordinates are within canvas bounds
            if (x >= offset && x <= canvas.width - offset && 
                y >= offset && y <= canvas.height - offset) {
                CreateAutoPoint(x, y);
                validPoints++;
            } else {
                invalidLines.push('Line ' + (index + 1) + ': coordinates out of bounds');
            }
        } else {
            invalidLines.push('Line ' + (index + 1) + ': invalid format');
        }
    });
    
    UpdatePointCounters();
    
    // Show status message
    var message = 'Successfully loaded ' + validPoints + ' point(s)';
    if (invalidLines.length > 0) {
        message += '\n' + invalidLines.length + ' line(s) skipped';
    }
    showStatus(message, validPoints > 0 ? 'success' : 'error');
    
    // Auto-close sidebar after successful load
    if (validPoints > 0) {
        setTimeout(function() {
            toggleSidebar();
        }, 1500);
    }
}

// Clear the dataset input
function clearDatasetInput() {
    document.getElementById('datasetInput').value = '';
    document.getElementById('datasetStatus').style.display = 'none';
}

// Show status message
function showStatus(message, type) {
    var statusDiv = document.getElementById('datasetStatus');
    statusDiv.textContent = message;
    statusDiv.className = 'dataset-status ' + type;
}

// Example dataset generator
function loadExampleDataset() {
    var example = "100, 150\n200, 100\n300, 200\n150, 250\n250, 300\n350, 150";
    document.getElementById('datasetInput').value = example;
}
