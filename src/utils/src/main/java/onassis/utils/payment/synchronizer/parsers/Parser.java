package onassis.utils.payment.synchronizer.parsers;

import org.apache.commons.collections.map.HashedMap;

import java.util.*;
import java.util.stream.Stream;

public class Parser {
   public enum Parsing{
        BERGIN("begin_rexp"),
        DAY("day_rexp"),
        MONTH("month_rexp"),
        YEAR("year_rexp"),
        UNARY("unary_rexp"),
        WHOLE("whole_rexp"),
        DECIMAL("decimal_rexp");
       private String regexpName;

       Parsing(String regexpName) {
           this.regexpName = regexpName;
       }

       public static Stream<Parsing> stream() {
           return Stream.of(Parsing.values());
       }
    }

    public enum Skipping{
        SKIP("skip_rexp");
        private String regexpName;

        Skipping(String regexpName) {
            this.regexpName = regexpName;
        }

        public static Stream<Skipping> stream() {
            return Stream.of(Skipping.values());
        }

        
    }
    public final String SKIP="skip";
    private final Map<Parsing, PartialParser> parser = new HashMap<>();




}
