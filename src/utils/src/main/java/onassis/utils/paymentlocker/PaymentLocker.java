package onassis.utils.paymentlocker;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.SneakyThrows;

import java.io.*;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import onassis.dto.PInfo;
import org.slf4j.LoggerFactory;

import static com.jayway.restassured.RestAssured.given;

public class PaymentLocker {
    List<String> paymentrows = new ArrayList();

    Pattern begin_pattern = null;
    Pattern day_pattern = null;
    Pattern month_pattern = null;

    Pattern year_pattern = null;
    Pattern whole_pattern = null;
    Pattern decim_pattern = null;

    String day, month, year, whole, decimal, user, host = null;


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
            (new PaymentLocker()).scan(args);
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
            long l = Long.valueOf(whole + decimal);
            BigDecimal bd = BigDecimal.valueOf(l, 2);

            String url = String.format("http://localhost:8080/info?d=%s&i=%s&days=30", dateStr, bd);
            String responseJson =
                    given().auth().basic("user", "kakkakikkare").
                            when().get(url)
                            .asString();

            Gson gson = new Gson();
            pInfos = gson.fromJson(responseJson, new TypeToken<List<PInfo>>() {
            }.getType());

            for (PInfo p: pInfos ){
                if (match = askMatch(p)) {
                    //do the job
                    url = String.format("http://localhost:8080/lock?id=%s&l=true&d=%s", p.getId(),dateStr);
                    responseJson =
                            given().auth().basic("user", "kakkakikkare").
                                    when().get(url)
                                    .asString();
                    System.out.println("Updted.");


                } else {
                    continue;
                }
            }
            //System.out.println("----------------------"+date+" sum: " + bd + responseJson.toString());
        }

        for (String p : paymentrows) {
            System.out.println((match ? "*" : "") + p); //tiedostoon!
        }
        paymentrows.clear();
        day = month = year = whole = decimal = null;
        }

    void begin() {
        Matcher m = begin_pattern.matcher(line);
        if(m.find()) {
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

/*
https://mkyong.com/java/how-do-convert-java-object-to-from-json-format-gson-api/
https://howtodoinjava.com/resteasy/restful-webservices-client-using-java-net-package/
https://stackoverflow.com/questions/39868792/using-spring-resttemplate-in-jax-rs-project
*/

    Properties props = new Properties();
    String pw = null;

    @SneakyThrows
    void askPassword() {
        Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
        System.out.print("password: ");
        pw = sc.nextLine();
        String resp =
        given().auth().basic("user","kakkakikkare").
                when().get("http://localhost:8080/hello")
                .body().asString();
        System.out.println(resp);
    }

    @SneakyThrows
    boolean askMatch(PInfo pInfo) {
        String choice = "foo";
        System.out.println("__________________________________________________");

        paymentrows.stream().forEach(System.out::println);
        System.out.println("---------------------------------------------------");
        String pHeaderFormatstring = "%10s | %6s | %6s | %s";
        String header = String.format(pHeaderFormatstring, "Date", "Category", "Account", "Description");
        DateFormat formatter = new SimpleDateFormat("DD.MM.YYYY");
        String d = new SimpleDateFormat("DD.MM.YYYY").format(pInfo.getD());
        String row = String.format(pHeaderFormatstring, d, pInfo.getC_descr(), pInfo.getA_descr(), pInfo.getDescr());
        System.out.println(header);
        System.out.println(row);
        System.out.println("---------------------------------------------------");
        while(!"ynq".contains(choice)) {
            System.out.print("Are these a match ? [yNq] ");
            Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
            choice = sc.nextLine().toLowerCase();
        }
        switch (choice) {
            case "q" : System.exit(1);
            default: return choice.equals("y");
        }
    }

    @SneakyThrows
    void loadProps(String bankName) {
        String fileName = String.format("regexps/%s.properties", bankName);
        InputStream in = new FileInputStream(fileName );
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
    }

    String line=null;
    //https://www.baeldung.com/spring-5-webclient

    @SneakyThrows
    public void scan(String [] args) throws FileNotFoundException {
        loadProps(args[0]);
        askPassword();
        //askMatch(); //test
        Scanner scan = new Scanner(new File(args[1]));
        while(scan.hasNextLine()){
            line = scan.nextLine();
            begin(); day(); month(); year(); whole(); decimal();
            paymentrows.add(line);
            if(!scan.hasNextLine()) {
                flushPayment();
            }
        }
    }
}

