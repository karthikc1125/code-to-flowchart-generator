function testIO() {
    let x = 5;
    
    // console.log statements
    console.log("Hello World");
    console.log("Value of x:", x);
    console.log(`x = ${x}, x * 2 = ${x * 2}`);
    
    // prompt
    let name = prompt("Enter your name:");
    
    // alert
    alert("Hello, " + name);
    
    return x;
}