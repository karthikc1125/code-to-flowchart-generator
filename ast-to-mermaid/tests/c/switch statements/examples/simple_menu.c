#include <stdio.h>

int main() {
    int choice;
    
    printf("Simple Menu System\n");
    printf("1. File Operations\n2. Edit Operations\n3. View Options\n4. Help\n5. Exit\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("File Operations selected\n");
            printf("1. New\n2. Open\n3. Save\n4. Save As\n");
            break;
        case 2:
            printf("Edit Operations selected\n");
            printf("1. Cut\n2. Copy\n3. Paste\n4. Delete\n");
            break;
        case 3:
            printf("View Options selected\n");
            printf("1. Zoom In\n2. Zoom Out\n3. Full Screen\n4. Normal View\n");
            break;
        case 4:
            printf("Help selected\n");
            printf("Documentation and support information\n");
            break;
        case 5:
            printf("Exiting program...\n");
            break;
        default:
            printf("Invalid choice! Please select a valid option.\n");
    }
    
    return 0;
}