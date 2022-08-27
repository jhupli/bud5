//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package onassis.utils.paymentlocker;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Extractor {
    private List<Pattern> patterns;
    private List<String> rexps;
    private Matcher m;
    private String value;
    private boolean required;
    private String matchedRegexp;
    private static boolean debug = false;

    public Extractor(String regexp, boolean required) {
        this(regexp);
        this.required = required;
    }

    public Extractor(String regexp) {
        this.patterns = new ArrayList();
        this.rexps = new ArrayList();
        this.m = null;
        this.value = null;
        this.required = true;
        this.matchedRegexp = null;
        this.patterns.add(Pattern.compile(regexp));
        this.rexps.add(regexp);
    }

    public Extractor(String[] regexps, boolean required) {
        this(regexps);
        this.required = required;
    }

    public static void debugOn() {
        debug = true;
    }

    public Extractor(String[] regexps) {
        this.patterns = new ArrayList();
        this.rexps = new ArrayList();
        this.m = null;
        this.value = null;
        this.required = true;
        this.matchedRegexp = null;
        for(int i=0; i<regexps.length; i++ ) {
            System.out.println(regexps[i]);
        }
        Arrays.stream(regexps).forEach((r) -> {
            this.patterns.add(Pattern.compile(r));
            this.rexps.add(r);
        });
    }

    public boolean matchesOnly(String text) {
        return this.matches(text, true);
    }

    public boolean matches(String text) {
        return this.matches(text, false);
    }

    public boolean isRequired() {
        return this.required;
    }

    private boolean matches(String text, boolean matchOnly) {
        this.matchedRegexp = null;
        this.value = null;
        int i = 0;

        for(Iterator var4 = this.patterns.iterator(); var4.hasNext(); ++i) {
            Pattern p = (Pattern)var4.next();
            this.m = p.matcher(text);
            if (this.m.find()) {
                this.matchedRegexp = ((Pattern)this.patterns.get(i)).pattern();
                if (debug) {
                    System.out.println("matched: " + this.matchedRegexp + "  (." + i + ")");
                }

                if (matchOnly) {
                    return true;
                }

                try {
                    this.value = this.m.group(1);
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

    public String getValue() {
        return this.value;
    }

    public String getMatchedRegexp() {
        return this.matchedRegexp;
    }
}
