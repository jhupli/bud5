package onassis.utils.payment.synchronizer.parsers;

import java.util.ArrayList;
import java.util.List;

public class Receipt {
    public static class Line {
        String line;
        List<DebugLine> matches = new ArrayList<>();
        static class DebugLine {
            String regexp;
            int regexp_index;
            String matcherLine;
            String value;
        }
        List<Line> lines = new ArrayList<>();



    }
}
