#include <stdio.h>

int main() {
    int foodChoice;
    int quantity;
    
    printf("Calorie Counter:\n");
    printf("1. Apple (95 calories each)\n");
    printf("2. Banana (105 calories each)\n");
    printf("3. Orange (62 calories each)\n");
    printf("4. Bread slice (70 calories each)\n");
    printf("Enter food choice (1-4): ");
    scanf("%d", &foodChoice);
    
    printf("Enter quantity: ");
    scanf("%d", &quantity);
    
    switch (foodChoice) {
        case 1:
            printf("Total calories: %d\n", 95 * quantity);
            break;
        case 2:
            printf("Total calories: %d\n", 105 * quantity);
            break;
        case 3:
            printf("Total calories: %d\n", 62 * quantity);
            break;
        case 4:
            printf("Total calories: %d\n", 70 * quantity);
            break;
        default:
            printf("Invalid food choice.\n");
    }
    
    return 0;
}