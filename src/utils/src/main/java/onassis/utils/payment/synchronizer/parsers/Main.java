package onassis.utils.payment.synchronizer.parsers;

import lombok.SneakyThrows;
import onassis.utils.paymentlocker.PaymentLocker;

import java.io.File;
import java.util.Scanner;

public class Main {

    @SneakyThrows
    public static void main(String[] args) {
        if (args.length < 2 || args.length > 3) {
            System.err.println("Usage: java -jar OnassisUtils.jar <bank-name> <file of account-statement> [TEST|SIMULATE]");
            System.exit(2);
        }

        IOUtils.muteLoggers();
        Parser parser = new Parser(args[0]);

        IOUtils.StatementReader statements = new IOUtils.StatementReader(args[1]);
        String line = null;
        while(null != (line = statements.getLine())){
            parser.collect(line);
        }
        parser.prepare();
        //System.out.println("result:");
        //System.out.println(parser);
        System.exit(0);

    }
}
