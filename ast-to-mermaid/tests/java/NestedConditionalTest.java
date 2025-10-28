public class NestedConditionalTest {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;
        
        if (x > 0) {
            if (y > 5) {
                System.out.println("Both positive");
            } else {
                System.out.println("X positive, Y not greater than 5");
            }
        } else if (x == 0) {
            System.out.println("X is zero");
        } else {
            System.out.println("X is negative");
        }
        
        System.out.println("End of program");
    }
}