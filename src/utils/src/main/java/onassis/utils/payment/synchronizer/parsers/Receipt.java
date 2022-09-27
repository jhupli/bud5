package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static onassis.utils.payment.synchronizer.parsers.Parser.Target;

public class Receipt {

    @Getter
    private List<Line> lines = new ArrayList<>();

    @Override
    public String toString() {
        return "\n\t\tReceipt{" +
                "\n\t\tcollectedValues=" + collectedValues +
                "\n\t\tlines=" + lines +
                "\n\t\t}";
    }

    Map<Target, String> collectedValues = new HashMap<>();

    public Receipt() {
    }
    public boolean hasItAll() {
        return collectedValues.size() == Target.nrOfMandatories();
    }

    public void collect(String str) {
        Line newLine = new Line(str);
        lines.add(newLine);

        for (int i = 0; i < Parser.parsers.getMaxLength(); i++) {
            newLine.collect(i, str, collectedValues);
        }
    }



}

