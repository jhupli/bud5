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
    }

    String line = null;
    List<Meta> meta = new ArrayList<>();

    void collect(int i, String str, Map<Target, String> collectedValues) {
        for(Target target : Target.values()) {
            String value = target.partialParser.match(i, str);
            meta.add(new Meta(target, target.partialParser.rexps.get(i),i,value));
            if(collectedValues.containsKey(target)) {
                throw new RuntimeException("line: " + line + "\nmatches more than one once ("+i+","+target.name+ ")" );
            }
            collectedValues.put(target, value);
        }
    };

    public Line(String line) {
        this.line = line;
    }
}
