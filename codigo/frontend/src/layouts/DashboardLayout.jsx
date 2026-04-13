import { LogOut, Car, ClipboardList, Users, Home } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
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

  if (!user) return <div className="loader">Carregando...</div>;

  const isAgent = user.tipoPerfil === 'AGENTE';

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand font-outfit">LOCALIZA <span className="text-gold">PREMIUM</span></div>
        
        <div className="sidebar-user-card">
          <div className="user-avatar">{user.nome.charAt(0)}</div>
          <div className="user-info">
             <span className="user-role">{isAgent ? 'Agente Administrativo' : 'Cliente VIP'}</span>
             <strong className="user-name">{user.nome}</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {isAgent ? (
            <>
              <NavLink to="/app/admin/requests" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <ClipboardList size={18} /> Apólices Pendentes
              </NavLink>
              <NavLink to="/app/admin/clients" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <Users size={18} /> Base de Clientes
              </NavLink>
              <NavLink to="/app/admin/fleet" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <Car size={18} /> Frota Premium
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/app/catalog" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <Home size={18} /> Catálogo de Veículos
              </NavLink>
              <NavLink to="/app/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <ClipboardList size={18} /> Minhas Locações
              </NavLink>
              <NavLink to="/app/profile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <Users size={18} /> Meu Perfil
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
