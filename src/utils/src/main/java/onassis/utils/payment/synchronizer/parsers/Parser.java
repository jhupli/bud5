package onassis.utils.payment.synchronizer.parsers;

import lombok.SneakyThrows;
import onassis.utils.paymentlocker.PaymentLocker;

import java.io.FileReader;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Stream;


public class Parser {
   public enum Target{
        BEGIN("begin_rexp","", new PartialParser(), true),
        DAY("day_rexp","Day", new PartialParser(), true),
        MONTH("month_rexp","Month", new PartialParser(), true),
        YEAR("year_rexp","Year", new PartialParser(), true),
        WHOLE("whole_rexp","Whole", new PartialParser(), true),
        DECIMAL("decim_rexp","Decimal", new PartialParser(), true),

        SKIP("skip_rexp","", new PartialParser(), false),
        UNARY("unary_rexp","Unary", new PartialParser(), false),;

        public String regexpName;
        public String name;
        public PartialParser partialParser;
        public boolean mandatory;

       Target(String regexpName, String name, PartialParser partialParser, boolean mandatory) {
           this.regexpName = regexpName;
           this.name = name;
           this.partialParser = partialParser;
           this.mandatory = mandatory;
       }
       public static int nrOfMandatories() {
               return 6; //TODO
       }
       public static Stream<Target> stream() {
           return Stream.of(Target.values());
       }
    }

    public static final PartialParserMap parsers = new PartialParserMap();


    @SneakyThrows
    public Parser(String propertiesFileName) {
        PropertiesExt _properties = new PropertiesExt();
        _properties.load(new FileReader(propertiesFileName));

        Target.stream().forEach( p -> parsers.put(p, p.partialParser.init(_properties.getStringArray(p.regexpName, p.mandatory))));

        if(null == parsers.get(Target.BEGIN)) {
            throw new IllegalArgumentException("Empty regexps!");
        }

        /*parsers.values().forEach(v -> {
            if (v.length() != parsers.get(Target.BEGIN).length()) {
                throw new IllegalArgumentException("All regexps must have same number of indexrows!");
            }}
        );*/
    }

    Matchable m = new Matchable();
    List<Matchable> matchables = new ArrayList<>();
    {
        matchables.add(m);
    }

    public void collect(String str) {

        if (parsers.get(Target.BEGIN).match(str)) {
            m = new Matchable();
            matchables.add(m);
        }
        m.collect(str);
    }

    @Override
    public String toString() {
        return "Parser{" +
                "matchables=" + matchables +
                '}';
    }
}
