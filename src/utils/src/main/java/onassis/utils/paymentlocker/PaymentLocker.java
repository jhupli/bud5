//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package onassis.utils.paymentlocker;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.github.freva.asciitable.AsciiTable;
import com.github.freva.asciitable.Column;
import com.github.freva.asciitable.HorizontalAlign;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import lombok.SneakyThrows;
import onassis.OnassisController;
import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.PInfo;
import org.slf4j.LoggerFactory;

import static com.jayway.restassured.RestAssured.given;

public class PaymentLocker {
    List<String> paymentrows = new ArrayList();
    Extractor begin_extractor = null;
    Extractor day_extractor = null;
    Extractor month_extractor = null;
    Extractor year_extractor = null;
    Extractor whole_extractor = null;
    Extractor decim_extractor = null;

    Extractor unary_extractor = null;

    Pattern unary_pattern = null;
    Extractor skip_extractor = null;
    List<Integer> matchedIds = new ArrayList();
    boolean begin = false;
    boolean testmode = false;
    boolean simumode = false;
    boolean skip = false;
    String day = null;
    String month = null;
    String year = null;
    String whole = null;
    String decimal = null;
    String unary = null;
    String user = null;
    String host = null;
    String pw = null;
    String line = null;
    String account = null;
    BufferedWriter outwriter = null;
    int paymentscnt = 0;
    int matchedPaymentscnt = 0;

    long accountId = -1;

    List<C> categories = null;
    MyProperties props = new MyProperties();

    public PaymentLocker() {
    }

    public static void main(String[] args) {
        if (args.length < 2 || args.length > 3) {
            System.err.println("Usage: java -jar OnassisUtils.jar <properties-name> <file of account-statement> [TEST|SIMULATE]");
            (new PaymentLocker()).exit(2);
        }

        try {
            muteLoggers();
            (new PaymentLocker()).scan(args);
            System.exit(0);
        } catch (Exception var2) {
            var2.printStackTrace();
        }

        System.exit(2);
    }

