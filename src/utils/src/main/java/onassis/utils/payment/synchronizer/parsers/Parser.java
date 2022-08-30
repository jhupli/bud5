package onassis.utils.payment.synchronizer.parsers;

import lombok.SneakyThrows;
import org.apache.commons.collections.map.HashedMap;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Stream;


public class Parser {
   public enum Parsing{
        BEGIN("begin_rexp"),
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
    private final Map<Parsing, PartialParser> parsers = new HashMap<>();

    @SneakyThrows
    public Parser(InputStream inputStream) {
        PropertiesExt _properties = new PropertiesExt();
        _properties.load(inputStream);
        Parsing.stream().map( p -> parsers.put(p, new PartialParser(_properties.getStringArray(p.regexpName))) );
        if(null == parsers.get(Parsing.BEGIN)) {
            throw new IllegalArgumentException("Empty regexps!");
        }
        parsers.values().forEach(v -> {
            if (v.length() != parsers.get(Parsing.BEGIN).length()) {
                throw new IllegalArgumentException("All regexps must have same nubmer of indexes!");
            }}
        );
    }
}
