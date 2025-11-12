// Generate test cases for different algorithms
function generateTestCase(caseType) {
    // Clear existing points
    clearNodes();
    
    // Get canvas boundaries
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = Math.min(canvas.width, canvas.height) / 3;
    
    // Get number of points from input
    var numPointsInput = document.getElementById("numPointsToGenerate");
    var n = numPointsInput ? parseInt(numPointsInput.value) || 20 : 20;
    n = Math.max(5, Math.min(n, 100)); // Ensure reasonable bounds
    
    var points = [];
    
    switch(caseType) {
        case 'best':
            points = generateBestCase(n, centerX, centerY, radius, canvas);
            break;
        case 'worst':
            points = generateWorstCase(n, centerX, centerY, radius, canvas);
            break;
        case 'average':
            points = generateAverageCase(n, centerX, centerY, radius, canvas);
            break;
        default:
            return;
    }
    
    // Create points on canvas
    points.forEach(function(p) {
        CreateAutoPoint(p.x, p.y);
    });
    
    UpdatePointCounters();
}

// Best case: Points already on convex hull (circle/polygon)
function generateBestCase(n, centerX, centerY, radius, canvas) {
    var points = [];
    var angleStep = (2 * Math.PI) / n;
    
    for (var i = 0; i < n; i++) {
        var angle = i * angleStep;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        
        // Ensure within canvas bounds
        x = Math.max(100, Math.min(x, canvas.width - 100));
        y = Math.max(100, Math.min(y, canvas.height - 100));
        
        points.push({x: x, y: y});
    }
    
    return points;
}

// Worst case: Points in specific patterns that cause maximum comparisons
function generateWorstCase(n, centerX, centerY, radius, canvas) {
    var points = [];
    
    // Different worst cases based on current algorithm
    var algo = currentSelected || 'Graham Scan';
    
    if (algo === 'Graham Scan' || algo === 'Monotone Chain') {
        // Worst case: Points on a vertical line or nearly collinear
        // This causes many backtracking operations
        var halfN = Math.floor(n / 2);
        
        // Create a parabola-like shape (many points inside hull)
        for (var i = 0; i < n; i++) {
            var t = (i / (n - 1)) - 0.5; // -0.5 to 0.5
            var x = centerX + t * radius * 2;
            var y = centerY - Math.pow(t * 2, 2) * radius * 0.8;
            
            // Ensure within canvas bounds
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            
            points.push({x: x, y: y});
        }
    } else if (algo === 'Jarvis March') {
        // Worst case: All points on hull (circle)
        return generateBestCase(n, centerX, centerY, radius, canvas);
    } else if (algo === 'Quickhull') {
        // Worst case: Points distributed such that recursive calls are unbalanced
        // Create a semicircle with dense packing
        for (var i = 0; i < n; i++) {
            var angle = Math.PI * (i / (n - 1)); // 0 to PI (semicircle)
            var r = radius * (0.8 + 0.2 * Math.random()); // Slight variation
            var x = centerX + r * Math.cos(angle);
            var y = centerY - r * Math.sin(angle);
            
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            
            points.push({x: x, y: y});
        }
    } else {
        // Default worst case: many collinear points
        for (var i = 0; i < n; i++) {
            var x = centerX + (i / n - 0.5) * radius * 2;
            var y = centerY + (Math.random() - 0.5) * 50; // Small vertical spread
            
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            
            points.push({x: x, y: y});
        }
    }
    
    return points;
}

// Average case: Mix of points inside and on hull
function generateAverageCase(n, centerX, centerY, radius, canvas) {
    var points = [];
    
    // Create about 30% of points on the hull (circle)
    var hullPoints = Math.floor(n * 0.3);
    var innerPoints = n - hullPoints;
    
    // Points on hull
    var angleStep = (2 * Math.PI) / hullPoints;
    for (var i = 0; i < hullPoints; i++) {
        var angle = i * angleStep;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        
        x = Math.max(100, Math.min(x, canvas.width - 100));
        y = Math.max(100, Math.min(y, canvas.height - 100));
        
        points.push({x: x, y: y});
    }
    
    // Points inside hull (random distribution)
    for (var i = 0; i < innerPoints; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var r = Math.random() * radius * 0.8; // Inside the hull
        var x = centerX + r * Math.cos(angle);
        var y = centerY + r * Math.sin(angle);
        
        x = Math.max(100, Math.min(x, canvas.width - 100));
        y = Math.max(100, Math.min(y, canvas.height - 100));
        
        points.push({x: x, y: y});
    }
    
    return points;
}
