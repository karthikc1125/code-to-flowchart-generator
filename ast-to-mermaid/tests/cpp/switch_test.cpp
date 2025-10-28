// Test C++ switch statement
#include <iostream>
using namespace std;

int main() {
    int x = 2;

    switch (x) {
        case 1:
            cout << "One";
            break;
        case 2:
            cout << "Two";
            break;
        default:
            cout << "Other";
    }

    cout << "End of program";
    return 0;
}