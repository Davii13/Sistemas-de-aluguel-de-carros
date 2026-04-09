import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // States do CRUD de clientes original
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' });
  const [rendimentos, setRendimentos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      carregarClientes();
    }
  }, [navigate]);

  const carregarClientes = async () => {
    try {
      const res = await fetch('http://localhost:8081/clientes');
      const data = await res.json();
      setClientes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAdicionarRenda = () => {
    if (rendimentos.length >= 3) return alert('Máximo de 3 fontes de renda permitidas.');
    setRendimentos([...rendimentos, { fonte: '', valor: '' }]);
  };

  const updateRenda = (index, field, value) => {
    const newRendimentos = [...rendimentos];
    newRendimentos[index][field] = value;
    setRendimentos(newRendimentos);
  };

  const removeRenda = (index) => {
    const newRendimentos = rendimentos.filter((_, i) => i !== index);
    setRendimentos(newRendimentos);
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    const { id, ...restData } = formData;
    const payload = { ...restData, rendimentos: rendimentos.map(r => ({ fonte: r.fonte, valor: parseFloat(r.valor) || 0 })) };
    
    const url = formData.id ? `http://localhost:8081/clientes/${formData.id}` : 'http://localhost:8081/clientes';
    const method = formData.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao salvar cliente');
      
      setFormData({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' });
      setRendimentos([]);
      carregarClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const editarCliente = async (id) => {
    const res = await fetch(`http://localhost:8081/clientes/${id}`);
    const cliente = await res.json();
    setFormData({ id: cliente.id, nome: cliente.nome, cpf: cliente.cpf, rg: cliente.rg, endereco: cliente.endereco, profissao: cliente.profissao });
    setRendimentos(cliente.rendimentos || []);
  };

  const excluirCliente = async (id) => {
    if (confirm('Deseja excluir este cliente?')) {
      await fetch(`http://localhost:8081/clientes/${id}`, { method: 'DELETE' });
      carregarClientes();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="topbar">
        <div className="topbar-brand font-racing">LOCALIZA X</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{color: 'var(--text-muted)'}}>Olá, <strong style={{color: '#fff'}}>{user?.nome || 'Usuário'}</strong></span>
          <button onClick={handleLogout} className="btn-secondary" style={{padding: '0.5rem 1rem'}}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
          <div>
            <h1 className="section-title font-racing">Modelos em Destaque</h1>
            <p style={{color: 'var(--text-muted)'}}>Explore a frota de luxo disponível para os clientes.</p>
          </div>
        </div>

        {/* Mock Car Grid - Estilo Localiza Luxo */}
        <div className="grid-cars">
          {[
            { name: "Porsche 911 Carrera", type: "Esportivo", price: "1200", img: "https://images.unsplash.com/photo-1503376713204-71620a2cc4c9?auto=format&fit=crop&w=600&q=80" },
            { name: "Audi R8 V10", type: "Supercarro", price: "1500", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80" },
            { name: "Mercedes AMG GT", type: "Esportivo", price: "1350", img: "https://images.unsplash.com/photo-1618843479313-40f8ceb4b68b?auto=format&fit=crop&w=600&q=80" },
            { name: "BMW M4 Competition", type: "Coupé", price: "950", img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&q=80" }
          ].map((car, idx) => (
            <div key={idx} className="glass-card">
              <img src={car.img} alt={car.name} className="car-image" />
              <div className="car-info">
                <h3 className="font-racing" style={{fontSize: '1.4rem'}}>{car.name}</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>{car.type}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem'}}>R$ {car.price}<small style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>/dia</small></span>
                  <button className="btn-secondary" style={{padding: '0.4rem 0.8rem'}}>Detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr style={{borderColor: 'var(--glass-border)', margin: '3rem 0'}} />

        {/* CRUD INTEGRADOR */}
        <h1 className="section-title font-racing">Gestão de Clientes</h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Mantenha o portfólio de clientes que alugam os veículos (integrado com o Micronaut).</p>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
          {/* Form */}
          <div className="glass-panel" style={{padding: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem'}}>Formulário de Cadastro</h3>
            <form onSubmit={handleSubmitCliente}>
              <div className="input-group">
                <input required type="text" className="input-field" placeholder="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className="input-group"><input required type="text" className="input-field" placeholder="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                <div className="input-group"><input type="text" className="input-field" placeholder="RG" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} /></div>
              </div>
              <div className="input-group">
                <input type="text" className="input-field" placeholder="Endereço" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} />
              </div>
              <div className="input-group">
                <input type="text" className="input-field" placeholder="Profissão" value={formData.profissao} onChange={e => setFormData({...formData, profissao: e.target.value})} />
              </div>

              <div style={{marginTop: '2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h4 style={{color: 'var(--primary)'}}>Rendimentos</h4>
                <button type="button" onClick={handleAdicionarRenda} className="btn-secondary" style={{padding: '0.3rem 0.6rem', fontSize: '0.8rem'}}><Plus size={14}/> Adicionar</button>
              </div>

              {rendimentos.map((r, i) => (
                <div key={i} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center'}}>
                  <input required placeholder="Fonte" className="input-field" value={r.fonte} onChange={e => updateRenda(i, 'fonte', e.target.value)} style={{marginBottom: 0}} />
                  <input required placeholder="Valor R$" className="input-field" type="number" step="0.01" value={r.valor} onChange={e => updateRenda(i, 'valor', e.target.value)} style={{marginBottom: 0, width: '120px'}} />
                  <button type="button" onClick={() => removeRenda(i)} className="btn-danger" style={{padding: '0.6rem'}}><Trash2 size={16}/></button>
                </div>
              ))}

              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
                {formData.id ? 'Atualizar Cliente' : 'Salvar Novo Cliente'}
              </button>
              {formData.id && (
                <button type="button" onClick={() => { setFormData({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' }); setRendimentos([]); }} className="btn-secondary" style={{width: '100%', marginTop: '0.5rem'}}>
                  Cancelar Edição
                </button>
              )}
            </form>
          </div>

          {/* Table */}
          <div className="glass-panel" style={{padding: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem'}}>Lista de Clientes Internos</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Rendimentos Informados</th>
                    <th style={{textAlign: 'right'}}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cli => (
                    <tr key={cli.id}>
                      <td style={{fontWeight: '500'}}>{cli.nome}</td>
                      <td>{cli.cpf}</td>
                      <td>
                        {cli.rendimentos && cli.rendimentos.length > 0 ? (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                            {cli.rendimentos.map((r, idx) => (
                              <span key={idx} style={{fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px'}}>
                                {r.fonte}: <strong style={{color: 'var(--primary)'}}>R$ {r.valor}</strong>
                              </span>
                            ))}
                          </div>
                        ) : <span style={{color: 'var(--text-muted)'}}>Nenhum</span>}
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => editarCliente(cli.id)} className="btn-secondary" style={{padding: '0.4rem', marginRight: '0.5rem'}}><Edit size={16}/></button>
                        <button onClick={() => excluirCliente(cli.id)} className="btn-danger" style={{padding: '0.4rem'}}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {clientes.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Nenhum cliente cadastrado ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
