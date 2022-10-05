package onassis.utils.payment.synchronizer.parsers;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.github.freva.asciitable.AsciiTable;
import com.github.freva.asciitable.Column;
import com.github.freva.asciitable.HorizontalAlign;
import com.github.freva.asciitable.OverflowBehaviour;
import lombok.SneakyThrows;
import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.P;
import onassis.dto.PInfo;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.LoggerFactory;
import onassis.utils.payment.synchronizer.parsers.Matchable.State;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class IOUtils {
    public static void muteLoggers() {
        Set<String> loggers = new HashSet<>(Arrays.asList("org.apache.http", "groovyx.net.http", "com.jayway.restassured.internal.RequestSpecificationImpl"));

        for(String log:loggers) {
            Logger logger = (Logger) LoggerFactory.getLogger(log);
            logger.setLevel(Level.WARN);
            logger.setAdditive(false);
        }
    }

    private static boolean debugmode=false;

    public static boolean isDebugmode() {
        return debugmode;
    }

    public static class StatementReader{
        Scanner scan;

        @SneakyThrows
        public StatementReader(String statementFileName) {
            scan = new Scanner(new File(statementFileName));
        }

        String getLine() {
            if(!scan.hasNext()) {
                return null;
            }

            return scan.nextLine();
        }
    }



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


    private static final Character[] TABLE_ASCII =                    new Character[]{'╭', '─', '┬', '╮', '│', '│', '│', '╞', '═', '╪', '╡', '│', '│', '│',  '├',  '─',  '┼',  '┤', '├', '─', '┤', '┤', '│', '│', '│', '╰', '─', '┴', '┘'};
    private static final Character[] TABLE_ASCII_NO_DATA_SEPARATORS = new Character[]{'╭', '─', '┬', '╮', '│', '│', '│', '╞', '═', '╪', '╡', '│', '│', '│', null, null, null, null, '├', '─', '┤', '┤', '│', '│', '│', '╰', '─', '┴', '╯'};

    public static int LINELENGTH = 80;
    public static void showLines(List<String> rows, String header) {
        System.out.println(
                AsciiTable.getTable(TABLE_ASCII_NO_DATA_SEPARATORS, rows,
                        Arrays.asList(
                                (new Column()).minWidth(LINELENGTH + 3).maxWidth(LINELENGTH + 3).headerAlign(HorizontalAlign.CENTER)
                                              .dataAlign(HorizontalAlign.LEFT)
                                              .header(header).with((r) -> { return r.replaceAll("\t", " "); })))
        );
    };

    private static String CREATE_KEY = "c";
    public static void showP(List<PInfo> pInfoList) {
        if(null == pInfoList) {
            return;
        }
        i = 0;
        System.out.println(AsciiTable.getTable(TABLE_ASCII_NO_DATA_SEPARATORS, pInfoList, Arrays.asList(
                (new Column()).minWidth(5).maxWidth(5).headerAlign(HorizontalAlign.CENTER)
                        .dataAlign(HorizontalAlign.LEFT)
                        .header("#").with((p) -> { return i != pInfoList.size() - 1 ? "" + ++i : CREATE_KEY; }),
                (new Column()).minWidth(12).maxWidth(12).headerAlign(HorizontalAlign.CENTER)
                        .dataAlign(HorizontalAlign.LEFT)
                        .header("Date").with((p) -> { return new SimpleDateFormat("dd.MM.yyyy").format(p.getD());}),
                (new Column()).minWidth(15).maxWidth(15, OverflowBehaviour.ELLIPSIS_RIGHT).headerAlign(HorizontalAlign.CENTER)
                        .dataAlign(HorizontalAlign.CENTER)
                        .header("Category").with((p) -> { return "" + p.getC_descr(); }),
                (new Column()).minWidth(LINELENGTH - 5 -12 - 15).maxWidth(LINELENGTH - 5 -12 - 15, OverflowBehaviour.ELLIPSIS_RIGHT).headerAlign(HorizontalAlign.CENTER)
                        .dataAlign(HorizontalAlign.CENTER)
                        .header("Description").with((p) -> { return "" + p.getDescr(); })
        )));
    }
    private static int i;
    public static C pickCategory(List<C> rows) {
        i=0;

        List<Pair<Pair, Pair >> cols = new ArrayList<>();
        for(int i=1; i <= rows.size(); i+=2) {
                 cols.add(Pair.of(
                        Pair.of("" + i, rows.get(i - 1).getDescr()),
                         (i + 1) > rows.size() ?
                                 Pair.of("", "") :
                                 Pair.of("" + (i + 1), rows.get(i).getDescr()))
                 );
        }

        System.out.println(
                AsciiTable.getTable(TABLE_ASCII_NO_DATA_SEPARATORS, cols,
                        Arrays.asList(
                                (new Column()).minWidth(5).maxWidth(5, OverflowBehaviour.ELLIPSIS_RIGHT).headerAlign(HorizontalAlign.CENTER)
                                        .dataAlign(HorizontalAlign.CENTER)
                                        .header("#").with((r) -> { return "" + r.getLeft().getLeft(); }),
                                (new Column()).minWidth(LINELENGTH/2 - 5).maxWidth(LINELENGTH - 5).headerAlign(HorizontalAlign.CENTER)
                                        .dataAlign(HorizontalAlign.LEFT)
                                        .header("Description").with((r) -> { return "" + r.getLeft().getRight();  }),
                                (new Column()).minWidth(5).maxWidth(5, OverflowBehaviour.ELLIPSIS_RIGHT).headerAlign(HorizontalAlign.CENTER)
                                        .dataAlign(HorizontalAlign.CENTER)
                                        .header("#").with((r) -> { return "" + r.getRight().getLeft(); }),
                                (new Column()).minWidth(LINELENGTH/2 - 5).maxWidth(LINELENGTH - 5).headerAlign(HorizontalAlign.CENTER)
                                        .dataAlign(HorizontalAlign.LEFT)
                                        .header("Description").with((r) -> { return "" + r.getRight().getRight();  })
                        )
                )
        );

        String answer =  ask("Pick a Category #", null, 1, rows.size());
        return null == answer ? null : rows.get(Integer.parseInt(answer) - 1);
    };

    public static State pickMatch(Matchable m) {
        showLines(m.getReceipt().getLines().stream().map(l -> {return l.getLine(); }).collect(Collectors.toList()), "Receipt");
        showP(m.getPInfo());
        String answer =  ask("Pick a Payment #, c to create new, s to skip ", "sc", 1, m.getPInfo().size());
        if(null == answer) {
            return State.SKIP;
        }

        if(answer.equals("c")) {
            return State.CREATE;
        } else {
            m.setTheChosenP(m.getPInfo().get(Integer.getInteger(answer) - 1));
        }
        return State.MATCH_FOUND;
    }

    /*
    public void printC(List<C> categories) {
        System.out.println(AsciiTable.getTable(borderStyles, planets, Arrays.asList(
                new Column().with(planet -> Integer.toString(planet.num)),
                new Column().header("Name").footer("Average").headerAlign(CENTER).dataAlign(RIGHT).with(planet -> planet.name),
                new Column().header("Diameter").headerAlign(RIGHT).dataAlign(CENTER).footerAlign(CENTER)
                        .footer(String.format("%.03f", planets.stream().mapToDouble(planet -> planet.diameter).average().orElse(0)))
                        .with(planet -> String.format("%.03f", planet.diameter)),
                new Column().header("Mass").headerAlign(RIGHT).dataAlign(LEFT)
                        .footer(String.format("%.02f", planets.stream().mapToDouble(planet -> planet.mass).average().orElse(0)))
                        .with(planet -> String.format("%.02f", planet.mass)),
                new Column().header("Atmosphere").headerAlign(LEFT).dataAlign(CENTER).with(planet -> planet.atmosphere))));


                new Column().header(p.getA_descr()).maxWidth(12, OverflowBehaviour.NEWLINE).with(planet -> planet.atmosphere),
                new Column().header(p.getC_descr()).maxWidth(12, OverflowBehaviour.NEWLINE).with(planet -> planet.atmosphere),
                new Column().header(p.getC_descr())).maxWidth(12, OverflowBehaviour.CLIP_LEFT).with(planet -> planet.atmosphere),
                new Column().header(p.getDescr())"Atmosphere Composition").maxWidth(12, OverflowBehaviour.CLIP_RIGHT).with(planet -> planet.atmosphere),
                new Column().header("Atmosphere Composition").maxWidth(12, OverflowBehaviour.ELLIPSIS_LEFT).with(planet -> planet.atmosphere),
                new Column().header("Atmosphere Composition").maxWidth(12, OverflowBehaviour.ELLIPSIS_RIGHT).with(planet -> planet.atmosphere))));
    } */

    private static String ask(String question, String possibleSingleAnswers, Integer start, Integer end) {
        while(true) {
            System.out.print(question +
                    (null != possibleSingleAnswers ?  "[" + possibleSingleAnswers + "]" : "") +
                    " (or q to quit) : ");
            Scanner sc = new Scanner(System.in); //System.in is a standard input stream.
            String choice = sc.nextLine();

            if(StringUtils.isEmpty(choice)) {
                continue;
            }

            switch (choice) {
                case "q" :  System.exit(1);
            }

            if(null == possibleSingleAnswers && null == start && null == end) {
                return choice; //anything goes
            }
            try {
                int ix = Integer.parseInt(choice);
                if( null != start && ix < start) {
                    continue;
                }
                if( null != end && ix > end) {
                    continue;
                }
                return ""+ix;
            } catch (Exception toIgnore) {
                //keep on going
            }

            if(null != possibleSingleAnswers && choice.length() == 1 && possibleSingleAnswers.contains(choice)) {
                return choice;
            }
        }
    }

    public static void printOut(String str) {
        System.out.println(str);
    }
    public static String login() {
        return ask("Onassis password", null, null, null);
    }
    public static void farewell() {
        System.out.println("Exiting... Goodbye.");
    }
}
