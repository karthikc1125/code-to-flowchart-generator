#include <iostream>
using namespace std;

int checkNumber(int num) {
    if(num > 0)
        return 1;   // positive
    else if(num < 0)
        return -1;  // negative
    else
        return 0;   // zero
}

int square(int x) {
    return x * x;
}

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;
    
    if (checkNumber(n) == 1)
        cout << "The number is positive." << endl;
    else if (checkNumber(n) == -1)
        cout << "The number is negative." << endl;
    else
        cout << "The number is zero." << endl;
        
    cout << "\nSquares of numbers from 1 to 5:" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "Square of " << i << " = " << square(i) << endl;
    }
    
    return 0;
}