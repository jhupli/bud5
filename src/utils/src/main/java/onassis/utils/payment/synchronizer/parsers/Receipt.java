package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static onassis.utils.payment.synchronizer.parsers.Parser.Target;

public class Receipt {

    @Getter
    private List<Line> lines = new ArrayList<>();

    @Getter
    @Setter
    public String url = "";

    @Override
    public String toString() {
        return "\n\t\tReceipt{" +
                "\n\t\tcollectedValues=" + collectedValues +
                "\n\t\turl=" + url +
                "\n\t\tlines=" + lines +
                "\n\t\t}";
    }

    Map<Target, String> collectedValues = new HashMap<>();

    public Receipt() {
    }
    public boolean hasItAll() {
        return
        collectedValues.containsKey(Target.BEGIN) &&
                collectedValues.containsKey(Target.DAY) &&
                collectedValues.containsKey(Target.MONTH) &&
                collectedValues.containsKey(Target.YEAR) &&
                collectedValues.containsKey(Target.WHOLE) &&
                collectedValues.containsKey(Target.DECIMAL);
    }

    public void collect(String str) {
        Line newLine = new Line(str);
        lines.add(newLine);

        for (int i = 0; i < Parser.parsers.getMaxLength(); i++) {
            newLine.collect(i, str, collectedValues);
        }
    }

    public String getDateString() {
        String dateStr = collectedValues.get(Target.YEAR) + "-" +
                collectedValues.get(Target.MONTH) + "-" +
                collectedValues.get(Target.DAY);
        return dateStr;
    }

    public BigDecimal getAmount() {
        long amount = Long.valueOf((collectedValues.containsKey(Target.UNARY) ?
                        collectedValues.get(Target.UNARY) : "") +
                        collectedValues.get(Target.WHOLE) +
                        collectedValues.get(Target.DECIMAL));

        return BigDecimal.valueOf(amount, 2);
    }


}

