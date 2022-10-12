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
        DESCR("descr_rexp","Description", new PartialParser(), true),;


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
    private OnassisController.Updates<P> updates;
    private List<Integer> toLock = new ArrayList<>();


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
        if( !restIO.login() ) {
            throw new RuntimeException("Login failed.");
        }
    }

    Matchable m = new Matchable(restIO);
    List<Matchable> matchables = new ArrayList<>();
    {
        matchables.add(m);
    }

    private Matchable getLastMatchable() {
        return matchables.get(matchables.size() - 1);
    }

    private Set<Integer> blackList = new HashSet<>(); //of p-ids
    public void collect(String str) {

        if (null == str || parsers.get(Target.BEGIN).match(str)) {
            m = new Matchable(restIO);
            matchables.add(m);
            IOUtils.printOut(".");
        }
        if(null != str) {
            m.collect(str);
        }
    }

    public void prepare(){
        updates = new OnassisController.Updates();
        List<P> toCreate = new ArrayList<>();
        updates.setCreated(toCreate);
        for(Matchable m : matchables) {
            if(m.getState().equals(ALL_ATTRS_FOUND)) {
                m.pickMatch(blackList);
            }
            switch(m.getState()) {
                case CREATE:
                    P pToCreate = m.getReceipt().getP(restIO);
                    pToCreate.setC(m.getChosenCategory().getId().intValue());
                    pToCreate.setDescr(m.getDescription());
                    toCreate.add(pToCreate);
                    break;
                case MATCH_FOUND:
                    toLock.add(m.theChosenP.getId());
                    break;
                default:
            }
        }
        IOUtils.printOut("Fetching new groupid ...");
        String gId = restIO.newGroupId();
        IOUtils.printOut(" Done.\nNewly created will have group-id : '" + gId + "'");
        toCreate.stream().forEach(p -> {p.setG(gId);});
    }

    public void update(String baseFileName){
        if(!IOUtils.askYesNo()) {
            return;
        }
    }

    @Override
    public String toString() {
        return "Parser{" +
                "matchables=" + matchables +
                ",\nblackList=" + blackList +
                ",\nupdates=" + updates +
                '}';
    }
}
