package onassis.utils.payment.synchronizer.parsers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static onassis.utils.payment.synchronizer.parsers.Parser.Target;
import static onassis.utils.payment.synchronizer.parsers.Parser.Target.BEGIN;

public class Receipt {

    List<Line> lines = new ArrayList<>();

    @Override
    public String toString() {
        return "Receipt{" +
                "lines=" + lines +
                ", collectedValues=" + collectedValues +
                '}';
    }

    Map<Target, String> collectedValues = new HashMap<>();

    public Receipt() {
    }
    public boolean hasItAll() {
        return collectedValues.size() == Target.nrOfMandatories();
    }

    public void collect(String str) {
        for (Line line : lines) {
            for (int i = 0; i < Parser.parsers.get(BEGIN).length(); i++) {
                line.collect(i, str, collectedValues);
            }
        }
    }


}

