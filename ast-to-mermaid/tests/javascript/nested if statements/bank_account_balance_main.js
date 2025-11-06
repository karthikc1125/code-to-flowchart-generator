let balance = 1000.0;
let choice = parseInt(prompt("1. Deposit\n2. Withdraw\nEnter your choice: "));

if (choice === 1) {
    let amount = parseFloat(prompt("Enter amount to deposit: $"));
    if (amount > 0) {
        balance += amount;
        console.log("Deposit successful!");
    } else {
        console.log("Invalid amount!");
    }
} else if (choice === 2) {
    let amount = parseFloat(prompt("Enter amount to withdraw: $"));
    if (amount > 0 && amount <= balance) {
        balance -= amount;
        console.log("Withdrawal successful!");
    } else if (amount > balance) {
        console.log("Insufficient funds!");
    } else {
        console.log("Invalid amount!");
    }
} else {
    console.log("Invalid choice!");
}

console.log("New balance: $" + balance.toFixed(2));

return 0;