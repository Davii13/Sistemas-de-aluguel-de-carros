package br.gestao.config;

import br.gestao.enums.Role;
import br.gestao.enums.TipoAgente;
import br.gestao.enums.TipoProprietario;
import br.gestao.model.Agente;
import br.gestao.model.Automovel;
import br.gestao.model.Usuario;
import br.gestao.repository.AgenteRepository;
import br.gestao.repository.AutomovelRepository;
import br.gestao.repository.UsuarioRepository;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.runtime.server.event.ServerStartupEvent;
import jakarta.inject.Singleton;

@Singleton
public class StartupListener implements ApplicationEventListener<ServerStartupEvent> {

    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;
    private final UsuarioRepository usuarioRepository;

    public StartupListener(AutomovelRepository automovelRepository, AgenteRepository agenteRepository, UsuarioRepository usuarioRepository) {
        this.automovelRepository = automovelRepository;
        this.agenteRepository = agenteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void onApplicationEvent(ServerStartupEvent event) {
        if (automovelRepository.count() == 0) {
            Automovel c1 = new Automovel();
            c1.setMarca("Porsche");
            c1.setModelo("911 Carrera");
            c1.setAno(2023);
            c1.setMatricula("POR-911");
            c1.setPlaca("LXC-0911");
            c1.setImagemUrl("https://images.unsplash.com/photo-1503376713204-71620a2cc4c9?auto=format&fit=crop&w=600&q=80");
            c1.setTipoProprietario(TipoProprietario.EMPRESA);
            automovelRepository.save(c1);

            Automovel c2 = new Automovel();
            c2.setMarca("Audi");
            c2.setModelo("R8 V10");
            c2.setAno(2022);
            c2.setMatricula("AUD-R8");
            c2.setPlaca("LXC-0008");
            c2.setImagemUrl("https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80");
            c2.setTipoProprietario(TipoProprietario.BANCO);
            automovelRepository.save(c2);

            Automovel c3 = new Automovel();
            c3.setMarca("Mercedes");
            c3.setModelo("AMG GT");
            c3.setAno(2024);
            c3.setMatricula("MER-AMG");
            c3.setPlaca("LXC-1010");
            c3.setImagemUrl("https://images.unsplash.com/photo-1618843479313-40f8ceb4b68b?auto=format&fit=crop&w=600&q=80");
            c3.setTipoProprietario(TipoProprietario.CLIENTE);
            automovelRepository.save(c3);
        }

        if (agenteRepository.count() == 0) {
            Usuario u = new Usuario();
            u.setNome("Agente Admin");
            u.setEmail("admin@localiza.com");
            u.setSenha("1234");
            u.setTipoPerfil(Role.AGENTE);
            
            Agente a = new Agente();
            a.setNome("Banco Itaú Premium");
            a.setCnpj("00.000.000/0001-91");
            a.setTipoAgente(TipoAgente.BANCO);
            a.setUsuario(u);
            agenteRepository.save(a);
        }
    }
}
