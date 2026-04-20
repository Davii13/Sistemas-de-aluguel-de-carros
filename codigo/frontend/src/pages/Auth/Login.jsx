import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Car } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!res.ok) {
        throw new Error('E-mail ou senha inválidos.');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-box">
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
           <img src="/logo-premium.png" alt="Classe A Drive" style={{width: '140px', mixBlendMode: 'screen', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'}} />
        </div>
        <h1 className="auth-title text-gold" style={{textAlign: 'center', fontSize: '2.4rem', marginBottom: '0.3rem', letterSpacing: '1px', textShadow: '0 4px 20px rgba(212,175,55,0.25)'}}>Classe A Drive</h1>
        <p className="auth-subtitle" style={{textAlign: 'center', fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.72rem'}}>Aluguel de Veículos de Luxo</p>

        {error && <div style={{color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">E-mail</label>
            <div style={{position: 'relative'}}>
              <Mail size={20} style={{position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)'}} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="exemplo@email.com" 
                style={{paddingLeft: '40px'}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Senha</label>
            <div style={{position: 'relative'}}>
              <Lock size={20} style={{position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)'}} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••" 
                style={{paddingLeft: '40px'}}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem', fontSize: '1rem', letterSpacing: '2px'}}>
            Acessar Sistema
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)'}}>
          Ainda não tem conta? <Link to="/register" style={{color: 'var(--primary-gold)', textDecoration: 'none', fontWeight: 'bold'}}>Registre-se</Link>
        </p>
      </div>
    </div>
  );
}
