import { useState, useEffect } from 'react';
import { Calendar, KeyRound, ShieldCheck, Play } from 'lucide-react';

export default function ClientDashboard({ user }) {
  const [automoveis, setAutomoveis] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'orders'

  useEffect(() => {
    loadAutomoveis();
    loadPedidos();
  }, []);

  const loadAutomoveis = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/automoveis');
      if (res.ok) {
        setAutomoveis(await res.json());
      }
    } catch (e) { console.error(e); }
  };

  const loadPedidos = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/pedidos');
      if (res.ok) {
        const data = await res.json();
        setPedidos(data.filter(p => p.clienteId === user.id));
      }
    } catch (e) { console.error(e); }
  };

  const openForm = (carId) => {
    setSelectedCarId(carId);
    setIsModalOpen(true);
  };

  const submitPedido = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8081/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automovelId: selectedCarId,
          clienteId: user.id,
          dataInicio,
          dataFim
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setDataInicio('');
        setDataFim('');
        loadPedidos();
        setActiveTab('orders'); // Redireciona para meuts pedidos
      } else {
        throw new Error("Erro")
      }
    } catch (e) {
      alert("Houve um erro ao alugar! Desculpe.");
    }
  };

  return (
    <div>
      <div className="tabs-nav" style={{justifyContent: 'center'}}>
        <button className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
          Coleção Premium
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          Meus Aluguéis
        </button>
      </div>

      {activeTab === 'catalog' && (
        <>
          <section className="hero-section">
             <h1 className="hero-title font-racing">A RUA É SUA.</h1>
             <p className="hero-subtitle">
                Experimente o ápice da engenharia automotiva. Nossa coleção premium de veículos
                foi selecionada para proporcionar elegância, conforto e performance inigualáveis.
             </p>
             <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', color: 'var(--text-muted)'}}>
                <div style={{display: 'flex', alignItem: 'center', gap: '0.5rem'}}><ShieldCheck color="var(--primary)"/> Seguro Total</div>
                <div style={{display: 'flex', alignItem: 'center', gap: '0.5rem'}}><KeyRound color="var(--primary)"/> Pegue e Leve</div>
             </div>
          </section>

          <div className="grid-cars">
            {automoveis.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-image-container">
                  <img src={car.imagemUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} alt={car.modelo} className="car-image" />
                </div>
                <div className="car-details">
                  <div className="car-header">
                    <span className="car-brand">{car.marca}</span>
                    <span style={{fontSize: '0.8rem', padding: '2px 8px', background:'rgba(212,175,55,0.1)', color:'var(--primary)', borderRadius:'4px', fontWeight:'bold'}}>2024</span>
                  </div>
                  <h3 className="car-model font-racing">{car.modelo}</h3>
                  <div className="car-meta">
                    <div className="car-meta-item"><KeyRound size={16}/> {car.matricula}</div>
                  </div>
                  <div className="car-footer">
                    <div className="car-price">Diária <span>sob consulta</span></div>
                    <button onClick={() => openForm(car.id)} className="btn-primary" style={{padding: '0.6rem 1.2rem'}}>
                      Alugar <Play size={16} fill="black" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h1 className="font-racing" style={{fontSize: '2.5rem', marginBottom: '2rem'}}>Seus Aluguéis</h1>
          <div className="table-wrapper glass-panel" style={{padding: '1rem'}}>
            <table>
              <thead>
                <tr>
                  <th>Contrato Oficial</th>
                  <th>Veículo Designado</th>
                  <th>Período Contratado</th>
                  <th>Status de Liberação</th>
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
                  </tr>
                ))}
                {pedidos.length === 0 && <tr><td colSpan="4" style={{textAlign:'center', color:'var(--text-muted)'}}>Você ainda não experimentou nosso catálogo.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
             <div className="modal-header">
                <h2 className="modal-title font-racing">Solicitação de Reserva</h2>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
             </div>
             <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
                Insira as datas para agendarmos a entrega VIP do seu veículo. Seus rendimentos cadastrados serão validados.
             </p>
            <form onSubmit={submitPedido}>
              <div className="input-group">
                <label className="input-label"><Calendar size={16} style={{display:'inline', marginRight:'4px'}}/> Início da Jornada</label>
                <input required type="date" className="input-field" value={dataInicio} onChange={e=>setDataInicio(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label"><Calendar size={16} style={{display:'inline', marginRight:'4px'}}/> Data de Devolução</label>
                <input required type="date" className="input-field" value={dataFim} onChange={e=>setDataFim(e.target.value)} />
              </div>
              <div style={{marginTop: '2rem'}}>
                <button type="submit" className="btn-primary" style={{width: '100%', marginBottom:'0.8rem'}}>Confirmar Intenção de Aluguel</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{width: '100%'}}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
