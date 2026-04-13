package br.gestao.controller;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import br.gestao.dto.LoginRequest;
import br.gestao.dto.RegisterRequest;
import br.gestao.dto.AuthResponse;
import br.gestao.model.Cliente;
import br.gestao.model.Usuario;
import br.gestao.repository.ClienteRepository;
import br.gestao.repository.UsuarioRepository;
import jakarta.inject.Inject;
import java.util.Optional;
import java.util.UUID;

@Controller("/auth")
public class AuthController {

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    ClienteRepository clienteRepository;

    @Post("/register")
    public HttpResponse<?> register(@Body RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return HttpResponse.badRequest("E-mail já está em uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(request.getSenha()); // Em um sistema real, usaríamos bcrypt
        
        Cliente cliente = new Cliente();
        cliente.setNome(usuario.getNome());
        cliente.setUsuario(usuario);
        
        cliente = clienteRepository.save(cliente);

        // Geramos um pseudo-token para demonstrar a API
        String token = UUID.randomUUID().toString();
        
        return HttpResponse.ok(new AuthResponse(token, cliente.getUsuario()));
    }

    @Post("/login")
    public HttpResponse<?> login(@Body LoginRequest request) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent() && userOpt.get().getSenha().equals(request.getSenha())) {
            String token = UUID.randomUUID().toString();
            return HttpResponse.ok(new AuthResponse(token, userOpt.get()));
        }
        
        return HttpResponse.unauthorized();
    }
}
