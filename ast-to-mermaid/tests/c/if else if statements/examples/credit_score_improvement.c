#include <stdio.h>

int main() {
    int creditScore, paymentHistory, creditUtilization, creditHistory, newCredit, creditMix;
    int improvementPoints = 0;
    
    printf("Credit Score Improvement Advisor\n");
    printf("Enter current credit score (300-850): ");
    scanf("%d", &creditScore);
    printf("Payment history (1-10 scale): ");
    scanf("%d", &paymentHistory);
    printf("Credit utilization (1-10 scale): ");
    scanf("%d", &creditUtilization);
    printf("Credit history length (1-10 scale): ");
    scanf("%d", &creditHistory);
    printf("New credit inquiries (1-10 scale): ");
    scanf("%d", &newCredit);
    printf("Credit mix (1-10 scale): ");
    scanf("%d", &creditMix);
    
    if (creditScore < 300 || creditScore > 850 || paymentHistory < 1 || paymentHistory > 10 ||
        creditUtilization < 1 || creditUtilization > 10 || creditHistory < 1 || creditHistory > 10 ||
        newCredit < 1 || newCredit > 10 || creditMix < 1 || creditMix > 10) {
        printf("Invalid input!\n");
    } else {
        printf("\n--- Credit Analysis ---\n");
        
        if (creditScore >= 750) {
            printf("Rating: Excellent\n");
        } else if (creditScore >= 700) {
            printf("Rating: Good\n");
        } else if (creditScore >= 650) {
            printf("Rating: Fair\n");
        } else if (creditScore >= 600) {
            printf("Rating: Poor\n");
        } else {
            printf("Rating: Very Poor\n");
        }
        
        // Improvement recommendations
        if (paymentHistory < 8) {
            printf("Recommendation: Improve payment history\n");
            improvementPoints += 30;
        }
        
        if (creditUtilization < 8) {
            printf("Recommendation: Reduce credit utilization\n");
            improvementPoints += 25;
        }
        
        if (creditHistory < 7) {
            printf("Recommendation: Maintain older accounts\n");
            improvementPoints += 15;
        }
        
        if (newCredit < 8) {
            printf("Recommendation: Limit new credit inquiries\n");
            improvementPoints += 10;
        }
        
        if (creditMix < 6) {
            printf("Recommendation: Diversify credit types\n");
            improvementPoints += 20;
        }
        
        printf("Potential improvement: %d points\n", improvementPoints);
    }
    
    return 0;
}