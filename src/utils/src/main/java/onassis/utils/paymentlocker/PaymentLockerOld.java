package onassis.utils.paymentlocker;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.SneakyThrows;

import java.io.*;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.PInfo;
import onassis.OnassisController.Updates;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import static com.jayway.restassured.RestAssured.given;

public class PaymentLockerOld {
    List<String> paymentrows = new ArrayList();

    Pattern begin_pattern = null;
    Pattern day_pattern = null;
    Pattern month_pattern = null;

    Pattern year_pattern = null;
    Pattern whole_pattern = null;
    Pattern decim_pattern = null;
    Pattern unary_pattern = null;


    boolean begin = false;
    String day, month, year, whole, decimal, unary, user, host, pw = null;
    long accountId = -1;
    List<C> categories = null;


    public static void muteLoggers() {
        Set<String> loggers = new HashSet<>(Arrays.asList("org.apache.http", "groovyx.net.http", "com.jayway.restassured.internal.RequestSpecificationImpl"));

        for(String log:loggers) {
            Logger logger = (Logger) LoggerFactory.getLogger(log);
            logger.setLevel(Level.WARN);
            logger.setAdditive(false);
        }
    }

    public static void main(String args[]) {
        if(args.length != 2) {
            System.err.println("Usage: java -jar OnassisUtils.jar <properties-name> <file of account-statement>");
            System.exit(1);
        }
        try {
            muteLoggers();
            (new PaymentLockerOld()).scan(args);
            System.exit(0);
        }catch (Exception e){
            e.printStackTrace();
        }
        System.exit(2);
    }



    void flushPayment() {
        boolean match = false;
        List<PInfo> pInfos = null;

        if(null != day && null != month && null != year && null != whole && null != decimal && null != user && null != host) {
            String dateStr = year + "-" + month + "-" + day;
            LocalDate date = LocalDate.parse(dateStr);
            long l = Long.valueOf((unary != null ? unary : "") + whole + decimal);
            BigDecimal bd = BigDecimal.valueOf(l, 2);

            String url = String.format("http://" + host + "/info?d=%s&i=%s", dateStr, bd);
            String responseJson =
                    given().auth().basic(user, pw).
                            when().get(url)
                            .asString();

            Gson gson = new Gson();
            pInfos = gson.fromJson(responseJson, new TypeToken<List<PInfo>>() {
            }.getType());

            for (PInfo p: pInfos ){
                if ((match = ask(p, "Match ?", "yYnN").equalsIgnoreCase("y"))) {
                    //do the job
                    url = String.format("http://" + host + "/lock?id=%s&l=true&d=%s", p.getId(),dateStr);
                    /****responseJson =
                            given().auth().basic(user, pw).
                                    when().get(url)
                                    .asString();***/
                    System.out.println("Updated.");
                } else if(match = ask(p, "Create ?", "yYnN").equalsIgnoreCase("y")) {
                    Updates<P>  update = new Updates<>();
                    P np = new P();
                    np.c = 2;
                    np.l = true;
                    np.a = (int) accountId;
                    SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy", Locale.ENGLISH);


                    Date dateIn = null;
                    try {
                        dateIn = formatter.parse(day + "." + month + "." + year);
                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }
                    np.c = (int) pickCategory();
                    np.d = dateIn;
                    long lo = Long.valueOf(whole + decimal);
                    np.i = BigDecimal.valueOf(lo, 2);
                    np.a = (int) accountId;
                    np.descr = paymentrows.get(0).substring(0,32);

                    //testiä varten

                    /****responseJson =
                     given().auth().basic(user, pw).
                     when().get(url)
                     .asString();***/
                    System.out.println("Created.");

                } else {
                    continue;
                }
            }
            //System.out.println("----------------------"+date+" sum: " + bd + responseJson.toString());
        }

        for (String p : paymentrows) {
           System.out.println((match ? "*" : "") + "                            "+p); //tiedostoon!
        }
        paymentrows.clear();
        day = month = year = whole = decimal = null;
        begin = false;
        }

    void begin() {
        Matcher m = begin_pattern.matcher(line);
        if(m.find()) {
            begin = true;
            //System.out.println("*"+line);
            flushPayment();
        }
    }

    void day() {
        Matcher m = day_pattern.matcher(line);
        if(m.find()) {
            this.day = m.group(1);
            this.day = String.format("%02d", Integer.parseInt(this.day));
        }
    }

    void month() {
        Matcher m = month_pattern.matcher(line);
        if(m.find()) {
            this.month = m.group(1);
            this.month = String.format("%02d", Integer.parseInt(this.month));
        }
    }

