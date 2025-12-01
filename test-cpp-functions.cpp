#include <iostream>
using namespace std;

int calculateSquare(int num) {
    return num * num;
}

int main() {
    int number;
    int result;
    
    // IO operations with correct shapes
    cout << "Enter a number: ";
    cin >> number;
    
    // Function call in assignment
    result = calculateSquare(number);
    
    // Conditional with function call
    if (result > 100) {
        cout << "The square is greater than 100" << endl;
    } else {
        cout << "The square is 100 or less" << endl;
    }
    
    // Loop with function call
    for (int i = 1; i <= 3; i++) {
        cout << "Square of " << i << " is " << calculateSquare(i) << endl;
    }
    
    return 0;
}