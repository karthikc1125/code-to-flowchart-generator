#include <stdio.h>

int main() {
    int score;
    
    printf("Enter your score (0-100): ");
    scanf("%d", &score);
    
    if (score >= 60) {
        printf("Congratulations! You passed the exam.\n");
    } else {
        printf("Sorry, you failed the exam. Better luck next time.\n");
    }
    
    return 0;
}