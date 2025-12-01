// Comprehensive JavaScript Loops Example
// This example demonstrates all three loop types with IO statements in their bodies

// For loop with IO statements
console.log("Starting for loop example:");
for (let i = 0; i < 3; i++) {
    console.log("For loop iteration: " + i);
    // Nested operation inside for loop
    if (i === 1) {
        console.log("  Middle iteration reached");
    }
}
console.log("For loop completed.\n");

// While loop with IO statements
console.log("Starting while loop example:");
let j = 0;
while (j < 2) {
    console.log("While loop iteration: " + j);
    // Increment inside while loop
    j++;
    console.log("  Incremented j to: " + j);
}
console.log("While loop completed.\n");

// Do-while loop with IO statements
console.log("Starting do-while loop example:");
let k = 0;
do {
    console.log("Do-while loop iteration: " + k);
    // Increment inside do-while loop
    k++;
    console.log("  Incremented k to: " + k);
} while (k < 2);
console.log("Do-while loop completed.\n");

// Final summary
console.log("All loop examples completed successfully!");