#include <stdio.h>

int main() {
    float rating;
    
    printf("Enter employee performance rating (1.0-5.0): ");
    scanf("%f", &rating);
    
    if (rating < 1.0 || rating > 5.0) {
        printf("Invalid rating!\n");
    } else if (rating >= 4.5) {
        printf("Performance: Outstanding\n");
        printf("Bonus: 15%% of salary\n");
    } else if (rating >= 4.0) {
        printf("Performance: Excellent\n");
        printf("Bonus: 10%% of salary\n");
    } else if (rating >= 3.5) {
        printf("Performance: Good\n");
        printf("Bonus: 5%% of salary\n");
    } else if (rating >= 3.0) {
        printf("Performance: Satisfactory\n");
        printf("Bonus: 2%% of salary\n");
    } else if (rating >= 2.0) {
        printf("Performance: Needs Improvement\n");
        printf("No bonus\n");
    } else {
        printf("Performance: Poor\n");
        printf("Warning issued\n");
    }
    
    return 0;
}