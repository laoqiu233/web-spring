package io.dmtri.weblab;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ZalupaController implements ErrorController {
    @RequestMapping("/error")
    public String handleError() {
        return "/static/index.html";
    }
}