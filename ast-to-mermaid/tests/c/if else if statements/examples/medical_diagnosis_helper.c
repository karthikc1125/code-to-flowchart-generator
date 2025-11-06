#include <stdio.h>

int main() {
    float temperature, heartRate, bloodPressure;
    int symptoms;
    
    printf("Medical Diagnosis Helper\n");
    printf("Enter body temperature (°F): ");
    scanf("%f", &temperature);
    printf("Enter heart rate (bpm): ");
    scanf("%f", &heartRate);
    printf("Enter blood pressure (mmHg): ");
    scanf("%f", &bloodPressure);
    printf("Enter number of symptoms: ");
    scanf("%d", &symptoms);
    
    if (temperature < 90 || temperature > 110 || heartRate < 40 || heartRate > 200 || 
        bloodPressure < 80 || bloodPressure > 200 || symptoms < 0) {
        printf("Invalid input!\n");
    } else {
        printf("\n--- Health Assessment ---\n");
        
        if (temperature >= 104) {
            printf("Alert: High fever - Seek immediate medical attention\n");
        } else if (temperature >= 100) {
            printf("Note: Fever detected\n");
        } else if (temperature < 95) {
            printf("Alert: Hypothermia risk - Seek medical attention\n");
        }
        
        if (heartRate > 100) {
            printf("Note: Elevated heart rate\n");
        } else if (heartRate < 60) {
            printf("Note: Low heart rate\n");
        }
        
        if (bloodPressure > 140) {
            printf("Note: High blood pressure\n");
        } else if (bloodPressure < 90) {
            printf("Note: Low blood pressure\n");
        }
        
        if (symptoms >= 5) {
            printf("Recommendation: Consult a healthcare provider\n");
        } else if (symptoms >= 3) {
            printf("Recommendation: Monitor symptoms\n");
        } else {
            printf("Recommendation: Rest and hydration\n");
        }
    }
    
    return 0;
}