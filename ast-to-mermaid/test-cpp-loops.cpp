#include <iostream>
using namespace std;

int main() {
    int i = 0;
    
    // While loop
    while (i < 3) {
        cout << "While loop: " << i << endl;
        i++;
    }
    
    // Do-while loop
    int j = 0;
    do {
        cout << "Do-while loop: " << j << endl;
        j++;
    } while (j < 2);
    
    // For loop
    for (int k = 0; k < 2; k++) {
        cout << "For loop: " << k << endl;
    }
    
    cout << "End" << endl;
    return 0;
}