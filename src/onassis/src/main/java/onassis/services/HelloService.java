package onassis.services;

import org.springframework.stereotype.Component;

@Component
public class HelloService extends ServicesBase {
    public String hello() {
        return "Hello World, This is Onassis! Can you here me?";
    }

    public String ping() {
        return "Yep!";
    }
}