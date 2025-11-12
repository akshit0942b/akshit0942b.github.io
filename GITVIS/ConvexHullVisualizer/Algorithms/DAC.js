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
    if (shouldStopAnimation) return [];
    
    var n1 = leftHull.length;
    var n2 = rightHull.length;

    if (n1 === 0) return rightHull;
    if (n2 === 0) return leftHull;

    // Find the rightmost point of the left hull
    var rightmostLeft = 0;
    for (var i = 1; i < n1; i++) {
        if (leftHull[i].x > leftHull[rightmostLeft].x) {
            rightmostLeft = i;
        }
    }

    // Find the leftmost point of the right hull
    var leftmostRight = 0;
    for (var i = 1; i < n2; i++) {
        if (rightHull[i].x < rightHull[leftmostRight].x) {
            leftmostRight = i;
        }
    }

    // Start finding the upper tangent
    var upperLeft = rightmostLeft;
    var upperRight = leftmostRight;

    highlightPoint(leftHull[upperLeft], '#3498db');
    highlightPoint(rightHull[upperRight], '#3498db');
    await sleep(delay);

    while (true) {
        if (shouldStopAnimation) return [];
        let changed = false;
        let tempLine;

        // Move up on the left hull
        let nextLeft = (upperLeft + 1) % n1;
        if (crossProduct(rightHull[upperRight], leftHull[upperLeft], leftHull[nextLeft]) > 0) {
            tempLine = makeTemporaryLine(rightHull[upperRight], leftHull[nextLeft], '#f39c12');
            highlightPoint(leftHull[nextLeft], '#f39c12');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(leftHull[nextLeft]);
            
            upperLeft = nextLeft;
            changed = true;
        }

        // Move up on the right hull
        let nextRight = (upperRight + n2 - 1) % n2;
        if (crossProduct(leftHull[upperLeft], rightHull[upperRight], rightHull[nextRight]) < 0) {
            tempLine = makeTemporaryLine(leftHull[upperLeft], rightHull[nextRight], '#f39c12');
            highlightPoint(rightHull[nextRight], '#f39c12');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(rightHull[nextRight]);

            upperRight = nextRight;
            changed = true;
        }

        if (!changed) break;
    }
    
    var upperTangent = makeTemporaryLine(leftHull[upperLeft], rightHull[upperRight], '#e74c3c');
    await sleep(delay);

    // Find the lower tangent
    var lowerLeft = rightmostLeft;
    var lowerRight = leftmostRight;

    while (true) {
        if (shouldStopAnimation) return [];
        let changed = false;
        let tempLine;

        // Move down on the left hull
        let nextLeft = (lowerLeft + n1 - 1) % n1;
        if (crossProduct(rightHull[lowerRight], leftHull[lowerLeft], leftHull[nextLeft]) < 0) {
            tempLine = makeTemporaryLine(rightHull[lowerRight], leftHull[nextLeft], '#9b59b6');
            highlightPoint(leftHull[nextLeft], '#9b59b6');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(leftHull[nextLeft]);

            lowerLeft = nextLeft;
            changed = true;
        }

        // Move down on the right hull
        let nextRight = (lowerRight + 1) % n2;
        if (crossProduct(leftHull[lowerLeft], rightHull[lowerRight], rightHull[nextRight]) > 0) {
            tempLine = makeTemporaryLine(leftHull[lowerLeft], rightHull[nextRight], '#9b59b6');
            highlightPoint(rightHull[nextRight], '#9b59b6');
            await sleep(delay / 2);
            $(tempLine).remove();
            unhighlightPoint(rightHull[nextRight]);

            lowerRight = nextRight;
            changed = true;
        }

        if (!changed) break;
    }

    var lowerTangent = makeTemporaryLine(leftHull[lowerLeft], rightHull[lowerRight], '#27ae60');
    await sleep(delay * 1.5);

    $(upperTangent).remove();
    $(lowerTangent).remove();
    unhighlightPoint(leftHull[rightmostLeft]);
    unhighlightPoint(rightHull[leftmostRight]);

    // Construct the final merged hull
    var mergedHull = [];
    var index = upperLeft;
    mergedHull.push(leftHull[index]);
    while (index !== lowerLeft) {
        index = (index + 1) % n1;
        mergedHull.push(leftHull[index]);
    }

    index = lowerRight;
    if (mergedHull[mergedHull.length - 1] !== rightHull[index]) {
        mergedHull.push(rightHull[index]);
    }
    while (index !== upperRight) {
        index = (index + 1) % n2;
        if (mergedHull[mergedHull.length - 1] !== rightHull[index]) {
            mergedHull.push(rightHull[index]);
        }
    }

    return mergedHull;
}

// Recursive divide and conquer function
async function divideAndConquer(pointSet, delay) {
    if(shouldStopAnimation) return [];
    
    var n = pointSet.length;
    
    // Base case: if 5 or fewer points, compute hull directly using a simpler algorithm (e.g., Graham Scan logic)
    if(n <= 5) {
        pointSet.forEach(p => highlightPoint(p, '#2ecc71'));
        await sleep(delay);
        pointSet.forEach(p => unhighlightPoint(p));
        
        if (n < 3) return pointSet;

        // Simple brute-force or Graham-like approach for small sets
        let hull = [];
        let minIdx = 0;
        for (let i = 1; i < n; i++) {
            if (pointSet[i].y < pointSet[minIdx].y || (pointSet[i].y === pointSet[minIdx].y && pointSet[i].x < pointSet[minIdx].x)) {
                minIdx = i;
            }
        }
        
        let anchor = pointSet[minIdx];
        hull.push(anchor);

        let sorted = pointSet.filter((_, i) => i !== minIdx).sort((a, b) => {
            let angleA = Math.atan2(a.y - anchor.y, a.x - anchor.x);
            let angleB = Math.atan2(b.y - anchor.y, b.x - anchor.x);
            if (angleA < angleB) return -1;
            if (angleA > angleB) return 1;
            return 0;
        });

        for (let p of sorted) {
            while (hull.length > 1 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) {
                hull.pop();
            }
            hull.push(p);
        }
        return hull;
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