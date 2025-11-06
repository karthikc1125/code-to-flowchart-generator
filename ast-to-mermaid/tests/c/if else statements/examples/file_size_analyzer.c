#include <stdio.h>

int main() {
    long long fileSize;
    
    printf("File Size Analyzer\n");
    printf("Enter file size in bytes: ");
    scanf("%lld", &fileSize);
    
    if (fileSize < 0) {
        printf("Invalid file size!\n");
    } else if (fileSize < 1024) {
        printf("File size: %lld bytes\n", fileSize);
        printf("Category: Very small file\n");
    } else if (fileSize < 1024 * 1024) {
        printf("File size: %.2f KB\n", (float)fileSize / 1024);
        printf("Category: Small file\n");
    } else if (fileSize < 1024 * 1024 * 1024) {
        printf("File size: %.2f MB\n", (float)fileSize / (1024 * 1024));
        printf("Category: Medium file\n");
    } else if (fileSize < (long long)1024 * 1024 * 1024 * 1024) {
        printf("File size: %.2f GB\n", (float)fileSize / (1024 * 1024 * 1024));
        printf("Category: Large file\n");
    } else {
        printf("File size: %.2f TB\n", (float)fileSize / (1024 * 1024 * 1024 * 1024));
        printf("Category: Very large file\n");
    }
    
    return 0;
}