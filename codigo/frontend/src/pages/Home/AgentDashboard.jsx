import { useState, useEffect } from 'react';
import { Check, X, Edit, Trash2, Plus, Car, Users, ClipboardList } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function AgentDashboard({ user }) {
  const { showNotification, showConfirmation } = useNotification();
  const [activeTab, setActiveTab] = useState('pedidos'); // pedidos, clientes, veiculos
  
  const [pedidos, setPedidos] = useState([]);
  
  // Cliente CRUD
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' });
  const [rendimentos, setRendimentos] = useState([]);

  // Veiculo CRUD
  const [automoveis, setAutomoveis] = useState([]);
  const [carFormData, setCarFormData] = useState({ id: '', marca: '', modelo: '', ano: '', matricula: '', placa: '', imagemUrl: '', tipoProprietario: 'EMPRESA' });
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);

  useEffect(() => {
    loadPedidos();
    carregarClientes();
    loadAutomoveis();
  }, []);

  // --- PEDIDOS ---
  const loadPedidos = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/pedidos');
      if (res.ok) setPedidos(await res.json());
    } catch (e) { console.error(e); }
  };

  const executarAvaliacao = async (pedidoId, aprovar) => {
    try {
      const res = await fetch(`http://localhost:8081/api/pedidos/${pedidoId}/avaliar?agenteId=${user.id}&aprovar=${aprovar}`, { method: 'POST' });
      if (res.ok) {
        showNotification('Decisão Registrada', `Contrato ${aprovar ? 'APROVADO' : 'REJEITADO'} com sucesso.`, 'success');
        loadPedidos();
      }
    } catch(e) { showNotification('Erro', 'Erro na avaliação', 'error'); }
  }

  const avaliar = async (pedidoId, aprovar) => {
    showConfirmation(
      'Avaliar Risco',
      `Deseja ${aprovar ? 'APROVAR' : 'REJEITAR'} este contrato?`,
      () => executarAvaliacao(pedidoId, aprovar)
    );
  };

  // --- CLIENTES ---
  const carregarClientes = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/clientes');
      if (res.ok) setClientes(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleAdicionarRenda = () => {
    if (rendimentos.length >= 3) return showNotification('Aviso', 'Máximo de 3 fontes de renda.', 'info');
    setRendimentos([...rendimentos, { fonte: '', valor: '' }]);
  };

  const updateRenda = (index, field, value) => {
    const newRendimentos = [...rendimentos];
    newRendimentos[index][field] = value;
    setRendimentos(newRendimentos);
  };

  const removeRenda = (index) => setRendimentos(rendimentos.filter((_, i) => i !== index));

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    const { id, ...restData } = formData;
    const payload = { ...restData, rendimentos: rendimentos.map(r => ({ fonte: r.fonte, valor: parseFloat(r.valor) || 0 })) };
    const url = formData.id ? `http://localhost:8081/api/clientes/${formData.id}` : 'http://localhost:8081/api/clientes';
    
    try {
      const res = await fetch(url, { method: formData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Erro ao salvar');
      setFormData({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' });
      setRendimentos([]);
      carregarClientes();
      showNotification('Sucesso', "Cadastro de cliente atualizado na Central.", 'success');
    } catch (err) { showNotification('Erro', err.message, 'error'); }
  };

  const editarCliente = async (id) => {
    const res = await fetch(`http://localhost:8081/api/clientes/${id}`);
    if (res.ok) {
      const cliente = await res.json();
      setFormData({ id: cliente.id, nome: cliente.nome, cpf: cliente.cpf, rg: cliente.rg, endereco: cliente.endereco, profissao: cliente.profissao });
      setRendimentos(cliente.rendimentos || []);
    }
  };

  const executarExclusaoCliente = async (id) => {
    await fetch(`http://localhost:8081/api/clientes/${id}`, { method: 'DELETE' });
    showNotification('Removido', 'Cliente excluído do sistema.', 'success');
    carregarClientes();
  }

  const excluirCliente = async (id) => {
    showConfirmation(
      'Remover Cliente?',
      'Deseja excluir as credenciais e o histórico deste cliente?',
      () => executarExclusaoCliente(id)
    );
  };

  // --- AUTOMÓVEIS ---
  const loadAutomoveis = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/automoveis');
      if (res.ok) setAutomoveis(await res.json());
    } catch (e) { console.error(e); }
  };

  const openCarModal = (car = null) => {
    if (car) {
      setCarFormData({ id: car.id, marca: car.marca, modelo: car.modelo, ano: car.ano, matricula: car.matricula, placa: car.placa, imagemUrl: car.imagemUrl, tipoProprietario: car.tipoProprietario });
    } else {
      setCarFormData({ id: '', marca: '', modelo: '', ano: '', matricula: '', placa: '', imagemUrl: '', tipoProprietario: 'EMPRESA' });
    }
    setIsCarModalOpen(true);
  };

  const submitCarro = async (e) => {
    e.preventDefault();
    const url = carFormData.id ? `http://localhost:8081/api/automoveis/${carFormData.id}` : 'http://localhost:8081/api/automoveis';
    try {
      const res = await fetch(url, { method: carFormData.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(carFormData) });
      if (res.ok) {
        setIsCarModalOpen(false);
        loadAutomoveis();
        showNotification('Sucesso', 'Veículo salvo com sucesso.', 'success');
      }
    } catch(e) { showNotification('Erro', "Erro ao salvar veículo", 'error'); }
  };

  const executarExclusaoCarro = async (id) => {
    await fetch(`http://localhost:8081/api/automoveis/${id}`, { method: 'DELETE' });
    showNotification('Sucesso', 'Veículo removido da frota.', 'success');
    loadAutomoveis();
  }

  const excluirCarro = async (id) => {
    showConfirmation(
      'Aposentar Veículo?',
      'Deseja realmente remover este veículo da frota ativa?',
      () => executarExclusaoCarro(id)
    );
  };

  return (
    <div>
      <div className="tabs-nav">
        <button className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>
          <ClipboardList size={18} style={{marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom'}}/> Apólices e Pedidos
        </button>
        <button className={`tab-btn ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>
          <Users size={18} style={{marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom'}}/> Central de Clientes
        </button>
        <button className={`tab-btn ${activeTab === 'veiculos' ? 'active' : ''}`} onClick={() => setActiveTab('veiculos')}>
          <Car size={18} style={{marginRight: '8px', display: 'inline', verticalAlign: 'text-bottom'}}/> Inventário de Veículos
        </button>
      </div>

      {activeTab === 'pedidos' && (
        <section className="fade-in">
          <h1 className="section-title font-racing" style={{fontSize: '2rem'}}>Painel de Contratos e Apólices</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem'}}>Avalie o Score Financeiro antes de emitir a apólice do aluguel.</p>

          <div className="table-wrapper glass-panel" style={{padding: '1.5rem'}}>
            <table>
              <thead>
                <tr>
                  <th>Nº Contrato</th>
                  <th>Veículo</th>
                  <th>Período Contratado</th>
                  <th>Status</th>
                  <th style={{textAlign: 'right'}}>Ação Administrativa</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id}>
                    <td style={{fontWeight: '700', color: 'var(--primary)'}}>CTX-{p.id.toString().padStart(4, '0')}</td>
                    <td style={{fontWeight: '500', fontSize: '1.1rem'}}>{p.automovelMarca} <span style={{color:'var(--text-muted)'}}>{p.automovelModelo}</span></td>
                    <td>{p.dataInicio.split('-').reverse().join('/')} ➔ {p.dataFim.split('-').reverse().join('/')}</td>
                    <td>
                      <span className={`badge ${p.status === 'APROVADO' ? 'badge-success' : p.status === 'REJEITADO' ? 'badge-danger' : 'badge-pending'}`}>
                         {p.status}
                      </span>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      {p.status === 'PENDENTE' ? (
                        <div style={{display:'flex', gap:'0.8rem', justifyContent:'flex-end'}}>
                          <button onClick={() => avaliar(p.id, true)} className="btn-secondary" style={{color:'#2ecc71', borderColor:'rgba(46, 204, 113, 0.4)'}} title="Aprovar e Gerar Contrato">
                             <Check size={16}/> Emitir
                          </button>
                          <button onClick={() => avaliar(p.id, false)} className="btn-danger" title="Negar Risco Financeiro">
                             <X size={16}/> Negar
                          </button>
                        </div>
                      ) : <span style={{color:'var(--text-muted)', fontStyle: 'italic'}}>Avaliador Finalizado</span>}
                    </td>
                  </tr>
                ))}
                {pedidos.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', color:'var(--text-muted)'}}>Nenhuma apólice requisitada hoje.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'clientes' && (
        <section className="fade-in">
           <h1 className="section-title font-racing" style={{fontSize: '2rem'}}>Gestão de Clientes e Risco</h1>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
              {/* Form de Cadastro */}
              <div className="glass-panel" style={{padding: '2rem'}}>
                <h3 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem', color: 'var(--primary)'}}>Ficha Limpa</h3>
                <form onSubmit={handleSubmitCliente}>
                  <div className="input-group"><input required type="text" className="input-field" placeholder="Nome Completo do Portador" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} /></div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div className="input-group"><input required type="text" className="input-field" placeholder="CPF Fiscal" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                    <div className="input-group"><input type="text" className="input-field" placeholder="RG Órgão" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} /></div>
                  </div>
                  <div className="input-group"><input type="text" className="input-field" placeholder="Endereço de Domicílio" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></div>
                  <div className="input-group"><input type="text" className="input-field" placeholder="Cargo/Profissão Atual" value={formData.profissao} onChange={e => setFormData({...formData, profissao: e.target.value})} /></div>
      
                  <div style={{margin: '2rem 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 style={{color: 'var(--text-main)'}}>Comprovação de Renda</h4>
                    <button type="button" onClick={handleAdicionarRenda} className="btn-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}><Plus size={14}/> Renda</button>
                  </div>
      
                  {rendimentos.map((r, i) => (
                    <div key={i} style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                      <input required placeholder="Fonte" className="input-field" value={r.fonte} onChange={e => updateRenda(i, 'fonte', e.target.value)} style={{marginBottom: 0}} />
                      <input required placeholder="Valor Oficial (R$)" className="input-field" type="number" step="0.01" value={r.valor} onChange={e => updateRenda(i, 'valor', e.target.value)} style={{marginBottom: 0, width: '150px'}} />
                      <button type="button" onClick={() => removeRenda(i)} className="btn-danger"><Trash2 size={16}/></button>
                    </div>
                  ))}
      
                  <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
                    {formData.id ? 'Atualizar Dossier' : 'Cadastrar na Central'}
                  </button>
                  {formData.id && (
                    <button type="button" onClick={() => { setFormData({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' }); setRendimentos([]); }} className="btn-secondary" style={{width: '100%', marginTop: '0.5rem'}}>Cancelar Edição</button>
                  )}
                </form>
              </div>
      
              {/* Listagem */}
              <div className="glass-panel" style={{padding: '2rem'}}>
                <h3 style={{marginBottom: '1.5rem', color: 'var(--primary)'}}>Clientes Cadastrados</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Identificação Titular</th>
                        <th>CPF Central</th>
                        <th>Patrimônio (Mês)</th>
                        <th style={{textAlign: 'right'}}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map(cli => (
                        <tr key={cli.id}>
                          <td style={{fontWeight: '600'}}>{cli.nome}</td>
                          <td style={{color: 'var(--text-muted)'}}>{cli.cpf}</td>
                          <td>
                            {cli.rendimentos && cli.rendimentos.length > 0 ? (
                              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                                {cli.rendimentos.map((r, idx) => (
                                  <span key={idx} style={{fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px'}}>
                                    {r.fonte}: <strong style={{color: '#2ecc71'}}>R$ {r.valor}</strong>
                                  </span>
                                ))}
                              </div>
                            ) : <span style={{color: 'var(--secondary)'}}>Inauditable</span>}
                          </td>
                          <td style={{textAlign: 'right'}}>
                            <button onClick={() => editarCliente(cli.id)} className="btn-secondary" style={{padding: '0.5rem', marginRight: '0.5rem'}} title="Editar"><Edit size={16}/></button>
                            <button onClick={() => excluirCliente(cli.id)} className="btn-danger" style={{padding: '0.5rem'}} title="Remover"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                      {clientes.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)'}}>Central Vazia.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </section>
      )}

      {activeTab === 'veiculos' && (
        <section className="fade-in">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem'}}>
            <div>
               <h1 className="section-title font-racing" style={{fontSize: '2rem', marginBottom: '0'}}>Frota e Veículos Operacionais</h1>
               <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem'}}>Adicione ou faça a manutenção do parque visual de carros.</p>
            </div>
            <button className="btn-primary" onClick={() => openCarModal()}>
              <Plus size={20} /> Cadastrar Nova Viatura
            </button>
          </div>

          <div className="grid-cars">
            {automoveis.map(car => (
               <div key={car.id} className="car-card">
                  <div className="car-image-container">
                    <img src={car.imagemUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} alt={car.modelo} className="car-image" />
                    <div style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '5px', borderRadius: '6px', backdropFilter: 'blur(5px)'}}>
                      <button onClick={() => openCarModal(car)} className="btn-secondary" style={{padding: '0.3rem', border: 'none', background: 'transparent'}}><Edit size={16}/></button>
                      <button onClick={() => excluirCarro(car.id)} className="btn-danger" style={{padding: '0.3rem', border: 'none', background: 'transparent', marginLeft: '5px'}}><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div className="car-details" style={{padding: '1rem 1.5rem'}}>
                    <div className="car-header">
                      <span className="car-brand" style={{fontSize: '0.8rem'}}>{car.marca}</span>
                      <span style={{fontSize: '0.75rem', padding: '2px 8px', background:'rgba(255,255,255,0.1)', borderRadius:'4px', color:'var(--text-muted)'}}>{car.tipoProprietario}</span>
                    </div>
                    <h3 className="font-racing" style={{fontSize: '1.4rem'}}>{car.modelo}</h3>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                      <span>{car.ano}</span> • <span>Matr: {car.matricula}</span> • <span>Plc: {car.placa}</span>
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL VEÍCULOS */}
      {isCarModalOpen && (
        <div className="modal-overlay" style={{zIndex: 1000}}>
           <div className="modal-content glass-panel bounce-in" style={{maxWidth: '600px'}}>
             <div className="modal-header">
                <h2 className="modal-title font-racing">{carFormData.id ? 'Manutenção do Veículo' : 'Incorporação de Veículo'}</h2>
                <button className="modal-close" onClick={() => setIsCarModalOpen(false)}>✕</button>
             </div>
             <form onSubmit={submitCarro}>
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                 <div className="input-group">
                   <label className="input-label">Fabricante / Marca</label>
                   <input required type="text" className="input-field" value={carFormData.marca} onChange={e=>setCarFormData({...carFormData, marca: e.target.value})} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Modelo Executivo</label>
                   <input required type="text" className="input-field" value={carFormData.modelo} onChange={e=>setCarFormData({...carFormData, modelo: e.target.value})} />
                 </div>
               </div>
               
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem'}}>
                 <div className="input-group">
                   <label className="input-label">Ano</label>
                   <input required type="number" className="input-field" value={carFormData.ano} onChange={e=>setCarFormData({...carFormData, ano: e.target.value})} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Matrícula</label>
                   <input required type="text" className="input-field" value={carFormData.matricula} onChange={e=>setCarFormData({...carFormData, matricula: e.target.value})} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Placa</label>
                   <input required type="text" className="input-field" value={carFormData.placa} onChange={e=>setCarFormData({...carFormData, placa: e.target.value})} />
                 </div>
               </div>
               
               <div className="input-group">
                 <label className="input-label">URL da Foto Alta Resolução</label>
                 <input type="text" className="input-field" placeholder="https://unsplash..." value={carFormData.imagemUrl} onChange={e=>setCarFormData({...carFormData, imagemUrl: e.target.value})} />
               </div>

               <div className="input-group">
                 <label className="input-label">Investidor / Proprietário</label>
                 <select className="input-field" value={carFormData.tipoProprietario} onChange={e=>setCarFormData({...carFormData, tipoProprietario: e.target.value})}>
                    <option value="EMPRESA">Frota Interna Localiza</option>
                    <option value="BANCO">Consórcio de Banco</option>
                    <option value="CLIENTE">Terceirização VIP</option>
                 </select>
               </div>

               <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                 <button type="submit" className="btn-primary" style={{flex: 1}}>{carFormData.id ? 'Salvar Edição' : 'Concluir Aquisição'}</button>
                 <button type="button" onClick={() => setIsCarModalOpen(false)} className="btn-secondary">Abortar</button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
