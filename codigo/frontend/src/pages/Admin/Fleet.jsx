import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function Fleet() {
  const { showNotification } = useNotification();
  const [automoveis, setAutomoveis] = useState([]);
  const [carFormData, setCarFormData] = useState({ 
    id: '', 
    marca: '', 
    modelo: '', 
    ano: '', 
    matricula: '', 
    placa: '', 
    imagemUrl: '', 
    tipoProprietario: 'EMPRESA', 
    valorDiaria: '',
    proprietarioId: '' 
  });
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  
  // States for custom Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    loadAutomoveis();
  }, []);

  const loadAutomoveis = async () => {
    console.log("Buscando frota...");
    try {
      const res = await fetch('http://localhost:8081/api/automoveis');
      if (res.ok) {
        const data = await res.json();
        setAutomoveis(data);
        console.log("Frota carregada:", data);
      }
    } catch (e) { console.error("Erro ao carregar frota:", e); }
  };

  const openCarModal = (car = null) => {
    console.log("Abrindo modal para:", car ? "EDIÇÃO" : "NOVO");
    if (car) {
      setCarFormData({ 
        id: car.id, 
        marca: car.marca || '', 
        modelo: car.modelo || '', 
        ano: car.ano || '', 
        matricula: car.matricula || '', 
        placa: car.placa || '', 
        imagemUrl: car.imagemUrl || '', 
        tipoProprietario: car.tipoProprietario || 'EMPRESA', 
        valorDiaria: car.valorDiaria || '',
        proprietarioId: car.proprietarioId || ''
      });
    } else {
      setCarFormData({ 
        id: '', 
        marca: '', 
        modelo: '', 
        ano: '', 
        matricula: '', 
        placa: '', 
        imagemUrl: '', 
        tipoProprietario: 'EMPRESA', 
        valorDiaria: '',
        proprietarioId: ''
      });
    }
    setIsCarModalOpen(true);
  };

  const submitCarro = async (e) => {
    e.preventDefault();
    console.log("Submetendo formulário:", carFormData);
    
    const { id, ...data } = carFormData;
    let url = 'http://localhost:8081/api/automoveis';
    let method = 'POST';
    
    // Payload robusto
    const payload = {
        ...data,
        id: id || undefined,
        ano: parseInt(data.ano) || 2024,
        valorDiaria: parseFloat(data.valorDiaria) || 0.0,
        proprietarioId: data.proprietarioId ? parseInt(data.proprietarioId) : null
    };

    if (id !== '') {
        url = `http://localhost:8081/api/automoveis/${id}`;
        method = 'PUT';
    }

    try {
      console.log(`Chamando API: ${method} ${url}`);
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) {
        showNotification('Sucesso', 'Veículo atualizado com sucesso na frota premium.', 'success');
        setIsCarModalOpen(false);
        loadAutomoveis();
      } else {
        const errText = await res.text();
        console.error("Erro na resposta da API:", errText);
        showNotification('Erro na Operação', "Falha ao salvar veículo: " + errText, 'error');
      }
    } catch(e) { 
      console.error("Erro de conexão:", e);
      showNotification('Erro de Rede', "Erro ao conectar com o servidor: " + e.message, 'error'); 
    }
  };

  const confirmarExclusao = (car) => {
    setCarToDelete(car);
    setIsDeleteModalOpen(true);
  };

  const handleExcluir = async () => {
    if (!carToDelete) return;
    console.log("Executando exclusão confirmada do ID:", carToDelete.id);
    try {
      const res = await fetch(`http://localhost:8081/api/automoveis/${carToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
         showNotification('Viatura Aposentada', 'O veículo foi removido da frota com sucesso.', 'success');
         setIsDeleteModalOpen(false);
         setCarToDelete(null);
         loadAutomoveis();
      } else {
         const errText = await res.text();
         console.error("Erro ao excluir:", errText);
         showNotification('Restrição de Exclusão', "Não foi possível excluir o veículo. Verifique se ele possui aluguéis ativos.", 'error');
      }
    } catch (e) {
      console.error("Erro de conexão ao excluir:", e);
      showNotification('Erro de Sistema', "Erro ao conectar com o servidor.", 'error');
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
              <div className="car-image-container" style={{position: 'relative'}}>
                <img src={car.imagemUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'} alt={car.modelo} className="car-image" />
                
                <div 
                  className="absolute top-2 right-2 flex gap-1 bg-black/80 p-2 rounded-lg backdrop-blur-md"
                  style={{ zIndex: 10, cursor: 'default' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); openCarModal(car); }} 
                    className="action-btn" 
                    title="Editar Setup"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); confirmarExclusao(car); }} 
                    className="action-btn text-danger" 
                    title="Aposentar Viatura"
                    style={{ background: 'rgba(201, 64, 64, 0.1)', marginLeft: '8px' }}
                  >
                    <Trash2 size={18}/>
                  </button>
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
                  <span><span className="text-gold">DIÁRIA:</span> R$ {car.valorDiaria?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
           </div>
        ))}
      </div>

      {/* MODAL VEÍCULOS (Cadastro/Edição) */}
      {isCarModalOpen && (
        <div className="modal-overlay" style={{zIndex: 1000}}>
           <div className="modal-content glass-panel bounce-in" style={{maxWidth: '650px'}}>
             <div className="modal-header border-b border-dark mb-5 pb-4">
                <h2 className="font-outfit text-gold">{carFormData.id ? 'Tuning e Manutenção' : 'Incorporação de Veículo'}</h2>
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
               
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1rem'}}>
                 <div className="input-group">
                   <label className="input-label">Ano</label>
                   <input required type="number" className="input-field" value={carFormData.ano} onChange={e=>setCarFormData({...carFormData, ano: e.target.value})} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Diária (R$)</label>
                   <input required type="number" step="0.01" className="input-field" value={carFormData.valorDiaria} onChange={e=>setCarFormData({...carFormData, valorDiaria: e.target.value})} />
                 </div>
                 <div className="input-group">
                   <label className="input-label">Placa</label>
                   <input required type="text" className="input-field" value={carFormData.placa} onChange={e=>setCarFormData({...carFormData, placa: e.target.value})} />
                 </div>
               </div>
               
               <div className="input-group mt-4">
                 <label className="input-label">Matrícula</label>
                 <input required type="text" className="input-field" value={carFormData.matricula} onChange={e=>setCarFormData({...carFormData, matricula: e.target.value})} />
               </div>

               <div className="input-group mt-4">
                 <label className="input-label">URL da Fotografia</label>
                 <input type="text" className="input-field" value={carFormData.imagemUrl} onChange={e=>setCarFormData({...carFormData, imagemUrl: e.target.value})} />
               </div>

               <div className="flex gap-4 mt-8">
                 <button type="submit" className="btn-primary flex-1">{carFormData.id ? 'Salvar Alterações' : 'Concluir Aquisição'}</button>
                 <button type="button" onClick={() => setIsCarModalOpen(false)} className="btn-secondary px-8">Abortar</button>
               </div>
             </form>
           </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" style={{zIndex: 1100}}>
          <div className="modal-content glass-panel bounce-in" style={{maxWidth: '450px', textAlign: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
              <div style={{background: 'rgba(201, 64, 64, 0.1)', padding: '1rem', borderRadius: '50%'}}>
                <AlertTriangle size={48} className="text-danger" />
              </div>
            </div>
            <h2 className="font-outfit text-xl font-bold mb-2">Aposentar Viatura?</h2>
            <p className="text-muted mb-8">
              Você está prestes a remover o <span className="text-white font-bold">{carToDelete?.marca} {carToDelete?.modelo}</span> da frota premium. Esta ação é irreversível.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleExcluir} 
                className="btn-primary flex-1" 
                style={{background: 'linear-gradient(135deg, #c94040 0%, #8a2b2b 100%)', boxShadow: '0 4px 20px rgba(201, 64, 64, 0.25)'}}
              >
                Confirmar Exclusão
              </button>
              <button 
                onClick={() => { setIsDeleteModalOpen(false); setCarToDelete(null); }} 
                className="btn-secondary flex-1"
              >
                Manter Viatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
