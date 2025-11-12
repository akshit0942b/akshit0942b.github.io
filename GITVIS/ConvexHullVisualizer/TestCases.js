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
        // Best case: Mostly clustered near center, few points on outer hull
        var hullPoints = Math.min(6, Math.floor(n * 0.15)); // Only ~15% on hull
        var innerPoints = n - hullPoints;
        
        // Few points on outer hull (hexagon)
        var angleStep = (2 * Math.PI) / hullPoints;
        for (var i = 0; i < hullPoints; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
        // Many points clustered near center
        for (var i = 0; i < innerPoints; i++) {
            var angle = Math.random() * 2 * Math.PI;
            var r = Math.random() * radius * 0.4; // Clustered near center
            var x = centerX + r * Math.cos(angle);
            var y = centerY + r * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Graham Scan') {
        // Best case: Simple convex shape (triangle/polygon) with few interior points
        var hullPoints = Math.min(8, Math.floor(n * 0.25)); // ~25% on hull
        var innerPoints = n - hullPoints;
        
        // Convex polygon for hull
        var angleStep = (2 * Math.PI) / hullPoints;
        for (var i = 0; i < hullPoints; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
        // Few interior points
        for (var i = 0; i < innerPoints; i++) {
            var angle = Math.random() * 2 * Math.PI;
            var r = Math.random() * radius * 0.7;
            var x = centerX + r * Math.cos(angle);
            var y = centerY + r * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Monotone Chain') {
        // Best case: Points already sorted lexicographically along two straight lines
        var halfN = Math.floor(n / 2);
        
        // Upper line (sorted by x)
        for (var i = 0; i < halfN; i++) {
            var t = i / (halfN - 1);
            var x = centerX - radius + t * radius * 2;
            var y = centerY - radius * 0.5;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
        // Lower line (sorted by x)
        for (var i = 0; i < n - halfN; i++) {
            var t = i / (n - halfN - 1);
            var x = centerX - radius + t * radius * 2;
            var y = centerY + radius * 0.5;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Quickhull') {
        // Best case: Evenly scattered inside convex shape (random within circle)
        // Allows balanced partitions in recursion
        for (var i = 0; i < n; i++) {
            var angle = Math.random() * 2 * Math.PI;
            var r = Math.sqrt(Math.random()) * radius * 0.9; // Uniform distribution
            var x = centerX + r * Math.cos(angle);
            var y = centerY + r * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else {
        // Default: Simple convex polygon
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
        // Worst case: All or almost all points on the convex hull
        // Points evenly spaced around a circle - O(n²) complexity
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
        // Worst case: Zigzag or star-like pattern causing many stack pops
        // Create star pattern with alternating radii
        var angleStep = (2 * Math.PI) / n;
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep;
            // Alternate between inner and outer radius (star pattern)
            var r = (i % 2 === 0) ? radius : radius * 0.5;
            var x = centerX + r * Math.cos(angle);
            var y = centerY + r * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Monotone Chain') {
        // Worst case: Randomly distributed in 2D space
        // Requires full sorting with no pre-existing order
        for (var i = 0; i < n; i++) {
            // Completely random distribution
            var x = centerX + (Math.random() - 0.5) * radius * 2;
            var y = centerY + (Math.random() - 0.5) * radius * 2;
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else if (algo === 'Quickhull') {
        // Worst case: All or most points on the convex boundary (circle)
        // Or nearly collinear along a line
        var angleStep = (2 * Math.PI) / n;
        for (var i = 0; i < n; i++) {
            var angle = i * angleStep;
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            x = Math.max(100, Math.min(x, canvas.width - 100));
            y = Math.max(100, Math.min(y, canvas.height - 100));
            points.push({x: x, y: y});
        }
        
    } else {
        // Default worst case: points on circle
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
