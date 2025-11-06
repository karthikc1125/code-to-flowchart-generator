#include <stdio.h>
#include <string.h>

int main() {
    int n;
    char current[1000] = "1", next[1000] = "";
    
    printf("Enter the position in look-and-say sequence: ");
    scanf("%d", &n);
    
    printf("Look-and-say sequence:\n");
    for (int i = 1; i <= n; i++) {
        printf("Position %d: %s\n", i, current);
        
        // Generate next term
        strcpy(next, "");
        int count = 1;
        int j = 0;
        for (; current[j] != '\0'; j++) {
            if (current[j] == current[j+1]) {
                count++;
            } else {
                char temp[10];
                sprintf(temp, "%d%c", count, current[j]);
                strcat(next, temp);
                count = 1;
            }
        }
        
        strcpy(current, next);
    }
    
    return 0;
}