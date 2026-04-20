import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ShieldCheck, KeyRound, Globe, Award } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar Minimalista */}
      <nav className="landing-nav fade-in">
        <div className="landing-logo">
           <img src="/logo-premium.png" alt="Classe A" style={{mixBlendMode: 'screen'}} />
           <span className="font-brand">Classe A <span className="text-gold">Drive</span></span>
        </div>
        <div className="landing-nav-links">
           <button onClick={() => navigate('/login')} className="btn-secondary-sm">Entrar</button>
           <button onClick={() => navigate('/register')} className="btn-primary" style={{padding: '0.6rem 1.2rem'}}>Assinar Agora</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="landing-hero">
        <div className="hero-content slide-up">
           <span className="hero-tag">A EXPERIÊNCIA DEFINITIVA</span>
           <h1 className="hero-title-main font-brand">
             A ESTRADA <br />
             É O SEU <span className="text-gold">PALCO.</span>
           </h1>
           <p className="hero-desc">
             Acesse a frota mais exclusiva de veículos de luxo e alta performance. 
             Entrega VIP onde você estiver, sem burocracia, apenas a pura alegria de dirigir.
           </p>
           <div className="hero-actions">
              <button onClick={() => navigate('/register')} className="btn-primary btn-lg">
                Começar Jornada <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary btn-lg">
                Explorar Frota
              </button>
           </div>
        </div>
        
        <div className="hero-stats fade-in">
           <div className="stat-item">
              <strong>50+</strong>
              <span>Modelos Elite</span>
           </div>
           <div className="stat-item">
              <strong>100%</strong>
              <span>Seguro VIP</span>
           </div>
           <div className="stat-item">
              <strong>24h</strong>
              <span>Concierge</span>
           </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="landing-features">
         <div className="feature-card glass-panel">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Segurança Blindada</h3>
            <p>Todos os nossos veículos possuem seguro total e assistência 24h personalizada.</p>
         </div>
         <div className="feature-card glass-panel">
            <div className="feature-icon"><KeyRound size={32} /></div>
            <h3>Pegue e Leve VIP</h3>
            <p>Entregamos o veículo na porta da sua casa ou aeroporto com check-in digital.</p>
         </div>
         <div className="feature-card glass-panel">
            <div className="feature-icon"><Globe size={32} /></div>
            <h3>Disponibilidade Global</h3>
            <p>Nossa rede atende os principais centros financeiros e turísticos do país.</p>
         </div>
         <div className="feature-card glass-panel">
            <div className="feature-icon"><Award size={32} /></div>
            <h3>Padrão Ouro</h3>
            <p>Veículos higienizados e revisados nos mais altos padrões de concessionária.</p>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="landing-cta">
         <div className="cta-box glass-panel">
            <h2 className="font-brand">PRONTO PARA O PRÓXIMO NÍVEL?</h2>
            <p>Junte-se à comunidade Classe A Drive e transforme cada viagem em uma memória inesquecível.</p>
            <button onClick={() => navigate('/register')} className="btn-primary btn-lg mt-4">
               Solicitar Acesso VIP
            </button>
         </div>
      </section>

      <footer className="landing-footer">
         <p>© 2024 Classe A Drive • Private Automotive Club</p>
      </footer>
    </div>
  );
}
