#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int number, guess, attempts = 0;
    int range;
    
    srand(time(0));
    
    printf("Guessing Game\n");
    printf("1. Easy (1-10)\n2. Medium (1-50)\n3. Hard (1-100)\n");
    printf("Select difficulty level: ");
    scanf("%d", &range);
    
    switch (range) {
        case 1:
            number = rand() % 10 + 1;
            printf("Guess a number between 1 and 10\n");
            break;
        case 2:
            number = rand() % 50 + 1;
            printf("Guess a number between 1 and 50\n");
            break;
        case 3:
            number = rand() % 100 + 1;
            printf("Guess a number between 1 and 100\n");
            break;
        default:
            printf("Invalid choice! Setting to easy level.\n");
            number = rand() % 10 + 1;
            printf("Guess a number between 1 and 10\n");
    }
    
    do {
        printf("Enter your guess: ");
        scanf("%d", &guess);
        attempts++;
        
        if (guess < number) {
            printf("Too low! Try again.\n");
        } else if (guess > number) {
            printf("Too high! Try again.\n");
        } else {
            printf("Congratulations! You guessed the number in %d attempts.\n", attempts);
        }
    } while (guess != number);
    
    return 0;
}