// Generate test cases for different algorithms
function generateTestCase(caseType) {
    // Clear existing points
    clearNodes();
    
    // Get canvas boundaries
    let canvas = document.getElementById("sandbox").getBoundingClientRect();
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = Math.min(canvas.width, canvas.height) / 3;
    
    // Get number of points from input - use more points for test cases
    var numPointsInput = document.getElementById("numPointsToGenerate");
    var n = numPointsInput ? parseInt(numPointsInput.value) || 50 : 50;
    n = Math.max(10, Math.min(n * 2, 200)); // Double the input, with reasonable bounds
    
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
// Best for ALL algorithms - O(n) or O(n log n) performance
function generateBestCase(n, centerX, centerY, radius, canvas) {
    var points = [];
    var algo = currentSelected || 'Graham Scan';
    
    if (algo === 'Jarvis March') {
        // Best case for Jarvis March: Small number of points on hull
        // Generate few points on outer circle, many inside
        var hullPoints = Math.min(8, Math.floor(n * 0.2)); // Only 20% on hull
        var innerPoints = n - hullPoints;
        
        // Points on hull (circle)
        var angleStep = (2 * Math.PI) / hullPoints;
        for (var i = 0; i < hullPoints; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
        // Many points inside
        for (var i = 0; i < innerPoints; i++) {
            var angle = Math.random() * 2 * Math.PI;
            var r = Math.random() * radius * 0.7;
            var x = centerX + r * Math.cos(angle);
            var y = centerY + r * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
    } else {
        // Best case for Graham Scan, Quickhull, Monotone Chain:
        // All points on convex hull (circle) - optimal O(n log n)
        var angleStep = (2 * Math.PI) / n;
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
    }
    
    return points;
}

// Worst case: Points in specific patterns that cause maximum comparisons
function generateWorstCase(n, centerX, centerY, radius, canvas) {
    var points = [];
    var algo = currentSelected || 'Graham Scan';
    
    if (algo === 'Jarvis March') {
        // Worst case for Jarvis March: ALL points on hull - O(nh) where h=n
        // Generate all points on the convex hull (circle)
        var angleStep = (2 * Math.PI) / n;
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Graham Scan') {
        // Worst case for Graham Scan: Points in a grid or nearly collinear
        // Causes maximum number of pop operations (backtracking)
        // Create points in a square grid pattern
        var side = Math.ceil(Math.sqrt(n));
        var spacing = (radius * 1.5) / side;
        var startX = centerX - (side * spacing) / 2;
        var startY = centerY - (side * spacing) / 2;
        
        for (var i = 0; i < n; i++) {
            var row = Math.floor(i / side);
            var col = i % side;
            var x = startX + col * spacing;
            var y = startY + row * spacing;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Quickhull') {
        // Worst case for Quickhull: Points distributed in a way that
        // causes unbalanced partitioning (semi-circle with dense packing)
        for (var i = 0; i < n; i++) {
            var t = i / (n - 1); // 0 to 1
            var angle = Math.PI * t; // 0 to PI (semicircle)
            // Add multiple layers to create worst partitioning
            var layer = Math.floor(i % 3);
            var r = radius * (0.7 + layer * 0.15);
            var x = centerX + r * Math.cos(angle);
            var y = centerY - r * Math.sin(angle) * 0.8;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Monotone Chain') {
        // Worst case for Monotone Chain: Points requiring maximum stack operations
        // Create a "saw-tooth" or zig-zag pattern along x-axis
        var spacing = (radius * 2) / n;
        for (var i = 0; i < n; i++) {
            var x = centerX - radius + i * spacing;
            // Alternate up and down to create zig-zag
            var y = centerY + (i % 2 === 0 ? -radius * 0.3 : radius * 0.3);
            // Add slight curve to make it more challenging
            y += Math.sin(i * 0.5) * radius * 0.2;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else {
        // Default worst case: points in a line with slight variation
        for (var i = 0; i < n; i++) {
            var x = centerX + (i / n - 0.5) * radius * 2;
            var y = centerY + (Math.random() - 0.5) * 30;
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
