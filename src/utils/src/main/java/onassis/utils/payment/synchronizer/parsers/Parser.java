package onassis.utils.payment.synchronizer.parsers;

import lombok.SneakyThrows;
import org.apache.commons.collections.map.HashedMap;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Stream;


public class Parser {
   public enum Target{
        BEGIN("decimal_rexp","Decimal", PartialParser.class),
        DAY("day_rexp","Day", PartialParser.class),
        MONTH("month_rexp","Month", PartialParser.class),
        YEAR("year_rexp","Year", PartialParser.class),
        UNARY("unary_rexp","Unary", PartialParser.class),
        WHOLE("whole_rexp","Whole", PartialParser.class),
        DECIMAL("decimal_rexp","Decimal", PartialParser.class),
        SKIP("decimal_rexp","Decimal", PartialParser.class);

        private String regexpName;
        private String name;
        private Class instance;

       Target(String regexpName, String name, Class instance) {
           this.regexpName = regexpName;
           this.name = name;
           this.instance = instance;
       }

       public static Stream<Target> stream() {
           return Stream.of(Target.values());
       }
    }

    public final String SKIP="skip";
    private final Map<Target, PartialParser> parsers = new HashMap<>();

    @SneakyThrows
    public Parser(InputStream inputStream) {
        PropertiesExt _properties = new PropertiesExt();
        _properties.load(inputStream);
        Target.stream().map( p -> parsers.put(p, new PartialParser(_properties.getStringArray(p.regexpName))) );
        if(null == parsers.get(Target.BEGIN)) {
            throw new IllegalArgumentException("Empty regexps!");
        }
        parsers.values().forEach(v -> {
            if (v.length() != parsers.get(Target.BEGIN).length()) {
                throw new IllegalArgumentException("All regexps must have same number of indexes!");
            }}
        );
    }
}
