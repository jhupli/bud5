package onassis.utils.payment.synchronizer.parsers;

import java.util.ArrayList;
import java.util.List;
import static onassis.utils.payment.synchronizer.parsers.Parser.Target;
import static onassis.utils.payment.synchronizer.parsers.Parser.Target.*;

public class Receipt {

    /* represents one line*/
    public static class Line {

        static class Debug {
            Target target;
            String regexp;
            int regexp_index;

            String matcherLine;
            String value;
        }

        String line = null;
        List<Debug> matchingRegexps = null;

    }

    List<Line> lines = new ArrayList<>();

    public Receipt() {
    }

    public void collect(Target target, String str) {


    }
}
