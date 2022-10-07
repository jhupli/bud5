package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import lombok.SneakyThrows;
import onassis.OnassisController;
import onassis.dto.P;
import onassis.dto.PInfo;
import onassis.utils.paymentlocker.PaymentLocker;

import java.io.FileReader;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.lang.Runtime.getRuntime;
import static onassis.utils.payment.synchronizer.parsers.Matchable.State.*;


public class Parser {
   public enum Target{
        BEGIN("begin_rexp","", new PartialParser(), true),
        DAY("day_rexp","Day", new PartialParser00Num(), true),
        MONTH("month_rexp","Month", new PartialParser00Num(), true),
        YEAR("year_rexp","Year", new PartialParser(), true),
        WHOLE("whole_rexp","Whole", new PartialParserWhole(), true),
        DECIMAL("decim_rexp","Decimal", new PartialParserDecimal(), true),

        SKIP("skip_rexp","", new PartialParser(), false),
        UNARY("unary_rexp","Unary", new PartialParser(), false),
        DESCR("descr_rexp","Description", new PartialParser(), false),;


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
    private RestIO restIO;

    @SneakyThrows
    public Parser(String bank) {
        String propFileName = String.format("regexps/%s.properties", bank);
        PropertiesExt _properties = new PropertiesExt();
        _properties.load(new FileReader(propFileName));

        Target.stream().forEach( p -> parsers.put(p, p.partialParser.init(_properties.getStringArray(p.regexpName, p.mandatory))));

        if(null == parsers.get(Target.BEGIN)) {
            throw new IllegalArgumentException("Empty regexps!");
        }

        Thread shutdownThread = new Thread() {
            @Override
            public void run() {
                IOUtils.farewell();
            }
        };

        getRuntime().addShutdownHook(shutdownThread);

        restIO = new RestIO(bank);
        restIO.login();
    }

    Matchable m = new Matchable(restIO);
    List<Matchable> matchables = new ArrayList<>();
    {
        matchables.add(m);
    }

    private Matchable getLastMatchable() {
        return matchables.get(matchables.size() - 1);
    }

    private Set<PInfo> blackList = new HashSet<>(); //of p-ids
    public void collect(String str) {

        if (parsers.get(Target.BEGIN).match(str)) {
            if(getLastMatchable().getState().equals(ALL_ATTRS_FOUND)) {
                getLastMatchable().pickMatch(blackList);
            }
            List<String> lines = getLastMatchable().getReceipt().getLines()
                    .stream()
                    .map( line -> { return line.getLine(); } )
                    .collect(Collectors.toList());

            m = new Matchable(restIO);
            matchables.add(m);
        }
        m.collect(str);
    }

    public void prepare(){
        OnassisController.Updates<P> updates= new OnassisController.Updates();
        List<P> toCreate = new ArrayList<>();
        List<Integer> toLock = new ArrayList<>();
        for(Matchable m : matchables) {
            switch(m.getState()) {
                case CREATE:
                    toCreate.add(m.getReceipt().getP(restIO));
                    break;
                case MATCH_FOUND:
                    toLock.add(m.theChosenP.getId());
                    break;
                default:
            }

            //TODO: continue here dumppaa malli ulos, se on tässä kohden valmis
        }
    }

    @Override
    public String toString() {
        return "Parser{" +
                "matchables=" + matchables +
                "blackList=" + blackList +
                '}';
    }
}
