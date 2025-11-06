#include <stdio.h>

float cubeVolume(float side) {
    return side * side * side;
}

int main() {
    float side = 5.0;
    float volume = cubeVolume(side);
    printf("Volume of cube with side %.2f is %.2f\n", side, volume);
    return 0;
}