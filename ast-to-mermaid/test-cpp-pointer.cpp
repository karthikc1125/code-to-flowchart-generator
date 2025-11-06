#include <iostream>

int main() {
    int x = 5;           // Regular variable with initialization
    int y;               // Regular variable without initialization
    int *ptr;            // Pointer declaration without initialization
    int *ptr2 = &x;      // Pointer declaration with initialization
    char ch = 'a';       // Char variable with initialization
    char *str;           // Char pointer without initialization
    
    std::cout << "Testing pointer declarations" << std::endl;
    
    return 0;
}