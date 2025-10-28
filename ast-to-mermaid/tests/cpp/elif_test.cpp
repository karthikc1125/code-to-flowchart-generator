// Test C++ if/else if/else statements
#include <iostream>
using namespace std;

int main() {
    int x = 10;

    if (x > 0) {
        cout << "Positive number";
    } else if (x < 0) {
        cout << "Negative number";
    } else {
        cout << "Zero";
    }

    return 0;
}