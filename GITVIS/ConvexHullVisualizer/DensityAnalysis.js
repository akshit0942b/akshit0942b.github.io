/**
 * DensityAnalysis.js
 * 
 * Analyzes point density distribution and displays bounding circles
 */

var densityCirclesVisible = false;

/**
 * Calculate the minimum bounding circle that contains all points
 */
function calculateBoundingCircle() {
    if (points.length === 0) {
        return null;
    }
    
    // Find center (centroid of all points)
    let sumX = 0, sumY = 0;
    points.forEach(p => {
        sumX += p.x;
        sumY += p.y;
    });
    
    const centerX = sumX / points.length;
    const centerY = sumY / points.length;
    
    // Find maximum distance from center (radius)
    let maxRadius = 0;
    points.forEach(p => {
        const distance = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
        if (distance > maxRadius) {
            maxRadius = distance;
        }
    });
    
    return {
        centerX: centerX,
        centerY: centerY,
        radius: maxRadius
    };
}

/**
 * Count points inside a circle
 */
function countPointsInCircle(centerX, centerY, radius) {
    let count = 0;
    points.forEach(p => {
        const distance = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
        if (distance <= radius) {
            count++;
        }
    });
    return count;
}

/**
 * Calculate density ratio (inner circle / outer ring)
 */
function calculateDensityRatio() {
    if (points.length === 0) {
        console.log('No points to analyze');
        return null;
    }
    
    const boundingCircle = calculateBoundingCircle();
    if (!boundingCircle) {
        return null;
    }
    
    const outerRadius = boundingCircle.radius;
    const innerRadius = outerRadius / 2;
    
    const pointsInInner = countPointsInCircle(boundingCircle.centerX, boundingCircle.centerY, innerRadius);
    const pointsInOuter = points.length; // All points are in outer circle
    const pointsInRing = pointsInOuter - pointsInInner; // Points in outer ring only
    
    // Calculate ratio (avoid division by zero)
    const ratio = pointsInRing > 0 ? pointsInInner / pointsInRing : pointsInInner;
    
    // Calculate area ratio for normalization
    const innerArea = Math.PI * innerRadius * innerRadius;
    const outerArea = Math.PI * outerRadius * outerRadius;
    const ringArea = outerArea - innerArea;
    
    const densityInner = pointsInInner / innerArea;
    const densityRing = pointsInRing > 0 ? pointsInRing / ringArea : 0;
    const normalizedRatio = densityRing > 0 ? densityInner / densityRing : densityInner;
    
    return {
        boundingCircle: boundingCircle,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        pointsInInner: pointsInInner,
        pointsInRing: pointsInRing,
        totalPoints: pointsInOuter,
        ratio: ratio,
        normalizedRatio: normalizedRatio
    };
}

/**
 * Draw density circles on the canvas
 */
function drawDensityCircles() {
    // Remove existing circles
    removeDensityCircles();
    
    const analysis = calculateDensityRatio();
    if (!analysis) {
        return;
    }
    
    const svg = document.getElementById('path-container');
    
    // Draw outer circle (light blue)
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', analysis.boundingCircle.centerX);
    outerCircle.setAttribute('cy', analysis.boundingCircle.centerY);
    outerCircle.setAttribute('r', analysis.outerRadius);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#3498db');
    outerCircle.setAttribute('stroke-width', '1.5');
    outerCircle.setAttribute('stroke-dasharray', '5,5');
    outerCircle.setAttribute('class', 'density-circle');
    outerCircle.setAttribute('opacity', '0.5');
    svg.appendChild(outerCircle);
    
    // Draw inner circle (light green)
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', analysis.boundingCircle.centerX);
    innerCircle.setAttribute('cy', analysis.boundingCircle.centerY);
    innerCircle.setAttribute('r', analysis.innerRadius);
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#2ecc71');
    innerCircle.setAttribute('stroke-width', '1.5');
    innerCircle.setAttribute('stroke-dasharray', '5,5');
    innerCircle.setAttribute('class', 'density-circle');
    innerCircle.setAttribute('opacity', '0.5');
    svg.appendChild(innerCircle);
    
    densityCirclesVisible = true;
    
    // Display analysis results
    displayDensityAnalysis(analysis);
}

/**
 * Remove density circles from canvas
 */
function removeDensityCircles() {
    const circles = document.querySelectorAll('.density-circle');
    circles.forEach(circle => circle.remove());
    densityCirclesVisible = false;
    
    // Hide analysis display
    const display = document.getElementById('densityAnalysisDisplay');
    if (display) {
        display.style.display = 'none';
    }
}

/**
 * Toggle density circles visibility
 */
function toggleDensityCircles() {
    if (points.length === 0) {
        alert('Please add some points first!');
        return;
    }
    
    if (densityCirclesVisible) {
        removeDensityCircles();
    } else {
        drawDensityCircles();
    }
}

/**
 * Display density analysis results
 */
