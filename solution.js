const fs = require("fs");

const testCases = ["input1.json", "input2.json"];

testCases.forEach((file, index) => {
    console.log(`\nProcessing Test Case ${index + 1}...`);

    if (!fs.existsSync(file)) {
        console.error(`Error: ${file} not found.`);
        return;
    }

    try {
        // Read and parse JSON file
        const data = JSON.parse(fs.readFileSync(file, "utf-8"));

        if (!data.keys || typeof data.keys.n === "undefined" || typeof data.keys.k === "undefined") {
            console.error(`Error: Invalid JSON format in ${file}`);
            return;
        }

        // Extract values
        const { n, k } = data.keys;
        let points = [];

        console.log("n:", n, "k:", k);

        for (let key in data) {
            if (key !== "keys") {
                let x = parseInt(key);
                let base = parseInt(data[key].base);
                let y = parseInt(data[key].value, base); // Convert based on given base
                points.push([x, y]);
            }
        }

        console.log("Extracted Points:", points);

        // Sort points by x to ensure correct interpolation order
        points.sort((a, b) => a[0] - b[0]);

        // Take the first k points (ensure k does not exceed available points)
        const selectedPoints = points.slice(0, Math.min(k, points.length));

        console.log(`Using first ${selectedPoints.length} points for interpolation:`, selectedPoints);

        if (selectedPoints.length < 2) {
            console.error("Error: Not enough points for interpolation.");
            return;
        }

        // Solve for c using Lagrange Interpolation
        let c = lagrangeInterpolation(selectedPoints, 0);

        console.log("Secret constant c:", c);

    } catch (error) {
        console.error(`Error reading or parsing ${file}:`, error.message);
    }
});

// Lagrange Interpolation Function
function lagrangeInterpolation(points, x0) {
    let result = 0;
    let k = points.length;

    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];

        let term = yi;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j][0];
                term *= (x0 - xj) / (xi - xj);
            }
        }
        result += term;
    }

    return Math.round(result);
}

