#include <stdio.h>

int main() {
    float stockPrice, purchasePrice, shares;
    float profit, percentChange;
    
    printf("Stock Portfolio Analyzer\n");
    printf("Enter current stock price: $");
    scanf("%f", &stockPrice);
    printf("Enter purchase price: $");
    scanf("%f", &purchasePrice);
    printf("Enter number of shares: ");
    scanf("%f", &shares);
    
    if (stockPrice < 0 || purchasePrice <= 0 || shares <= 0) {
        printf("Invalid input!\n");
    } else {
        profit = (stockPrice - purchasePrice) * shares;
        percentChange = ((stockPrice - purchasePrice) / purchasePrice) * 100;
        
        printf("\n--- Portfolio Analysis ---\n");
        printf("Current value: $%.2f\n", stockPrice * shares);
        printf("Profit/Loss: $%.2f\n", profit);
        printf("Percentage change: %.2f%%\n", percentChange);
        
        if (percentChange >= 20) {
            printf("Recommendation: Consider taking profits\n");
        } else if (percentChange >= 5) {
            printf("Recommendation: Hold position\n");
        } else if (percentChange >= -5) {
            printf("Recommendation: Hold position, minor fluctuation\n");
        } else if (percentChange >= -20) {
            printf("Recommendation: Consider averaging down\n");
        } else {
            printf("Recommendation: Re-evaluate investment thesis\n");
        }
    }
    
    return 0;
}