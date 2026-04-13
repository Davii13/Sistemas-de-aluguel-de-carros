import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Car } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      if (!res.ok) {
        throw new Error('Não foi possível realizar o cadastro. Tente outro e-mail.');
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
      <div className="glass-panel auth-box">
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
           <Car size={56} className="text-gold" />
        </div>
        <h1 className="auth-title font-outfit text-gold" style={{textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '800'}}>NOVO ACESSO</h1>
        <p className="auth-subtitle" style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem'}}>Crie sua conta no sistema premium</p>

        {error && <div style={{color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">Nome Completo</label>
            <div style={{position: 'relative'}}>
              <User size={20} style={{position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)'}} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Seu Nome" 
                style={{paddingLeft: '40px'}}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

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

          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem', fontSize: '1.1rem'}}>
            Registrar e Entrar
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)'}}>
          Já possui conta? <Link to="/login" style={{color: 'var(--primary-gold)', textDecoration: 'none', fontWeight: 'bold'}}>Faça Login</Link>
        </p>
      </div>
    </div>
  );
}
