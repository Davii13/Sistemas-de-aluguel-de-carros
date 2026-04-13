import { useState, useEffect } from 'react';
import { ShieldCheck, KeyRound, Play, Calendar } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function Catalog() {
  const { user } = useOutletContext();
  const [automoveis, setAutomoveis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    loadAutomoveis();
  }, []);

  const loadAutomoveis = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/automoveis');
      if (res.ok) setAutomoveis(await res.json());
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
        alert("Reserva efetuada. Aguarde avaliação.");
      } else {
        throw new Error("Erro");
      }
    } catch (e) {
      alert("Houve um erro ao alugar! Desculpe.");
    }
  };

  return (
    <div className="fade-in">
      <section className="hero-section">
         <h1 className="hero-title font-outfit">A RUA É <span className="text-gold">SUA.</span></h1>
         <p className="hero-subtitle">
            Experimente o ápice da engenharia automotiva. Nossa coleção premium de veículos
            foi selecionada para proporcionar elegância, conforto e performance inigualáveis.
         </p>
         <div className="hero-features">
            <div><ShieldCheck /> Seguro Total Inluso</div>
            <div><KeyRound /> Pegue e Leve Vip</div>
         </div>
      </section>

      <div className="grid-cars">
        {automoveis.map((car) => (
          <div key={car.id} className="car-card premium-hover">
            <div className="car-image-container">
              <img src={car.imagemUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} alt={car.modelo} className="car-image" />
            </div>
            <div className="car-details">
              <div className="car-header">
                <span className="car-brand">{car.marca}</span>
                <span className="car-year">{car.ano}</span>
              </div>
              <h3 className="car-model font-outfit">{car.modelo}</h3>
              <div className="car-meta">
                <span>MAT: {car.matricula}</span> • <span>PLC: {car.placa}</span>
              </div>
              <div className="car-footer">
                <div className="car-price">Diária <span>sob consulta</span></div>
                <button onClick={() => openForm(car.id)} className="btn-primary">
                  Alugar <Play size={16} fill="black" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel bounce-in">
             <div className="modal-header">
                <h2 className="font-outfit text-gold">Solicitação de Reserva</h2>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
             </div>
             <p className="text-muted" style={{marginBottom: '2rem'}}>
                Insira as datas para agendarmos a entrega VIP do seu veículo. Seus rendimentos cadastrados serão validados.
             </p>
            <form onSubmit={submitPedido}>
              <div className="input-group">
                <label className="input-label"><Calendar size={16}/> Início da Jornada</label>
                <input required type="date" className="input-field" value={dataInicio} onChange={e=>setDataInicio(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label"><Calendar size={16}/> Data de Devolução</label>
                <input required type="date" className="input-field" value={dataFim} onChange={e=>setDataFim(e.target.value)} />
              </div>
              <div style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                <button type="submit" className="btn-primary">Confirmar Intenção de Aluguel</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
