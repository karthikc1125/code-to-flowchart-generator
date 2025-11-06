#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int choice, computer, result;
    
    srand(time(0));
    computer = rand() % 3 + 1; // 1=Rock, 2=Paper, 3=Scissors
    
    printf("Rock Paper Scissors Game\n");
    printf("1. Rock\n2. Paper\n3. Scissors\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    
    if (choice < 1 || choice > 3) {
        printf("Invalid choice!\n");
        return 0;
    }
    
    printf("Computer chose: ");
    switch (computer) {
        case 1:
            printf("Rock\n");
            break;
        case 2:
            printf("Paper\n");
            break;
        case 3:
            printf("Scissors\n");
            break;
    }
    
    // Determine winner
    if (choice == computer) {
        result = 0; // Tie
    } else if ((choice == 1 && computer == 3) || 
               (choice == 2 && computer == 1) || 
               (choice == 3 && computer == 2)) {
        result = 1; // Win
    } else {
        result = 2; // Lose
    }
    
    switch (result) {
        case 0:
            printf("It's a tie!\n");
            break;
        case 1:
            printf("You win!\n");
            break;
        case 2:
            printf("You lose!\n");
            break;
    }
    
    return 0;
}