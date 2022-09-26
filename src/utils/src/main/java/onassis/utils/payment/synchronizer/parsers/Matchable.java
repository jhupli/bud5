package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import onassis.dto.A;
import onassis.dto.PInfo;

public class Matchable {
    public enum State {
        NEW,
        ATTRS_NOT_FOUND,
        ALL_ATTRS_FOUND,
        ERROR,
    }
    @Getter
    private State state = State.NEW;
    @Getter
    private PInfo[] pInfo;
    @Getter
    private Receipt receipt = new Receipt();

    public void collect(String str) {
        state = State.ATTRS_NOT_FOUND;
        receipt.collect(str);
        if(receipt.hasItAll()) {
            state = State.ALL_ATTRS_FOUND;
        }
    }

    @Override
    public String toString() {
        return "\n\tMatchable{" +
                "\n\tstate=" + state +
                "\n\treceipt=" + receipt +
                "\n\t}";
    }
}