function displayDensityAnalysis(analysis) {
    // Create or update display div
    let display = document.getElementById('densityAnalysisDisplay');
    if (!display) {
        display = document.createElement('div');
        display.id = 'densityAnalysisDisplay';
        display.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            z-index: 1000;
            min-width: 250px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(display);
    }
    
    // Determine density interpretation with detailed description
    let interpretation = '';
    let detailedDescription = '';
    
    // Calculate percentages
    const innerPercentage = ((analysis.pointsInInner / analysis.totalPoints) * 100).toFixed(1);
    const ringPercentage = ((analysis.pointsInRing / analysis.totalPoints) * 100).toFixed(1);
    
    if (analysis.normalizedRatio > 2.0) {
        interpretation = '🔴 Highly Concentrated in Center';
        detailedDescription = `${innerPercentage}% of points are clustered in the inner circle (50% of area). Points are densely packed near the center, ${analysis.normalizedRatio.toFixed(1)}x more dense than the outer region. This creates a tight central cluster.`;
    } else if (analysis.normalizedRatio > 1.5) {
        interpretation = '🟠 Strongly Centered Distribution';
        detailedDescription = `${innerPercentage}% of points lie within the inner half-radius circle. The center has ${analysis.normalizedRatio.toFixed(1)}x higher density than the outer ring, indicating significant clustering toward the middle.`;
    } else if (analysis.normalizedRatio > 1.0) {
        interpretation = '🟡 Moderately Centered';
        detailedDescription = `${innerPercentage}% in center vs ${ringPercentage}% in outer ring. Points favor the center with ${analysis.normalizedRatio.toFixed(1)}x density, but still maintain reasonable distribution across the space.`;
    } else if (analysis.normalizedRatio > 0.7) {
        interpretation = '🟢 Evenly Distributed';
        detailedDescription = `Points are well-balanced: ${innerPercentage}% inner, ${ringPercentage}% outer ring. Density ratio of ${analysis.normalizedRatio.toFixed(1)}x indicates uniform spread across the entire area with no significant clustering.`;
    } else if (analysis.normalizedRatio > 0.4) {
        interpretation = '🔵 Spread Towards Edges';
        detailedDescription = `Only ${innerPercentage}% of points are in the center, while ${ringPercentage}% occupy the outer ring. Density is ${(1/analysis.normalizedRatio).toFixed(1)}x higher at the edges, showing peripheral concentration.`;
    } else {
        interpretation = '🟣 Heavily Concentrated at Edges';
        detailedDescription = `${ringPercentage}% of points are pushed to the outer regions with only ${innerPercentage}% near center. Edge density is ${(1/analysis.normalizedRatio).toFixed(1)}x higher, creating a ring-like distribution pattern.`;
    }
    
    display.innerHTML = `
        <h4 style="margin-top: 0; border-bottom: 2px solid #34495e; padding-bottom: 8px;">
            📊 Density Analysis
        </h4>
        <div style="line-height: 1.8;">
            <div><strong>Total Points:</strong> ${analysis.totalPoints}</div>
            <div style="color: #2ecc71;"><strong>Inner Circle (50% radius):</strong> ${analysis.pointsInInner} points (${innerPercentage}%)</div>
            <div style="color: #3498db;"><strong>Outer Ring:</strong> ${analysis.pointsInRing} points (${ringPercentage}%)</div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #34495e;">
                <strong>Count Ratio (Inner/Ring):</strong> ${analysis.ratio.toFixed(2)}
            </div>
            <div><strong>Density Ratio:</strong> ${analysis.normalizedRatio.toFixed(2)}x</div>
            <div style="margin-top: 12px; padding: 10px; background-color: rgba(52, 73, 94, 0.8); border-radius: 4px; border-left: 3px solid #3498db;">
                <strong style="display: block; margin-bottom: 6px;">${interpretation}</strong>
                <div style="font-size: 11px; line-height: 1.6; color: #ecf0f1;">
                    ${detailedDescription}
                </div>
            </div>
        </div>
        <button onclick="removeDensityCircles()" style="
            width: 100%;
            margin-top: 10px;
            padding: 8px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        ">✕ Close Analysis</button>
    `;
    
    display.style.display = 'block';
}

/**
 * Export density analysis with hull metrics
 */
function exportDensityMetrics(algorithmName, executionTime, hullSize) {
    const analysis = calculateDensityRatio();
    if (!analysis) {
        console.log('No points to analyze');
        return null;
    }
    
    const metrics = {
        algorithm: algorithmName,
        executionTime: executionTime,
        hullSize: hullSize,
        totalPoints: analysis.totalPoints,
        pointsInInner: analysis.pointsInInner,
        pointsInRing: analysis.pointsInRing,
        densityRatio: analysis.ratio,
        normalizedDensity: analysis.normalizedRatio,
        outerRadius: analysis.outerRadius.toFixed(2),
        innerRadius: analysis.innerRadius.toFixed(2)
    };
    
    console.log('=== Density & Performance Metrics ===');
    console.log(JSON.stringify(metrics, null, 2));
    
    return metrics;
}
