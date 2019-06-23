package onassis.services;

import org.springframework.stereotype.Component;

@Component
public class HelloService extends ServicesBase {
    public String hello() {
        return "Hello World, This is Onassis 5.0.0 (Keitele) ! Can you here me?";
    }

    public String ping() {
        return "Yep!";
    }
}