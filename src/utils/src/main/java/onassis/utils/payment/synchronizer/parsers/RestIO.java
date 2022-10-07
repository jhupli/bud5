package onassis.utils.payment.synchronizer.parsers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import lombok.Getter;
import lombok.SneakyThrows;
import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.PInfo;
import org.apache.commons.lang3.StringUtils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Properties;

import static com.jayway.restassured.RestAssured.given;

public class RestIO {
    private String host;
    private String user;
    @Getter
    private String account;
    @Getter
    private Integer accountId = null;
    private String pw;
    private List<C> categories = null;
    private List<A> accounts  = null;

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

    boolean login() {
        pw = IOUtils.login();
        String url = "http://" + host + "/cat/list";
        try {
            String responseJson =
                    given().auth().basic(user, pw).when().get(url).asString();
            categories = (new Gson()).fromJson(responseJson, new TypeToken<List<C>>() {
            }.getType());

            responseJson =
                    given().auth().basic(user, pw).when().get(url).asString();
            accounts = (new Gson()).fromJson(responseJson, new TypeToken<List<A>>() {
            }.getType());

            accountId = accounts.stream().filter(a -> {return account.equals(a.descr);} ).findFirst().get().getId().intValue();

            if(null == accountId) {
                throw new RuntimeException("Account "+account+ " does not exist.");
            }
        }catch (Exception e) {
            IOUtils.printOut("Login failed.");
        }
        return categories != null;
    }

    String newGroupId() {
        String url = "http://" + host + "/group/newid";
        try {
            String groupId =
                    given().auth().basic(user, pw).when().get(url).asString();
            return groupId;
        }catch (Exception e) {
            IOUtils.printOut("Unable to create new group id.");
            throw new RuntimeException(e);
        }
    }

    static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    void lock(PInfo p)  {
        String dateStr = dateFormat.format(p.getDc());
        String url = String.format("http://%s/lock?id=%s&l=true&d=%s", this.host, p.getId(), dateStr);
        ((Response)RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
    }

    List<PInfo> getPCandidates(Receipt receipt) {
        List<PInfo> pInfos = null;
        String url = String.format("http://%s/info?d=%s&i=%s&a=%s", this.host, receipt.getDateString(), receipt.getAmount(), this.account);
        receipt.setUrl(url);
        //return null;
        String responseJson = ((Response) RestAssured.given().auth().basic(this.user, this.pw).when().get(url, new Object[0])).asString();
        List<PInfo> Infos = (new Gson()).fromJson(responseJson, new TypeToken<List<PInfo>>() {
        }.getType());
        return Infos;
    }

    List<C> getCategories() {
        return categories;
    }
}
