import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Fleet() {
  const [automoveis, setAutomoveis] = useState([]);
  const [carFormData, setCarFormData] = useState({ id: '', marca: '', modelo: '', ano: '', matricula: '', placa: '', imagemUrl: '', tipoProprietario: 'EMPRESA' });
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);

  useEffect(() => {
    loadAutomoveis();
  }, []);

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
    
    // FIX BUG: DO NOT SEND EMPTY ID IF NEW CAR. INSTEAD PARSE PROPERLY.
    const { id, ...data } = carFormData;
    let url = 'http://localhost:8081/api/automoveis';
    let method = 'POST';
    
    // Build payload parsing strings to integers when needed
    const payload = {
        ...data,
        ano: parseInt(data.ano) || 2024
    };

    if (id !== '') {
        url = `http://localhost:8081/api/automoveis/${id}`;
        method = 'PUT';
    }

    try {
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      if (res.ok) {
        setIsCarModalOpen(false);
        loadAutomoveis();
      } else {
        alert("Falha na formatação da Requisição para registrar o automóvel.");
      }
    } catch(e) { alert("Erro ao salvar veículo: " + e.message); }
  };

  const excluirCarro = async (id) => {
    if (confirm('Deseja aposentar definitivamente este veículo da frota VIP?')) {
      await fetch(`http://localhost:8081/api/automoveis/${id}`, { method: 'DELETE' });
      loadAutomoveis();
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="font-outfit section-title mb-0">Frota <span className="text-gold">Operacional</span> Premium</h1>
           <p className="section-subtitle mt-2">Inventário global, aquisições e manutenção do parque de veículos.</p>
        </div>
        <button className="btn-primary" onClick={() => openCarModal()}>
          <Plus size={20} className="mr-2 inline" /> Cadastrar Nova Viatura
        </button>
      </div>

      <div className="grid-cars">
        {automoveis.map(car => (
           <div key={car.id} className="car-card">
              <div className="car-image-container">
                <img src={car.imagemUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} alt={car.modelo} className="car-image group-hover-scale" />
                <div className="absolute top-2 right-2 flex gap-1 bg-black/70 p-1.5 rounded-lg backdrop-blur-md">
                  <button onClick={() => openCarModal(car)} className="action-btn" title="Editar Setup"><Edit size={16}/></button>
                  <button onClick={() => excluirCarro(car.id)} className="action-btn text-danger ml-1" title="Aposentar Viatura"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="car-details" style={{padding: '1.2rem 1.5rem'}}>
                <div className="car-header mb-1">
                  <span className="car-brand" style={{fontSize: '0.8rem'}}>{car.marca}</span>
                  <span className="badge badge-pending text-xs">{car.tipoProprietario}</span>
                </div>
                <h3 className="font-outfit text-xl font-bold">{car.modelo}</h3>
                <div className="flex gap-3 mt-3 text-sm text-muted">
                  <span>Ano: {car.ano}</span> 
                  <span><span className="text-gold">MAT:</span> {car.matricula}</span> 
                  <span><span className="text-gold">PLC:</span> {car.placa}</span>
                </div>
              </div>
           </div>
        ))}
        {automoveis.length === 0 && <div className="text-muted w-full mt-10">A frota está vazia. Adicione novas viaturas.</div>}
      </div>

      {/* MODAL VEÍCULOS */}
      {isCarModalOpen && (
        <div className="modal-overlay">
           <div className="modal-content glass-panel bounce-in" style={{maxWidth: '650px'}}>
             <div className="modal-header border-b border-dark mb-5 pb-4">
                <h2 className="font-outfit text-gold">{carFormData.id ? 'Tuning e Manutenção' : 'Incorporação de Veículo'}</h2>
                <button className="modal-close" onClick={() => setIsCarModalOpen(false)}>✕</button>
             </div>
             <form onSubmit={submitCarro}>
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                 <div className="input-group">
                   <label className="input-label">Fabricante / Marca</label>
                   <input required type="text" className="input-field" value={carFormData.marca} onChange={e=>setCarFormData({...carFormData, marca: e.target.value})} placeholder="Ex: Porsche" />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Modelo Executivo</label>
                   <input required type="text" className="input-field" value={carFormData.modelo} onChange={e=>setCarFormData({...carFormData, modelo: e.target.value})} placeholder="Ex: 911 Carrera S" />
                 </div>
               </div>
               
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1rem'}}>
                 <div className="input-group">
                   <label className="input-label">Ano de Fabricação</label>
                   <input required type="number" className="input-field" value={carFormData.ano} onChange={e=>setCarFormData({...carFormData, ano: e.target.value})} placeholder="Ex: 2024" />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Identificador (Matrícula)</label>
                   <input required type="text" className="input-field" value={carFormData.matricula} onChange={e=>setCarFormData({...carFormData, matricula: e.target.value})} placeholder="Ex: P-911-S" />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Placa de Trânsito</label>
                   <input required type="text" className="input-field" value={carFormData.placa} onChange={e=>setCarFormData({...carFormData, placa: e.target.value})} placeholder="Ex: RIO2A24" />
                 </div>
               </div>
               
               <div className="input-group mt-4">
                 <label className="input-label">URL da Fotografia de Alta Resolução</label>
                 <input type="text" className="input-field" placeholder="https://images.unsplash.com/..." value={carFormData.imagemUrl} onChange={e=>setCarFormData({...carFormData, imagemUrl: e.target.value})} />
               </div>

               <div className="input-group mt-4 mb-2">
                 <label className="input-label">Responsabilidade Cívil (Investidor)</label>
                 <select className="input-field custom-select" value={carFormData.tipoProprietario} onChange={e=>setCarFormData({...carFormData, tipoProprietario: e.target.value})}>
                    <option value="EMPRESA">Frota Interna Localiza Premium</option>
                    <option value="BANCO">Consórcio Financeiro (Banco)</option>
                    <option value="CLIENTE">Terceirização VIP (Cliente)</option>
                 </select>
               </div>

               <div className="flex gap-4 mt-8">
                 <button type="submit" className="btn-primary flex-1">{carFormData.id ? 'Salvar Configuração' : 'Concluir Aquisição'}</button>
                 <button type="button" onClick={() => setIsCarModalOpen(false)} className="btn-secondary px-8">Abortar</button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
