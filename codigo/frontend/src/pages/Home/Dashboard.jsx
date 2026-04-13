import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AgentDashboard from './AgentDashboard';
import ClientDashboard from './ClientDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <div style={{color: 'white', padding: '2rem'}}>Carregando...</div>;

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand font-racing">LOCALIZA <span>PREMIUM</span></div>
        <div className="navbar-user">
          <div className="navbar-user-info">
            <span>{user.tipoPerfil === 'AGENTE' ? 'Modo Visão' : 'Bem-vindo'}</span>
            <strong>{user.tipoPerfil === 'AGENTE' ? 'Agente Administrativo' : user.nome}</strong>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </nav>

      <main className="main-content">
        {user.tipoPerfil === 'AGENTE' ? (
          <AgentDashboard user={user} />
        ) : (
          <ClientDashboard user={user} />
        )}
      </main>
    </div>
  );
}