    void year() {
        Matcher m = year_pattern.matcher(line);
        if(m.find()) {
            this.year = m.group(1);
        }
    }

    void whole() {
        Matcher m = whole_pattern.matcher(line);
        if(m.find()) {
            this.whole = m.group(1).replaceAll("[^\\d-]", "");
        }
    }

    void decimal() {
        Matcher m = decim_pattern.matcher(line);
        if(m.find()) {
            this.decimal = m.group(1).replaceAll("[^\\d-]", "");
        }
    }
    void unary() {
        if (null == unary_pattern) return;
        Matcher m = unary_pattern.matcher(line);
        if(m.find()) {
            this.unary = m.group(1);
        }
    }

/*
https://mkyong.com/java/how-do-convert-java-object-to-from-json-format-gson-api/
https://howtodoinjava.com/resteasy/restful-webservices-client-using-java-net-package/
https://stackoverflow.com/questions/39868792/using-spring-resttemplate-in-jax-rs-project
*/

    Properties props = new Properties(){
        @Override
        public String getProperty(String key) {
            String value = super.getProperty(key);
            if(StringUtils.isEmpty(value)) {
                throw new IllegalArgumentException("missing: " + key);
            }
            return  value;
        };
    };


    @SneakyThrows
    void loadProps(String bankName) {
        String fileName = String.format("regexps/%s.properties", bankName);
        InputStream in = new FileInputStream(fileName);
        props.load(in);
        in.close();
        user = props.getProperty("user");
        host = props.getProperty("host");
        begin_pattern = Pattern.compile(props.getProperty("begin_rexp"));
        day_pattern = Pattern.compile(props.getProperty("day_rexp"));
        month_pattern = Pattern.compile(props.getProperty("month_rexp"));
        year_pattern = Pattern.compile(props.getProperty("year_rexp"));
        whole_pattern = Pattern.compile(props.getProperty("whole_rexp"));
        decim_pattern = Pattern.compile(props.getProperty("decim_rexp"));
        unary_pattern = Pattern.compile(props.getProperty("unary_rexp"));

        String url = String.format("http://" + host + "/acc/list");
        String responseJson =
        given().auth().basic(user, pw).when().get(url).asString();
        Gson gson = new Gson();
        List<A> accountList = gson.fromJson(responseJson, new TypeToken<List<A>>() {
          }.getType());

        A a = (A) accountList.stream().filter(x -> x.descr.equals(props.getProperty("account")));
        accountId = a.id;


            url = String.format("http://" + host + "/cat/list");
            responseJson =
                given().auth().basic(user, pw).when().get(url).asString();
            categories = gson.fromJson(responseJson, new TypeToken<List<A>>() {
            }.getType());
    }

    String line=null;
    //https://www.baeldung.com/spring-5-webclient

    @SneakyThrows
    public void parser(String [] args) throws FileNotFoundException {
        loadProps(args[0]);

    }
    @SneakyThrows
    public void scan(String [] args) throws FileNotFoundException {
        loadProps(args[0]);
        askPassword();
        //askMatch(); //test
        Scanner scan = new Scanner(new File(args[1]));
        while(scan.hasNextLine()){
            line = scan.nextLine();
            begin(); day(); month(); year(); whole(); decimal(); unary();
            paymentrows.add(line);
            if(!scan.hasNextLine()) {
                flushPayment();
            }
        }
    }

    @SneakyThrows
    void askPassword() {
        pw = ask(null, "password ", null);
        String resp =
                given().auth().basic(user,pw).
                        when().get("http://" + host + "/hello")
                        .body().asString();

        System.out.println(resp);
    }

    String ask(PInfo pInfo, String question, String answers) {
        String choice = null;
        if(null != pInfo) {
            System.out.println("__________________________________________________");

            paymentrows.stream().forEach(System.out::println);
            System.out.println("---------------------------------------------------");
            String pHeaderFormatstring = "%10s | %6s | %6s | %s";
            String header = String.format(pHeaderFormatstring, "Date", "Category", "Account", "Description");
            DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy");
            String d = new SimpleDateFormat("dd.MM.yyyy").format(pInfo.getD());
            String row = String.format(pHeaderFormatstring, d, pInfo.getC_descr(), pInfo.getA_descr(), pInfo.getDescr());
            System.out.println(header);
            System.out.println(row);
            System.out.println("---------------------------------------------------");
        }
        while(null == answers || !answers.contains(choice)) {
            System.out.print(question + (answers!=null ? " [q"+answers+"] " : "") + " (q to quit)");
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

