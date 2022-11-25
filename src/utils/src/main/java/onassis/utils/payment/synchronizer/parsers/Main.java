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
        IOUtils.printOut("Collecting ..");
        do {
            line = statements.getLine();
            parser.collect(line);
        } while(null != line);
        IOUtils.printOut(" Done\n");
        long size = parser.matchables.stream().filter(p -> p.getState().equals(Matchable.State.ALL_ATTRS_FOUND)).count();
        IOUtils.printOut("Preparing " + size + " receipt(s) :\n");
        parser.prepare();
        IOUtils.dump(args[1], parser);
        IOUtils.printOut("Prepare done. \n");
        IOUtils.printOut("Preparing " + size + " receipt(s) :\n");
        parser.update(args[1]);



        //System.out.println("result:");
        //System.out.println(parser);
        System.exit(0);

    }
}