    public static void muteLoggers() {
        Set<String> loggers = new HashSet(Arrays.asList("org.apache.http", "groovyx.net.http", "com.jayway.restassured.internal.RequestSpecificationImpl"));
        Iterator var1 = loggers.iterator();

        while(var1.hasNext()) {
            String log = (String)var1.next();
            Logger logger = (Logger)LoggerFactory.getLogger(log);
            logger.setLevel(Level.WARN);
            logger.setAdditive(false);
        }

    }
    @SneakyThrows
    void flushPayment() {
        try {
            boolean allThere = null != this.day && null != this.month && null != this.year && null != this.whole && null != this.decimal && null != this.user && null != this.host;
            if (allThere) {
                ++this.paymentscnt;
            }

            boolean match=false, created = false;
            if (allThere && !this.testmode) {
                String dateStr = String.format("%s-%s-%s", this.year, this.month, this.day);
                LocalDate date = LocalDate.parse(dateStr);
                long l = Long.valueOf((null == this.unary ? "" : this.unary) + this.whole + this.decimal);
                BigDecimal bd = BigDecimal.valueOf(l, 2);
                List<PInfo> pInfos = null;
                String url = String.format("http://%s/info?d=%s&i=%s&a=%s", this.host, dateStr, bd, this.account);
                String responseJson = ((Response)RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
                Gson gson = new Gson();
                pInfos = gson.fromJson(responseJson, new TypeToken<List<PInfo>>() {
                }.getType());
                Iterator var12;
                PInfo p;
                if (this.simumode) {
                    pInfos = (List)pInfos.stream().filter((px) -> {
                        return !this.matchedIds.contains(px.getId());
                    }).collect(Collectors.toList());
                    this.showRows();
                    if (!pInfos.isEmpty()) {
                        var12 = pInfos.iterator();

                        while(var12.hasNext()) {
                            p = (PInfo)var12.next();
                            this.showPInfo(p);
                        }
                    }

                    if (pInfos.size() > 1) {
                        System.out.println("(NOTE: there are multiple matches for this transaction)");
                    }

                    System.out.println("------------------------------------------------------------------------------------------------------");
                    System.out.println(url);
                    if (pInfos.size() > 0) {
                        match = true;
                        ++this.matchedPaymentscnt;
                        System.out.println("could be paired.");
                    } else {
                        System.out.println("would be skipped.");
                    }

                    System.out.println("------------------------------------------------------------------------------------------------------");
                    System.out.flush();
                    System.out.println();
                }

                if (!this.simumode && pInfos.size() > 1) {
                    System.out.println("(NOTE: there are multiple matches for this transaction)");
                } else {
                    //created = this.askCreate();
                }

                var12 = pInfos.iterator();

                while(var12.hasNext()) {
                    p = (PInfo)var12.next();
                    if (!this.simumode && (match = ask(p, "Match ?", "yYnN").equalsIgnoreCase("y"))) {
                        url = String.format("http://%s/lock?id=%s&l=true&d=%s", this.host, p.getId(), dateStr);
                        //responseJson = ((Response)RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
                        System.out.println("Updated.");
                        ++this.matchedPaymentscnt;
                        break;
                    }  /*else if(!(created=askCreate())) {
                    } */else{
                        if (!this.simumode) {
                            System.out.println("Skipped.");
                        }
                    }

                    if (this.simumode) {
                        this.matchedIds.add(p.getId());
                        break;
                    }
                }
            }

            Iterator var15 = this.paymentrows.iterator();

            while(var15.hasNext()) {
                String p = (String)var15.next();
                if(match) {
                    this.outwriter.write(String.format("%s%s\n", match ? "***" : "", p));

                } else if (created) {
                    this.outwriter.write(String.format("%s%s\n", created ? "*->" : "", p));

                }else{
                    this.outwriter.write(String.format("%s%s\n", match ? "" : "", p));

                }
                this.outwriter.flush();
            }

            if (allThere && this.testmode) {
                System.out.println("^^^^^^^^^^^this above would be queried^^^^^^^^^^^^^");
            }

            this.paymentrows.clear();
            this.skip = false;
            this.day = this.month = this.year = this.whole = this.decimal = null;
        } catch (Throwable var14) {
            throw var14;
        }
    }
    @SneakyThrows
    void exit(int i) {
        try {
            System.out.println(String.format("%s/%s %s updated.\nBye!", this.matchedPaymentscnt, this.paymentscnt, this.simumode ? "could be" : ""));
            if (null != this.outwriter) {
                this.outwriter.close();
            }

            System.exit(i);
        } catch (Throwable var3) {
            throw var3;
        }
    }

    boolean askCreate() {
        //this.showPInfo(np);

        if(!this.simumode && ( ask(null, "Create ?", "yYnN").equalsIgnoreCase("y"))) {
            OnassisController.Updates<P> update = new OnassisController.Updates<>();
            P np = new P();
            np.l = true;
            SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy", Locale.ENGLISH);
            Date dateIn = null;
            try {
                dateIn = formatter.parse(day + "." + month + "." + year);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }


            //testiä varten

            /****responseJson =
             given().auth().basic(user, pw).
             when().get(url)
             .asString();***/
            System.out.println("Created.");
            return true;
        }
        return false;
    }

    boolean isNewPayment() {
        return this.begin_extractor.matchesOnly(this.line);
    }

    boolean skip() {
        return this.skip_extractor.matchesOnly(this.line);
    }

    void day() {
        if (this.day_extractor.matches(this.line)) {
            this.day = this.day_extractor.getValue();
            this.day = String.format("%02d", Integer.parseInt(this.day));
        }

    }

    void month() {
        if (this.month_extractor.matches(this.line)) {
            this.month = this.month_extractor.getValue();
            this.month = String.format("%02d", Integer.parseInt(this.month));
        }

    }

    void year() {
        if (this.year_extractor.matches(this.line)) {
            this.year = this.year_extractor.getValue();
        }

    }

    void whole() {
        if (this.whole_extractor.matches(this.line)) {
            this.whole = this.whole_extractor.getValue().replaceAll("[^\\d-]", "");
        }

    }

    void decimal() {
        if (this.decim_extractor.matches(this.line)) {
            this.decimal = this.decim_extractor.getValue().replaceAll("[^\\d-]", "");
        }
    }

    void unary() {
        if (null == unary_extractor) return;
        if (this.unary_extractor.matches(this.line)) {
            this.unary = this.unary_extractor.getValue();
        }
    }

    void showRows() {
        System.out.println(AsciiTable.getTable(AsciiTable.BASIC_ASCII_NO_DATA_SEPARATORS, this.paymentrows, Arrays.asList((new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Bill entry").with((x) -> {
            return x.replaceAll("\t", " ");
        }))));
    }
    void showPInfo(PInfo pInfo) {
        if (pInfo != null) {
            //int candidateNr = true;
            new SimpleDateFormat("dd.MM.yyyy");
            String d = (new SimpleDateFormat("dd.MM.yyyy")).format(pInfo.getD());
            List<PInfo> list = new LinkedList();
            list.add(pInfo);
            System.out.println(AsciiTable.getTable(AsciiTable.BASIC_ASCII_NO_DATA_SEPARATORS, list, Arrays.asList((new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Date").with((x) -> {
                return (new SimpleDateFormat("dd.MM.yyyy")).format(x.getD());
            }), (new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Amount").with((x) -> {
                return x.getI().toString();
            }), (new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Account").with((x) -> {
                return x.getA_descr();
            }), (new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Category").with((x) -> {
                return x.getC_descr();
            }), (new Column()).headerAlign(HorizontalAlign.CENTER).dataAlign(HorizontalAlign.LEFT).header("Description").with((x) -> {
                return x.getDescr().replaceAll("\t", " ");
            }))));
        }
    }

    @SneakyThrows
    void loadProps(String bankName, String inpFileName) {
        try {
            String fileName = String.format("regexps/%s.properties", bankName);
            this.props.load(new FileReader(fileName));
            this.user = this.props.getString("user");
            this.host = this.props.getString("host");
            this.account = this.props.getString("account");
            this.begin_extractor = new Extractor(this.props.getStringArray("begin_rexp"));
            this.day_extractor = new Extractor(this.props.getStringArray("day_rexp"));
            this.month_extractor = new Extractor(this.props.getStringArray("month_rexp"));
            this.year_extractor = new Extractor(this.props.getStringArray("year_rexp"));
            this.whole_extractor = new Extractor(this.props.getStringArray("whole_rexp"));
            this.decim_extractor = new Extractor(this.props.getStringArray("decim_rexp"));
            this.unary_extractor = new Extractor(this.props.getStringArray("unary_rexp"));
            this.skip_extractor = new Extractor(this.props.getStringArray("skip_rexp", false));
            this.outwriter = new BufferedWriter(new FileWriter(inpFileName + ".onassis"));
            if (this.testmode) {
                Extractor.debugOn();
            }
            if (this.testmode) return;
            this.askPassword();
            String url = String.format("http://" + host + "/acc/list");
            String responseJson =
                    given().auth().basic(user, pw).when().get(url).asString();
            Gson gson = new Gson();
            List<A> accountList = gson.fromJson(responseJson, new TypeToken<List<A>>() {
            }.getType());

            A a = (A) accountList.stream().filter(x -> x.descr.equals(props.getProperty("account"))).findFirst().get();
            accountId = a.id;


            url = String.format("http://" + host + "/cat/list");
            responseJson =
                    given().auth().basic(user, pw).when().get(url).asString();
            categories = gson.fromJson(responseJson, new TypeToken<List<A>>() {
            }.getType());


        } catch (Throwable var4) {
            throw var4;
        }
    }
    @SneakyThrows
    void writeFile() {
        try {
            this.outwriter.write(this.line + "\n");
            this.outwriter.flush();
        } catch (Throwable var2) {
            throw var2;
        }
    }
    @SneakyThrows
    public void scan(String[] args) throws FileNotFoundException {
        try {
            this.testmode = args.length == 3 && args[2].equalsIgnoreCase("test");
            this.simumode = args.length == 3 && args[2].equalsIgnoreCase("simulate");
            if (!this.testmode && !this.simumode) {
                System.out.println("Warning: [INTERACTIVEMODE] - Updates would really take place!");
            } else {
                System.out.println(this.testmode ? "[TESTMODE]" : "[SIMULATION MODE]");
            }
            this.loadProps(args[0], args[1]);
            Scanner scan = new Scanner(new File(args[1]));

            while(true) {
                while(scan.hasNextLine()) {
                    this.line = scan.nextLine();
                    if (!this.line.startsWith("*") && !(this.skip = this.skip())) {
                        if (this.begin = this.isNewPayment()) {
                            this.flushPayment();
                        }

                        this.day();
                        this.month();
                        this.year();
                        this.whole();
                        this.decimal();
                        this.unary();
                        this.paymentrows.add(this.line);
                        if (this.testmode) {
                            System.out.println(this.line);
                            System.out.println(String.format("begin: %s| day: %s| month: %s| year:%s| whole: %s| decimal: %s| unary: %s", this.begin, this.day, this.month, this.year, this.whole, this.decimal, this.unary));
                        }
                    } else {
                        this.writeFile();
                        this.paymentrows.add(this.line);
                        if (this.testmode) {
                            System.out.println(this.line);
                            System.out.println(String.format("skip row."));
                        }
                    }
                }

                this.flushPayment();
                this.outwriter.close();
                this.exit(0);
                return;
            }
        } catch (Throwable var3) {
            throw var3;
        }
    }

    @SneakyThrows
    void askPassword() {
        if (this.testmode) return;
        pw = ask(null, "password? ", null);
        String resp =
                given().auth().basic(user,pw).
                        when().get("http://" + host + "/hello")
                        .body().asString();

        System.out.println(resp);
    }

    String ask(PInfo pInfo, String question, String answers) {
        String choice = null;
        if(null != pInfo) {
            this.showRows();
            this.showPInfo(pInfo);
        }
        while(choice == null || (null != answers && !(answers+"q").contains(choice))) {
            System.out.print(question + (answers!=null ? " [q"+answers+"] " : "") + " (or q to quit) ");
            Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
            choice = sc.nextLine();
        }
        switch (choice) {
            case "q" : System.exit(1);
            default: return choice;
        }
    }

    long pickCategory() {
        String choice = null;

        System.out.println("Categories_______________________________________________");
        for(int ix=0; ix<categories.size();  ix++) {
            C c= categories.get(ix);
            if(c.getActive()) {
                System.out.println(String.format("%04d", ix) + " | "+c.getDescr());
            }
        }
        System.out.println("_________________________________________________________");
        String regex = "[0-9]";

        while(null == choice
                || !choice.equalsIgnoreCase("p")
                || !choice.equalsIgnoreCase("q")
                || !choice.matches(regex))

        {
            System.out.print("Please pick a number (p to pass, q to quit) :");
            Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
            choice = sc.nextLine();
        }
        switch (choice) {
            case "q" : System.exit(1);
            case "p" : return -1;
            default: return categories.get(Integer.parseInt(choice)).getId();
        }
    }
}
