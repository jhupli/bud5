package onassis.utils.payment.synchronizer.parsers;

import onassis.dto.A;

public class Matchable {
    public enum State {
        NEW,
        ATTRS_NOT_FOUND,
        ALL_ATTRS_FOUND,
        ERROR,
    }

    State state = State.NEW;
    A[] a;
    Receipt receipt = new Receipt();

    public void collect(String str) {
        receipt.collect(str);
    }

    @Override
    public String toString() {
        return "\n\tMatchable{" +
                "\n\tstate=" + state +
                "\n\treceipt=" + receipt +
                "\n\t}";
    }
}
