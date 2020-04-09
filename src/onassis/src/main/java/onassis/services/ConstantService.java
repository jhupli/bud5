package onassis.services;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import onassis.dto.A;
import onassis.dto.C;
import onassis.dto.Constant;

@Component
public class ConstantService extends ServicesBase {
    @Autowired
    CategoryService categoryService;

    @Autowired
    AccountService accountService;

    public List<Constant> constants(String id) throws SQLException, ParseException {
        List<Constant> constants =  new LinkedList<Constant>();
        switch(id) {
            case "cat" :
                List<C> cats = categoryService.catList();
                for (C c : cats) {
                    constants.add(new Constant(c.id, c.descr, c.color, c.active));
                }
                return constants;
            case "acc" :
                List<A> accs = accountService.accList();
                for (A a : accs) {
                    if(a.credit) {
                        constants.add(new Constant(a.id, a.descr , a.color, a.active, "credit-card"));
                    } else {
                        constants.add(new Constant(a.id, a.descr, a.color, a.active));
                    }
                }
                return constants;
        }
        return constants;
    }
}