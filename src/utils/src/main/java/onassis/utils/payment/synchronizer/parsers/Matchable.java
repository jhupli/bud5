package onassis.utils.payment.synchronizer.parsers;

import lombok.Getter;
import lombok.Setter;
import onassis.dto.C;
import onassis.dto.PInfo;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    public PInfo theChosenP = null;

    private final RestIO restIO;

    public Matchable(RestIO restIO) {
        this.restIO = restIO;
    }

    @Getter
    C chosenCategory;
    @Getter
    String description;

    public void pickMatch(Set<PInfo> blackList) {
        pInfo = getPInfo().stream().filter(p -> { return !blackList.contains(p); }).collect(Collectors.toList());
        state = IOUtils.pickMatch(this);
        if(state.equals(State.MATCH_FOUND)) {
            blackList.add(theChosenP);
        } else if(state.equals(State.CREATE)) {
            chosenCategory = IOUtils.pickCategory(restIO.getCategories());
            description = IOUtils.pickDescription(getDescription());
        }
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
                "\n\tchosenP=" + theChosenP +
                "\n\tchosenC=" + chosenCategory +
                "\n\tchosenDescription=" + description +
                "\npInfos=" + pInfo +
                "\n\t}";
    }
}
