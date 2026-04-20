package br.gestao.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
@Produces
public class GlobalExceptionHandler implements ExceptionHandler<RuntimeException, HttpResponse> {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Override
    public HttpResponse handle(HttpRequest request, RuntimeException exception) {
        LOG.error("Erro não tratado interceptado: {}", exception.getMessage(), exception);

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("error", true);
        errorDetails.put("status", HttpStatus.INTERNAL_SERVER_ERROR.getCode());
        errorDetails.put("message", exception.getMessage() != null ? exception.getMessage() : "Ocorreu um erro interno inesperado.");
        errorDetails.put("path", request.getPath());
        
        // Se for uma IllegalArgumentException, podemos retornar 400 em vez de 500
        if (exception instanceof IllegalArgumentException) {
            errorDetails.put("status", HttpStatus.BAD_REQUEST.getCode());
            return HttpResponse.badRequest(errorDetails);
        }

        return HttpResponse.serverError(errorDetails);
    }
}
