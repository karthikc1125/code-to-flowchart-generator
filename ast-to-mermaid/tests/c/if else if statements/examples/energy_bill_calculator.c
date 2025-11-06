#include <stdio.h>

int main() {
    float electricity, gas, water;
    float elecBill, gasBill, waterBill, totalBill;
    
    printf("Monthly Utility Bill Calculator\n");
    printf("Enter electricity usage (kWh): ");
    scanf("%f", &electricity);
    printf("Enter gas usage (therms): ");
    scanf("%f", &gas);
    printf("Enter water usage (gallons): ");
    scanf("%f", &water);
    
    if (electricity < 0 || gas < 0 || water < 0) {
        printf("Invalid input!\n");
    } else {
        // Electricity billing
        if (electricity <= 500) {
            elecBill = electricity * 0.10;
        } else if (electricity <= 1000) {
            elecBill = 500 * 0.10 + (electricity - 500) * 0.15;
        } else {
            elecBill = 500 * 0.10 + 500 * 0.15 + (electricity - 1000) * 0.20;
        }
        
        // Gas billing
        if (gas <= 50) {
            gasBill = gas * 0.50;
        } else if (gas <= 100) {
            gasBill = 50 * 0.50 + (gas - 50) * 0.75;
        } else {
            gasBill = 50 * 0.50 + 50 * 0.75 + (gas - 100) * 1.00;
        }
        
        // Water billing
        if (water <= 2000) {
            waterBill = water * 0.01;
        } else if (water <= 5000) {
            waterBill = 2000 * 0.01 + (water - 2000) * 0.015;
        } else {
            waterBill = 2000 * 0.01 + 3000 * 0.015 + (water - 5000) * 0.02;
        }
        
        totalBill = elecBill + gasBill + waterBill;
        
        printf("\n--- Monthly Utility Bills ---\n");
        printf("Electricity: $%.2f\n", elecBill);
        printf("Gas: $%.2f\n", gasBill);
        printf("Water: $%.2f\n", waterBill);
        printf("Total: $%.2f\n", totalBill);
    }
    
    return 0;
}