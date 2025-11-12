// Helper function to calculate cross product
// Returns positive if counter-clockwise, negative if clockwise, 0 if collinear
function crossProduct(O, A, B) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

// Helper function to find orientation of ordered triplet (p, q, r)
// Returns: 0 -> Collinear, 1 -> Clockwise, 2 -> Counterclockwise
function orientation(p, q, r) {
    var val = crossProduct(p, q, r);
    if (Math.abs(val) < 1e-9) return 0;
    return (val > 0) ? 2 : 1; // CCW is positive
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
        if(leftHull[i].x > leftHull[rightmostLeft].x || 
           (leftHull[i].x === leftHull[rightmostLeft].x && leftHull[i].y > leftHull[rightmostLeft].y)) {
            rightmostLeft = i;
        }
    }
    
    // Find leftmost point of right hull
    var leftmostRight = 0;
    for(var i = 1; i < n2; i++) {
        if(rightHull[i].x < rightHull[leftmostRight].x || 
           (rightHull[i].x === rightHull[leftmostRight].x && rightHull[i].y < rightHull[leftmostRight].y)) {
            leftmostRight = i;
        }
    }
    
    // Visualize the two hulls being merged
    highlightPoint(leftHull[rightmostLeft], '#3498db');
    highlightPoint(rightHull[leftmostRight], '#3498db');
    await sleep(delay);
    
    // Find upper tangent
    var upperLeft = rightmostLeft;
    var upperRight = leftmostRight;
    var done = false;
    
    while(!done && !shouldStopAnimation) {
        done = true;
        
        // Check if we need to move up on left hull
        while(true) {
            var nextLeft = (upperLeft + 1) % n1;
            if(crossProduct(rightHull[upperRight], leftHull[upperLeft], leftHull[nextLeft]) <= 0) {
                break;
            }
            upperLeft = nextLeft;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(rightHull[upperRight], leftHull[upperLeft], '#f39c12');
            highlightPoint(leftHull[upperLeft], '#f39c12');
            await sleep(delay / 3);
            $(tempLine).remove();
            unhighlightPoint(leftHull[upperLeft]);
            
            if(shouldStopAnimation) return [];
        }
        
        // Check if we need to move up on right hull
        while(true) {
            var nextRight = (upperRight + n2 - 1) % n2;
            if(crossProduct(leftHull[upperLeft], rightHull[upperRight], rightHull[nextRight]) >= 0) {
                break;
            }
            upperRight = nextRight;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(leftHull[upperLeft], rightHull[upperRight], '#f39c12');
            highlightPoint(rightHull[upperRight], '#f39c12');
            await sleep(delay / 3);
            $(tempLine).remove();
            unhighlightPoint(rightHull[upperRight]);
            
            if(shouldStopAnimation) return [];
        }
    }
    
    // Show upper tangent
    var upperTangent = makeTemporaryLine(leftHull[upperLeft], rightHull[upperRight], '#e74c3c');
    await sleep(delay);
    
    // Find lower tangent
    var lowerLeft = rightmostLeft;
    var lowerRight = leftmostRight;
    done = false;
    
    while(!done && !shouldStopAnimation) {
        done = true;
        
        // Check if we need to move down on left hull
        while(true) {
            var nextLeft = (lowerLeft + n1 - 1) % n1;
            if(crossProduct(rightHull[lowerRight], leftHull[lowerLeft], leftHull[nextLeft]) >= 0) {
                break;
            }
            lowerLeft = nextLeft;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(rightHull[lowerRight], leftHull[lowerLeft], '#9b59b6');
            highlightPoint(leftHull[lowerLeft], '#9b59b6');
            await sleep(delay / 3);
            $(tempLine).remove();
            unhighlightPoint(leftHull[lowerLeft]);
            
            if(shouldStopAnimation) return [];
        }
        
        // Check if we need to move down on right hull
        while(true) {
            var nextRight = (lowerRight + 1) % n2;
            if(crossProduct(leftHull[lowerLeft], rightHull[lowerRight], rightHull[nextRight]) <= 0) {
                break;
            }
            lowerRight = nextRight;
            done = false;
            
            // Visualize search
            var tempLine = makeTemporaryLine(leftHull[lowerLeft], rightHull[lowerRight], '#9b59b6');
            highlightPoint(rightHull[lowerRight], '#9b59b6');
            await sleep(delay / 3);
            $(tempLine).remove();
            unhighlightPoint(rightHull[lowerRight]);
            
            if(shouldStopAnimation) return [];
        }
    }
    
    // Show lower tangent
    var lowerTangent = makeTemporaryLine(leftHull[lowerLeft], rightHull[lowerRight], '#27ae60');
    await sleep(delay * 1.5);
    
    // Remove temporary tangent lines
    $(upperTangent).remove();
    $(lowerTangent).remove();
    
    // Build merged hull in counter-clockwise order
    var mergedHull = [];
    
    // Start from upper tangent on left hull, go counter-clockwise to lower tangent
    var index = upperLeft;
    mergedHull.push(leftHull[index]);
    while(index !== lowerLeft) {
        index = (index + n1 - 1) % n1;
        mergedHull.push(leftHull[index]);
    }
    
    // From lower tangent on right hull, go counter-clockwise to upper tangent
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
    
    // Base case: if 3 or fewer points, compute hull directly
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
        if(n === 2) return [pointSet[0], pointSet[1]];
        
        // For 3 points, return them in counter-clockwise order
        var p0 = pointSet[0], p1 = pointSet[1], p2 = pointSet[2];
        var cross = crossProduct(p0, p1, p2);
        
        if(cross > 0) {
            // Already counter-clockwise
            return [p0, p1, p2];
        } else if(cross < 0) {
            // Clockwise, reverse to make counter-clockwise
            return [p0, p2, p1];
        } else {
            // Collinear - return two points farthest apart
            var d01 = Math.sqrt((p1.x - p0.x)**2 + (p1.y - p0.y)**2);
            var d02 = Math.sqrt((p2.x - p0.x)**2 + (p2.y - p0.y)**2);
            var d12 = Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
            
            if(d01 >= d02 && d01 >= d12) return [p0, p1];
            if(d02 >= d01 && d02 >= d12) return [p0, p2];
            return [p1, p2];
        }
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