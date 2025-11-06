#include <stdio.h>

int main() {
    int currentWeight, goalWeight, weeks;
    int weightLossPerWeek;
    
    printf("Fitness Goal Tracker\n");
    printf("Enter current weight (lbs): ");
    scanf("%d", &currentWeight);
    printf("Enter goal weight (lbs): ");
    scanf("%d", &goalWeight);
    printf("Enter desired time frame (weeks): ");
    scanf("%d", &weeks);
    
    if (currentWeight <= 0 || goalWeight <= 0 || weeks <= 0) {
        printf("Invalid input!\n");
    } else {
        int totalWeightLoss = currentWeight - goalWeight;
        
        if (totalWeightLoss < 0) {
            printf("Goal: Weight gain of %d pounds\n", -totalWeightLoss);
        } else if (totalWeightLoss == 0) {
            printf("Current weight matches goal weight!\n");
        } else {
            printf("Goal: Weight loss of %d pounds\n", totalWeightLoss);
            weightLossPerWeek = totalWeightLoss / weeks;
            
            if (weightLossPerWeek > 4) {
                printf("Warning: %d lbs/week is aggressive. Consider extending timeline.\n", weightLossPerWeek);
            } else if (weightLossPerWeek > 2) {
                printf("Recommendation: %d lbs/week is moderate. Stay consistent.\n", weightLossPerWeek);
            } else if (weightLossPerWeek > 1) {
                printf("Recommendation: %d lbs/week is conservative. Good for long-term success.\n", weightLossPerWeek);
            } else {
                printf("Recommendation: %d lbs/week is very gradual. Consider increasing activity.\n", weightLossPerWeek);
            }
        }
    }
    
    return 0;
}