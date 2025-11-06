#include <stdio.h>
#include <string.h>

int main() {
    int n, i = 1;
    char current[1000] = "1", next[1000] = "";
    
    printf("Enter the position in look-and-say sequence: ");
    scanf("%d", &n);
    
    printf("Look-and-say sequence:\n");
    while (i <= n) {
        printf("Position %d: %s\n", i, current);
        
        // Generate next term
        strcpy(next, "");
        int count = 1;
        int j = 0;
        while (current[j] != '\0') {
            if (current[j] == current[j+1]) {
                count++;
            } else {
                char temp[10];
                sprintf(temp, "%d%c", count, current[j]);
                strcat(next, temp);
                count = 1;
            }
            j++;
        }
        
        strcpy(current, next);
        i++;
    }
    
    return 0;
}