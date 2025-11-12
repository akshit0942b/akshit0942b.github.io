// Helper function to find orientation of ordered triplet (p, q, r)
// Returns: 0 -> Collinear, 1 -> Clockwise, 2 -> Counterclockwise
function orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(val) < 1e-9) return 0;
    return (val > 0) ? 1 : 2;
}

// Compare points by x-coordinate (and by y if x is same)
function comparePoints(a, b) {
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
}

function sleep(ms) {
    if(currentSelectedSpeed === 'Super Sonic' || shouldStopAnimation) return Promise.resolve();
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDelay(){
    switch(currentSelectedSpeed){
        case 'Super Sonic': return 0;
        case 'Fast': return 200;
        case 'Average': return 600;
        case 'Slow': return 1200;
        default: return 600;
    }
}

// Merge two convex hulls
async function mergeHulls(leftHull, rightHull, delay) {
    if(shouldStopAnimation) return [];
    
    var n1 = leftHull.length;
    var n2 = rightHull.length;
    
    // Find rightmost point of left hull
    var rightmostLeft = 0;
    for(var i = 1; i < n1; i++) {
        if(leftHull[i].x > leftHull[rightmostLeft].x) {
            rightmostLeft = i;
        }
    }
    
    // Find leftmost point of right hull
    var leftmostRight = 0;
    for(var i = 1; i < n2; i++) {
        if(rightHull[i].x < rightHull[leftmostRight].x) {
            leftmostRight = i;
        }
    }
    
    // Visualize the two hulls being merged
    highlightPoint(leftHull[rightmostLeft], '#3498db');
    highlightPoint(rightHull[leftmostRight], '#3498db');
    await sleep(delay);
    
    // Find upper tangent
    var indexLeft = rightmostLeft;
    var indexRight = leftmostRight;
    var done = false;
    
    while(!done && !shouldStopAnimation) {
        done = true;
        
        // Move clockwise in left hull
        while(orientation(rightHull[indexRight], leftHull[indexLeft], 
                         leftHull[(indexLeft + 1) % n1]) >= 0) {
            indexLeft = (indexLeft + 1) % n1;
            
            // Visualize search
            var tempLine = makeTemporaryLine(rightHull[indexRight], leftHull[indexLeft], '#f39c12');
            highlightPoint(leftHull[indexLeft], '#f39c12');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(leftHull[indexLeft]);
            
            if(shouldStopAnimation) return [];
        }
        
        // Move counterclockwise in right hull
        while(orientation(leftHull[indexLeft], rightHull[indexRight], 
                         rightHull[(n2 + indexRight - 1) % n2]) <= 0) {
            indexRight = (n2 + indexRight - 1) % n2;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(leftHull[indexLeft], rightHull[indexRight], '#f39c12');
            highlightPoint(rightHull[indexRight], '#f39c12');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(rightHull[indexRight]);
            
            if(shouldStopAnimation) return [];
        }
    }
    
    var upperLeft = indexLeft;
    var upperRight = indexRight;
    
    // Show upper tangent
    var upperTangent = makeTemporaryLine(leftHull[upperLeft], rightHull[upperRight], '#e74c3c');
    await sleep(delay);
    
    // Find lower tangent
    indexLeft = rightmostLeft;
    indexRight = leftmostRight;
    done = false;
    
    while(!done && !shouldStopAnimation) {
        done = true;
        
        // Move counterclockwise in left hull
        while(orientation(rightHull[indexRight], leftHull[indexLeft], 
                         leftHull[(n1 + indexLeft - 1) % n1]) <= 0) {
            indexLeft = (n1 + indexLeft - 1) % n1;
            
            // Visualize search
            var tempLine = makeTemporaryLine(rightHull[indexRight], leftHull[indexLeft], '#9b59b6');
            highlightPoint(leftHull[indexLeft], '#9b59b6');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(leftHull[indexLeft]);
            
            if(shouldStopAnimation) return [];
        }
        
        // Move clockwise in right hull
        while(orientation(leftHull[indexLeft], rightHull[indexRight], 
                         rightHull[(indexRight + 1) % n2]) >= 0) {
            indexRight = (indexRight + 1) % n2;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(leftHull[indexLeft], rightHull[indexRight], '#9b59b6');
            highlightPoint(rightHull[indexRight], '#9b59b6');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(rightHull[indexRight]);
            
            if(shouldStopAnimation) return [];
        }
    }
    
    var lowerLeft = indexLeft;
    var lowerRight = indexRight;
    
    // Show lower tangent
    var lowerTangent = makeTemporaryLine(leftHull[lowerLeft], rightHull[lowerRight], '#27ae60');
    await sleep(delay * 1.5);
    
    // Remove temporary tangent lines
    $(upperTangent).remove();
    $(lowerTangent).remove();
    
    // Build merged hull
    var mergedHull = [];
    
    // Add points from left hull (from upper to lower going clockwise)
    var index = upperLeft;
    mergedHull.push(leftHull[index]);
    while(index !== lowerLeft) {
        index = (index + 1) % n1;
        mergedHull.push(leftHull[index]);
    }
    
    // Add points from right hull (from lower to upper going clockwise)
    index = lowerRight;
    mergedHull.push(rightHull[index]);
    while(index !== upperRight) {
        index = (index + 1) % n2;
        mergedHull.push(rightHull[index]);
    }
    
    return mergedHull;
}

// Recursive divide and conquer function
async function divideAndConquer(pointSet, delay) {
    if(shouldStopAnimation) return [];
    
    var n = pointSet.length;
    
    // Base case: if 3 or fewer points, return them in order
    if(n <= 3) {
        // Visualize base case
        pointSet.forEach(p => {
            highlightPoint(p, '#2ecc71');
        });
        await sleep(delay);
        pointSet.forEach(p => {
            unhighlightPoint(p);
        });
        
        if(n === 1) return [pointSet[0]];
        if(n === 2) return pointSet;
        
        // For 3 points, return them in counterclockwise order
        var hull3 = [pointSet[0], pointSet[1], pointSet[2]];
        if(orientation(hull3[0], hull3[1], hull3[2]) === 1) {
            // Clockwise, so reverse
            hull3 = [hull3[0], hull3[2], hull3[1]];
        }
        return hull3;
    }
    
    // Divide into two halves
    var mid = Math.floor(n / 2);
    var leftPoints = pointSet.slice(0, mid);
    var rightPoints = pointSet.slice(mid);
    
    // Visualize division
    leftPoints.forEach(p => highlightPoint(p, '#3498db'));
    rightPoints.forEach(p => highlightPoint(p, '#e74c3c'));
    await sleep(delay);
    leftPoints.forEach(p => unhighlightPoint(p));
    rightPoints.forEach(p => unhighlightPoint(p));
    
    if(shouldStopAnimation) return [];
    
    // Recursively find convex hulls
    var leftHull = await divideAndConquer(leftPoints, delay);
    if(shouldStopAnimation) return [];
    
    var rightHull = await divideAndConquer(rightPoints, delay);
    if(shouldStopAnimation) return [];
    
    // Merge the two hulls
    return await mergeHulls(leftHull, rightHull, delay);
}

async function ConvexHull_DAC(){
    points = []
    var nodes = $('.point');
    for(var i = 0; i<nodes.length; i++){
        points.push(html_point.get(nodes[i]));
    }
    
    if(points.length < 3) {
        alert("Need at least 3 points for convex hull!");
        isRunning = false;
        EnableButtons();
        return;
    }
    
    var delay = getDelay();
    hull = [];
    
    // Sort points by x-coordinate
    var sortedPoints = points.slice().sort(comparePoints);
    
    // Visualize sorted points
    for(var i = 0; i < sortedPoints.length; i++) {
        highlightPoint(sortedPoints[i], '#f39c12');
        await sleep(delay / 3);
        unhighlightPoint(sortedPoints[i]);
        if(shouldStopAnimation) break;
    }
    
    if(shouldStopAnimation) {
        removeTemporaryLines();
        isRunning = false;
        EnableButtons();
        return;
    }
    
    // Perform divide and conquer
    hull = await divideAndConquer(sortedPoints, delay);
    
    if(!shouldStopAnimation && hull.length > 0){
        hull.forEach(el => {
            if(point_html.get(el)) {
                point_html.get(el).className = "point-hull";
            }
        });
        ConnectHull();
    }
    
    removeTemporaryLines();
    isRunning = false;
    EnableButtons();
}