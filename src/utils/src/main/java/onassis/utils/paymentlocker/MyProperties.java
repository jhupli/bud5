//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package onassis.utils.paymentlocker;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import org.springframework.util.StringUtils;

class MyProperties extends Properties {
    private boolean required;

    MyProperties() {
        this.required = true;
    }

    public String getString(String key) {
        return this.getString(key, true);
    }

    public String getString(String key, boolean required) {
        String value = (String)super.get(key);
        if (StringUtils.isEmpty(value) && required) {
            throw new IllegalArgumentException("missing: " + key);
        } else {
            return value;
        }
    }

    public String[] getStringArray(String key) {
        return this.getStringArray(key, true);
    }

    public String[] getStringArray(String key, boolean required) {
        int ix = 0;
        List<String> values = new ArrayList();

        while(null != super.get(key + "." + ix)) {
            values.add((String)super.get(key + "." + ix++));
        }

        if (values.isEmpty() && required) {
            throw new IllegalArgumentException("missing: " + key + ".0");
        } else {
            return (String[])values.toArray(new String[0]);
        }
    }
}
