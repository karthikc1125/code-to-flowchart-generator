// Test Java switch statement
public class SwitchTest {
    public static void main(String[] args) {
        int x = 2;

        switch (x) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other");
                break;
        }

        System.out.println("End of program");
    }
}