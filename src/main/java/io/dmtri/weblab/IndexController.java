package io.dmtri.weblab;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {
    @RequestMapping("/{path:^(?!api)\\w*}")
    public String serveIndex() {
        return "index.html";
    }
}
