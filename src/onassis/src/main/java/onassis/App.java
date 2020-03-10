package onassis;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.zeroturnaround.zip.ZipUtil;

@SpringBootApplication
public class App {
    public static void main(String[] args) throws IOException {

        String pattern = "dd_MMMM_yyyy_hh_mm_ss";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        String date = simpleDateFormat.format(new Date());

        Path path = Paths.get("./bak/"+date+".zip");
        Files.createDirectories(path.getParent());
        ZipUtil.pack(new File(".\\BudDB.v5\\"), path.toFile());
        SpringApplication.run(App.class, args);
    }
}