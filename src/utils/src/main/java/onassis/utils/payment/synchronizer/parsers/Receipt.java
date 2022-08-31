package onassis.utils.payment.synchronizer.parsers;

import java.util.ArrayList;
import java.util.List;

public class Receipt {

    /* represents one line*/
    public static class Line {

        static class DebugLine {
            Parser.Target target;
            String regexp;
            int regexp_index;


            String matcherLine;
            String value;
        }

        String line = null;
        List<DebugLine> matchingRegexps = null;
    }

    List<Line> lines = new ArrayList<>();

    public Receipt() {
    }
}
