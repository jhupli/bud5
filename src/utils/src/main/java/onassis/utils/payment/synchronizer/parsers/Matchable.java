package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import java.util.List;

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
    private List pInfo;
    @Getter
    private Receipt receipt = new Receipt();

    private final RestIO restIO;

    public Matchable(RestIO restIO) {
        this.restIO = restIO;
    }

    public void collect(String str) {
        state = State.ATTRS_NOT_FOUND;
        receipt.collect(str);
        if(receipt.hasItAll()) {
            state = State.ALL_ATTRS_FOUND;
            pInfo = restIO.getPCandidates(receipt);
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
