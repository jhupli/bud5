package onassis.utils.payment.synchronizer.parsers;

import java.util.*;

import static onassis.utils.payment.synchronizer.parsers.Parser.Target;

public class Line {

    static class Meta {
        Target target;
        String regexp;
        int regexp_index;
        String value;

        public Meta(Target target, String regexp, int regexp_index, String value) {
            this.target = target;
            this.regexp = regexp;
            this.regexp_index = regexp_index;
            this.value = value;
        }

        @Override
        public String toString() {
            return "\n\t\t\t\tMeta{" +
                    "\n\t\t\t\ttarget=" + target +
                    "\n\t\t\t\tregexp='" + regexp + '\'' +
                    "\n\t\t\t\tregexp_index=" + regexp_index +
                    "\n\t\t\t\tvalue='" + value + '\'' +
                    "\n\t\t\t\t}";
        }
    }

    String line = null;
    List<Meta> meta = new ArrayList<>();

    void collect(int i, String str, Map<Target, String> collectedValues) {
        for(Target target : Target.values()) {
            if(collectedValues.containsKey(target)) {
                continue;
            }

            if(i >= target.partialParser.length()) return;
            String value = target.partialParser.match(i, str);
            if(null != value) {
                meta.add(new Meta(target, target.partialParser.rexps.get(i), i, null == value ? "" : value));
                collectedValues.put(target, value);
            }
        }
    };

    public Line(String line) {
        this.line = line;
    }

    @Override
    public String toString() {
        return "\n\t\t\tLine{" +
                "\n\t\t\tline='" + line + "\'," +
                "\n\t\t\tmeta=" + meta +
                '}';
    }
}
