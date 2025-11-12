# How to Use Test Points File

## Quick Start

1. **Edit `test_points.txt`**

   - Add your coordinates in `x, y` format (one point per line)
   - Lines starting with `#` are comments (ignored)
   - Origin (0,0) is at the **bottom-left** corner
   - Valid range: x: 0-880, y: 0-520

2. **Load the points** (choose one method):

   **Method A: Auto-load on page load**

   - Open `TestData.js`
   - Change `USE_TEST_FILE = false` to `USE_TEST_FILE = true`
   - Save and reload the page

   **Method B: Manual load via console**

   - Open the visualizer in browser
   - Press `F12` to open Developer Tools
   - Go to Console tab
   - Type: `loadTestFile()`
   - Press Enter

## Example test_points.txt

```
# Simple triangle test case
100, 100
400, 100
250, 400

# Add more points below:
150, 200
350, 350
```

## Tips

- **Comment out examples**: Add `#` at the start of lines you don't want to use
- **Multiple test sets**: Keep different test cases as commented sections, uncomment the one you want to test
- **Quick testing**: Use browser console method for quick iterations without editing TestData.js
- **Coordinate system**: Remember (0,0) is bottom-left, y increases upward (standard math coordinates)

## Export Current Points

If you create points manually in the visualizer and want to save them:

1. Open browser console (F12)
2. Type: `exportCurrentPoints()`
3. Copy the output coordinates
4. Paste into `test_points.txt`
