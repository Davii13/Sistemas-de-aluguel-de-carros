package br.gestao.controller;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.server.types.files.StreamedFile;

import java.io.InputStream;

@Controller
public class FrontendController {

    @Get(value = "/", produces = MediaType.TEXT_HTML)
    public HttpResponse<?> index() {
        return servir("static/index.html", "text/html");
    }

    @Get(value = "/index.html", produces = MediaType.TEXT_HTML)
    public HttpResponse<?> indexHtml() {
        return servir("static/index.html", "text/html");
    }

    @Get(value = "/js.js", produces = "application/javascript")
    public HttpResponse<?> js() {
        return servir("static/js.js", "application/javascript");
    }

    @Get(value = "/style.css", produces = "text/css")
    public HttpResponse<?> css() {
        return servir("static/style.css", "text/css");
    }

    private HttpResponse<?> servir(String caminho, String contentType) {
        InputStream stream = getClass().getClassLoader().getResourceAsStream(caminho);
        if (stream == null) {
            return HttpResponse.notFound("Arquivo não encontrado: " + caminho);
        }
        return HttpResponse.ok(new StreamedFile(stream, MediaType.of(contentType)));
    }
}
