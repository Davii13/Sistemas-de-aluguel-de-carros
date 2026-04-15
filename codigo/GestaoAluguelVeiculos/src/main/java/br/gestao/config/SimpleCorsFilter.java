package br.gestao.config;

import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;

@Filter("/**")
public class SimpleCorsFilter implements HttpServerFilter {

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        if (request.getMethod().name().equalsIgnoreCase("OPTIONS")) {
            MutableHttpResponse<?> response = HttpResponse.ok();
            response.header("Access-Control-Allow-Origin", request.getHeaders().getOrigin().orElse("*"));
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin");
            response.header("Access-Control-Max-Age", "3600");
            response.header("Access-Control-Allow-Credentials", "true");
            return Publishers.just(response);
        }

        return Publishers.map(chain.proceed(request), response -> {
            response.header("Access-Control-Allow-Origin", request.getHeaders().getOrigin().orElse("*"));
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin");
            response.header("Access-Control-Allow-Credentials", "true");
            return response;
        });
    }
}
