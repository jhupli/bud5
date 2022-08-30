//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package onassis.utils.payment.synchronizer.parsers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PartialParser {
    private final List<Pattern> patterns;
    private final List<String> rexps;
    private Matcher matcher;
    private String value;
    private boolean required;
    private String matchedRegexp;
    private static boolean debug = false;

    public PartialParser(String regexp, boolean required) {
        this(regexp);
        this.required = required;
    }

    public PartialParser(String regexp) {
        this.patterns = new ArrayList();
        this.rexps = new ArrayList();
        this.matcher = null;
        this.value = null;
        this.required = true;
        this.matchedRegexp = null;
        this.patterns.add(Pattern.compile(regexp));
        this.rexps.add(regexp);
    }

    public PartialParser(String[] regexps, boolean required) {
        this(regexps);
        this.required = required;
    }

    protected static void debugOn() {
        debug = true;
    }

    protected PartialParser(String[] regexps) {
        this.patterns = new ArrayList();
        this.rexps = new ArrayList();
        this.matcher = null;
        this.value = null;
        this.required = true;
        this.matchedRegexp = null;
        Arrays.stream(regexps).forEach((r) -> {
            this.patterns.add(Pattern.compile(r));
            this.rexps.add(r);
        });
    }

    protected int length() {
        return patterns.size();
    }
    protected boolean matchesOnly(String text) {
        return this.matches(text, true);
    }

    protected boolean matches(String text) {
        return this.matches(text, false);
    }

    protected boolean isRequired() {
        return this.required;
    }

    private boolean matches(String text, boolean matchOnly) {
        this.matchedRegexp = null;
        this.value = null;
        int i = 0;

        for(Iterator iterator = this.patterns.iterator(); iterator.hasNext(); ++i) {
            Pattern p = (Pattern) iterator.next();
            this.matcher = p.matcher(text);
            if (this.matcher.find()) {
                this.matchedRegexp = ((Pattern)this.patterns.get(i)).pattern();
                if (debug) {
                    System.out.println("matched: " + this.matchedRegexp + "  (." + i + ")");
                }

                if (matchOnly) {
                    return true;
                }

                try {
                    this.value = this.matcher.group(1);
                    return true;
                } catch (Exception var7) {
                    System.err.println("text: " + text);
                    System.err.println("regx: " + (String)this.rexps.get(i));
                    throw var7;
                }
            }
        }

        return false;
    }

    protected String getValue() {
        return this.value;
    }

    protected String getMatchedRegexp() {
        return this.matchedRegexp;
    }
}
