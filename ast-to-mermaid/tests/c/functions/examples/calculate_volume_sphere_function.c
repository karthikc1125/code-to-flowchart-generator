#include <stdio.h>
#define PI 3.14159

float sphereVolume(float radius) {
    return (4.0/3.0) * PI * radius * radius * radius;
}

int main() {
    float radius = 5.0;
    float volume = sphereVolume(radius);
    printf("Volume of sphere with radius %.2f is %.2f\n", radius, volume);
    return 0;
}