package onassis.utils.payment.synchronizer.parsers;

import com.github.freva.asciitable.AsciiTable;
import com.github.freva.asciitable.Column;
import com.github.freva.asciitable.HorizontalAlign;
import onassis.dto.PInfo;

import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class IOUtils {

    // https://www.google.com/search?q=ascii+%E2%95%9F&rlz=1C1GCEU_deDE842DE842&oq=ascii+%E2%95%9F&aqs=chrome..69i57j0i22i30l9.2786j0j7&sourceid=chrome&ie=UTF-8#imgrc=Bw5m0affChzNHM

    /*
    Character[] borderStyles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123".chars().mapToObj(c -> (char)c).toArray(Character[]::new);
    Prints

ABBBCBBBBBBBBBCBBBBBBBBBBCBBBBBBCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBD
E   F  Name   F Diameter F Mass F Atmosphere                      G
HIIIJIIIIIIIIIJIIIIIIIIIIJIIIIIIJIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIK
L 1 M Mercury M  0.382   M 0.06 M             minimal             N
OPPPQPPPPPPPPPQPPPPPPPPPPQPPPPPPQPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPR
L 2 M   Venus M  0.949   M 0.82 M    Carbon dioxide, Nitrogen     N
OPPPQPPPPPPPPPQPPPPPPPPPPQPPPPPPQPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPR
L 3 M   Earth M  1.000   M 1.00 M     Nitrogen, Oxygen, Argon     N
OPPPQPPPPPPPPPQPPPPPPPPPPQPPPPPPQPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPR
L 4 M    Mars M  0.532   M 0.11 M Carbon dioxide, Nitrogen, Argon N
STTTUTTTTTTTTTUTTTTTTTTTTUTTTTTTUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTV
W   X Average X  0.716   X 0.50 X                                 Y
Z111211111111121111111111211111121111111111111111111111111111111113

kulmiin?
╭	╮
╰	╯
     */


    private static final Character[] TABLE_ASCII =                    new Character[]{'╭', '─', '┬', '╮', '│', '│', '│', '├', '─', '┼', '┤', '│', '│', '│',  '├',  '─',  '┼',  '┤', '├', '─', '┤', '┤', '│', '│', '│', '╰', '─', '┴', '┘'};
    private static final Character[] TABLE_ASCII_NO_DATA_SEPARATORS = new Character[]{'╭', '─', '┬', '╮', '│', '│', '│', '├', '─', '┼', '┤', '│', '│', '│', null, null, null, null, '├', '─', '┤', '┤', '│', '│', '│', '╰', '─', '┴', '╯'};

    private static void showRows(List<String> rows, String header) {
        System.out.println(
                AsciiTable.getTable(TABLE_ASCII_NO_DATA_SEPARATORS, rows,
                        Arrays.asList(
                                (new Column()).minWidth(60).maxWidth(60).headerAlign(HorizontalAlign.CENTER)
                                              .dataAlign(HorizontalAlign.LEFT)
                                              .header(header).with((r) -> { return r.replaceAll("\t", " "); })))
        );
    };

    private static  String ask(List<String> rows, PInfo pInfo, String question, String possibleAnswers, String header) {
        String choice = null;
        if(null != pInfo) {
            showRows(rows, header);
            //TODO showPInfo(pInfo);
        }
        while(choice == null || (null != possibleAnswers && !(possibleAnswers+"q").contains(choice))) {
            System.out.print(question + (possibleAnswers!=null ? " [q"+possibleAnswers+"] " : "") + " (or q to quit) ");
            Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
            choice = sc.nextLine();
        }
        switch (choice) {
            case "q" : System.exit(1);
            default: return choice;
        }
    }
}
