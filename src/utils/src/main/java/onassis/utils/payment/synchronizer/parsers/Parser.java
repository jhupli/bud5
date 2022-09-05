package onassis.utils.payment.synchronizer.parsers;

import lombok.SneakyThrows;
import org.apache.commons.collections.map.HashedMap;

import java.io.InputStream;
import java.lang.reflect.Array;
import java.util.*;
import java.util.stream.Stream;


public class Parser {
   public enum Target{
        BEGIN("decimal_rexp","Decimal", new PartialParser()),
        DAY("day_rexp","Day", new PartialParser()),
        MONTH("month_rexp","Month", new PartialParser()),
        YEAR("year_rexp","Year", new PartialParser()),
        UNARY("unary_rexp","Unary", new PartialParser()),
        WHOLE("whole_rexp","Whole", new PartialParser()),
        DECIMAL("decimal_rexp","Decimal", new PartialParser()),
        SKIP("skip_rexp","", new PartialParser());

        private String regexpName;
        private String name;
        private PartialParser partialParser;

       Target(String regexpName, String name, PartialParser partialParser) {
           this.regexpName = regexpName;
           this.name = name;
           this.partialParser = partialParser;
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

        Target.stream().forEach( p -> parsers.put(p, p.partialParser.init(_properties.getStringArray(p.regexpName))));
        if(null == parsers.get(Target.BEGIN)) {
            throw new IllegalArgumentException("Empty regexps!");
        }
        parsers.values().forEach(v -> {
            if (v.length() != parsers.get(Target.BEGIN).length()) {
                throw new IllegalArgumentException("All regexps must have same number of indexes!");
            }}
        );
    }

    Matchable m = new Matchable();
    List<Matchable> matchables = new ArrayList<>();
    {
        matchables.add(m);
    }

    public void collect(String str) {

        if(parsers.get(Target.BEGIN).match(str)) {
            matchables.add(m);
            m = new Matchable();
        }
//tämä ainakin siirretään Receittin
        for(int i=0; i<Target.BEGIN.partialParser.length(); i++) {

            for(Target target : Target.values()) {
                if(null != target.partialParser.match(i, str)) {
                    //pistetään hasttableen arvo;
                }
            }
        }
    }

}
