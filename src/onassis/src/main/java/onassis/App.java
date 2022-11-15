package onassis;

import java.awt.datatransfer.FlavorEvent;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

//import org.flywaydb.core.Flyway;
//import org.flywaydb.core.api.output.RepairResult;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.zeroturnaround.zip.ZipUtil;

import static java.lang.Runtime.getRuntime;

@SpringBootApplication
public class App {

    static String shutdownJdbcUrl = "";

    private static void cleanUp() {
         System.out.print("Shutting down DB...");
        try {
            DriverManager.getConnection("jdbc:derby:;shutdown=true");
        } catch (SQLException ignored) {
        }
        System.out.println("Done");
        System.out.println("Goodbye.");
    }

    public static void main(String[] args) throws IOException {
        System.out.println("NOTE: flywas is disabled.");

        //System.out.println("repairing...");
        //Flyway flyway = Flyway.configure().dataSource("jdbc:derby:BudDB.v5;create=true", "sa", null).load();
        //RepairResult repair  = flyway.repair();
        //System.out.println("res=" + repair.toString());


        Thread shutdownThread = new Thread() {
            @Override
            public void run() {
                cleanUp();
            }
        };

        getRuntime().addShutdownHook(shutdownThread);



        String pattern = "dd_MMMM_yyyy_hh_mm_ss";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        String date = simpleDateFormat.format(new Date());
        Path path = Paths.get("./bak/"+date+".zip");
        Files.createDirectories(path.getParent());
        try {
            ZipUtil.pack(new File(".\\BudDB.v5\\"), path.toFile());
        } catch (org.zeroturnaround.zip.ZipException e) {
            System.out.println("Skipping backup (first run this program?).");
        }
        SpringApplication.run(App.class, args);
    }
}
