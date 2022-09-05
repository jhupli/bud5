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
    Receipt receipt;

    public void collect(Parser.Target target, String str) {

    }


}
