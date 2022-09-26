package onassis.utils.payment.synchronizer.parsers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import lombok.SneakyThrows;
import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.PInfo;
import org.apache.commons.lang3.StringUtils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import static com.jayway.restassured.RestAssured.given;

public class RestIO {
    private String host;
    private String user;
    private String account;
    private String pw;
    private List<C> categories= new ArrayList<>();

    @SneakyThrows
    public RestIO(String bankName) {
        String fileName = String.format("regexps/%s.properties", bankName);
        InputStream in = new FileInputStream(fileName);
        Properties props = new Properties();
        props.load(in);
        in.close();
        user = props.getProperty("user");
        host = props.getProperty("host");
        account = props.getProperty("account");

        if(StringUtils.isEmpty(user) || StringUtils.isEmpty(host) || StringUtils.isEmpty(account)) {
            throw new RuntimeException("account, user or host missing.");
        }
    }

    boolean login(String password) {
        pw = password;
        String responseJson =
                given().auth().basic(user, pw).when().get("http://\" + host + \"/cat/list").asString();
        categories = (new Gson()).fromJson(responseJson, new TypeToken<List<C>>() {}.getType());
        return categories != null;
    }

    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    void lock(P p)  {
        String dateStr = dateFormat.format(p.getDc());
        String url = String.format("http://%s/lock?id=%s&l=true&d=%s", this.host, p.getId(), dateStr);
        ((Response)RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
    }

    List<PInfo> getPCandidates(String year, String month, String day, Long amount) {
        String dateStr = String.format("%s-%s-%s", year, month, day);
        LocalDate date = LocalDate.parse(dateStr);
        /*long l = Long.valueOf((null == this.unary ? "" : this.unary) + this.whole + this.decimal);*/
        BigDecimal bd = BigDecimal.valueOf(amount, 2);
        List<PInfo> pInfos = null;
        String url = String.format("http://%s/info?d=%s&i=%s&a=%s", this.host, dateStr, bd, this.account);
        String responseJson = ((Response) RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
        List<PInfo> Infos = (new Gson()).fromJson(responseJson, new TypeToken<List<PInfo>>() {
        }.getType());
        return Infos;
    }

    List<C> getCategories() {
        return categories;
    }
}
