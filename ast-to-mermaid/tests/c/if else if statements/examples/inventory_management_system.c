#include <stdio.h>

int main() {
    int currentStock, minStock, maxStock, orderQuantity;
    
    printf("Inventory Management System\n");
    printf("Enter current stock level: ");
    scanf("%d", &currentStock);
    printf("Enter minimum stock level: ");
    scanf("%d", &minStock);
    printf("Enter maximum stock level: ");
    scanf("%d", &maxStock);
    
    if (currentStock < 0 || minStock < 0 || maxStock < 0 || minStock >= maxStock) {
        printf("Invalid input!\n");
    } else {
        printf("\n--- Inventory Status ---\n");
        
        if (currentStock <= minStock) {
            printf("Status: CRITICAL - Stock level very low\n");
            orderQuantity = maxStock - currentStock;
            printf("Action: Order %d units immediately\n", orderQuantity);
        } else if (currentStock <= minStock * 1.5) {
            printf("Status: LOW - Stock level low\n");
            orderQuantity = (maxStock - currentStock) / 2;
            printf("Action: Order %d units soon\n", orderQuantity);
        } else if (currentStock >= maxStock * 0.8) {
            printf("Status: HIGH - Stock level high\n");
            printf("Action: Consider reducing orders\n");
        } else {
            printf("Status: OPTIMAL - Stock level good\n");
            printf("Action: Maintain current ordering pattern\n");
        }
    }
    
    return 0;
}