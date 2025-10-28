public class NestedLoopTest {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            System.out.println("Outer loop: " + i);
            for (int j = 0; j < 2; j++) {
                System.out.println("Inner loop: " + j);
            }
            System.out.println("End of outer loop iteration");
        }
        System.out.println("All loops finished");
    }
}