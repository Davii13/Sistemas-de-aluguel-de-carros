import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function Orders() {
  const { user } = useOutletContext();
  const { showNotification } = useNotification();
  const [pedidos, setPedidos] = useState([]);
  const [automoveis, setAutomoveis] = useState([]);
  
  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', automovelId: '', dataInicio: '', dataFim: '' });

  // Custom Cancel Confirmation Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [pedidoToCancelId, setPedidoToCancelId] = useState(null);

  useEffect(() => {
    loadPedidos();
    loadAutomoveis();
  }, []);

  const loadPedidos = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/pedidos');
      if (res.ok) {
        const data = await res.json();
        setPedidos(data.filter(p => p.clienteId === user.id));
      }
    } catch (e) { console.error(e); }
  };

  const loadAutomoveis = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/automoveis');
      if (res.ok) setAutomoveis(await res.json());
    } catch (e) { console.error(e); }
  };

  const openEdit = (pedido) => {
    setEditFormData({
      id: pedido.id,
      automovelId: pedido.automovelId,
      dataInicio: pedido.dataInicio,
      dataFim: pedido.dataFim
    });
    setIsEditOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8081/api/pedidos/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           clienteId: user.id,
           automovelId: editFormData.automovelId,
           dataInicio: editFormData.dataInicio,
           dataFim: editFormData.dataFim
        })
      });
      if (res.ok) {
        showNotification('Contrato Atualizado', 'Sua apólice foi modificada com sucesso.', 'success');
        setIsEditOpen(false);
        loadPedidos();
      } else {
        showNotification('Erro na Modificação', 'Não foi possível alterar seu contrato. Verifique os dados.', 'error');
      }
    } catch (e) { 
      console.error(e);
      showNotification('Erro de Sistema', 'Falha ao conectar com a central.', 'error');
    }
  };

  const solicitarCancelamento = (id) => {
    setPedidoToCancelId(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!pedidoToCancelId) return;
    try {
      const res = await fetch(`http://localhost:8081/api/pedidos/${pedidoToCancelId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Locação Cancelada', 'Sua reserva foi removida do sistema.', 'success');
        setIsCancelModalOpen(false);
        setPedidoToCancelId(null);
        loadPedidos();
      } else {
        showNotification('Erro ao Cancelar', 'Não foi possível realizar o cancelamento agora.', 'error');
      }
    } catch (e) {
      console.error(e);
      showNotification('Erro de Sistema', "Erro ao conectar com o servidor.", 'error');
    }
  };

  return (
    <div className="fade-in max-w-content">
      <h1 className="font-outfit section-title">Minhas Locações <span className="text-gold">Exclusivas</span></h1>
      <p className="section-subtitle">Gestão das suas apólices e status de entrega dos veículos.</p>

      <div className="glass-panel" style={{padding: '1.5rem', marginTop: '2rem'}}>
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Contrato Oficial</th>
                <th>Veículo Designado</th>
                <th>Período Contratado</th>
                <th>Valor Total</th>
                <th>Status de Liberação</th>
                <th style={{textAlign: 'right'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="text-gold font-bold">CTX-{p.id.toString().padStart(4, '0')}</td>
                  <td className="font-medium text-lg">{p.automovelMarca} <span className="text-muted">{p.automovelModelo}</span></td>
                  <td>{p.dataInicio.split('-').reverse().join('/')} ➔ {p.dataFim.split('-').reverse().join('/')}</td>
                  <td className="text-gold font-bold">R$ {p.valorTotal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td>
                    <span className={`badge ${p.status === 'APROVADO' ? 'badge-success' : p.status === 'REJEITADO' ? 'badge-danger' : 'badge-pending'}`}>
                       {p.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                      <button onClick={() => openEdit(p)} className="action-btn text-muted hover:text-white" title="Modificar Contrato"><Edit2 size={18}/></button>
                      <button onClick={() => solicitarCancelamento(p.id)} className="action-btn text-danger hover:text-red-400" title="Cancelar Reserva"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && <tr><td colSpan="6" className="text-center text-muted" style={{padding: '3rem'}}>Você ainda não experimentou nosso catálogo.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDITAR LOCAÇÃO */}
      {isEditOpen && (
        <div className="modal-overlay" style={{zIndex: 1000}}>
          <div className="modal-content glass-panel bounce-in">
             <div className="modal-header">
                <h2 className="font-outfit text-gold">Modificar Locação</h2>
                <button className="modal-close" onClick={() => setIsEditOpen(false)}>✕</button>
             </div>
            <form onSubmit={handleEdit}>
              <div className="input-group">
                <label className="input-label">Mudar Veículo (Opcional)</label>
                <select className="input-field" value={editFormData.automovelId} onChange={e => setEditFormData({...editFormData, automovelId: e.target.value})}>
                   {automoveis.map(car => (
                      <option key={car.id} value={car.id}>{car.marca} {car.modelo} - MAT: {car.matricula}</option>
                   ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label"><Calendar size={16}/> Início da Jornada</label>
                <input required type="date" className="input-field" value={editFormData.dataInicio} onChange={e=>setEditFormData({...editFormData, dataInicio: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label"><Calendar size={16}/> Data de Devolução</label>
                <input required type="date" className="input-field" value={editFormData.dataFim} onChange={e=>setEditFormData({...editFormData, dataFim: e.target.value})} />
              </div>
              <div style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
                <button type="submit" className="btn-primary flex-1">Salvar Alterações</button>
                <button type="button" onClick={() => setIsEditOpen(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      {isCancelModalOpen && (
        <div className="modal-overlay" style={{zIndex: 1100}}>
          <div className="modal-content glass-panel bounce-in" style={{maxWidth: '450px', textAlign: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
              <div style={{background: 'rgba(201, 64, 64, 0.1)', padding: '1rem', borderRadius: '50%'}}>
                <AlertCircle size={48} className="text-danger" />
              </div>
            </div>
            <h2 className="font-outfit text-xl font-bold mb-2">Cancelar Locação?</h2>
            <p className="text-muted mb-8">
              Esta ação removerá permanentemente sua reserva VIP da nossa agenda. Deseja realmente prosseguir?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleConfirmCancel} 
                className="btn-primary flex-1" 
                style={{background: 'linear-gradient(135deg, #c94040 0%, #8a2b2b 100%)', boxShadow: '0 4px 20px rgba(201, 64, 64, 0.25)'}}
              >
                Confirmar Cancelamento
              </button>
              <button 
                onClick={() => { setIsCancelModalOpen(false); setPedidoToCancelId(null); }} 
                className="btn-secondary flex-1"
              >
                Manter Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
