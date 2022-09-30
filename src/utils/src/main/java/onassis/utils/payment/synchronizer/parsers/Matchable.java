package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import lombok.Setter;
import onassis.dto.PInfo;

import java.util.List;

public class Matchable {
    public enum State {
        NEW,
        ATTRS_NOT_FOUND,
        ALL_ATTRS_FOUND,
        SKIP,
        MATCH_FOUND,
        CREATE,
        ERROR,
    }
    @Getter
    private State state = State.NEW;
    @Getter
    private List<PInfo> pInfo;
    @Getter
    private Receipt receipt = new Receipt();
    @Getter
    @Setter
    public Integer theChosenP = null;

    private final RestIO restIO;

    public Matchable(RestIO restIO) {
        this.restIO = restIO;
    }
    public void pickMatch() {
        state = IOUtils.pickMatch(this);
    }



    public void collect(String str) {
        state = State.ATTRS_NOT_FOUND;
        receipt.collect(str);
        if(receipt.hasItAll()) {
            state = State.ALL_ATTRS_FOUND;
            pInfo = restIO.getPCandidates(receipt);
            pInfo.add(receipt.getPseudoP(restIO));

        }
    }



    @Override
    public String toString() {
        return "\n\tMatchable{" +
                "\n\tstate=" + state +
                "\n\treceipt=" + receipt +
                "\npInfos=" + pInfo +
                "\n\t}";
    }
}
