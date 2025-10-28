import java.util.Scanner;

public class AssignmentTest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int number = 0;  // This is an assignment
        System.out.print("Enter a number: ");
        number = scanner.nextInt();
        System.out.println("You entered: " + number);
        scanner.close();
    }
}