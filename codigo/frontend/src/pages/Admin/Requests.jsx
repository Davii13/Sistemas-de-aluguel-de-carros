import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, X, ShieldAlert } from 'lucide-react';

export default function Requests() {
  const { user } = useOutletContext();
  const [pedidos, setPedidos] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/pedidos');
      if (res.ok) setPedidos(await res.json());
    } catch (e) { console.error(e); }
  };

  const avaliar = async (pedidoId, aprovar) => {
    try {
      if (!confirm(`Deseja ${aprovar ? 'APROVAR' : 'REJEITAR'} este contrato?`)) return;
      setLoadingAction(pedidoId);
      const res = await fetch(`http://localhost:8081/api/pedidos/${pedidoId}/avaliar?agenteId=${user.id}&aprovar=${aprovar}`, { method: 'POST' });
      if (res.ok) {
         await loadPedidos();
      } else {
         alert('Conflito no servidor. Atualize a página.');
      }
    } catch(e) { 
      alert('Erro de conexão na avaliação'); 
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fade-in max-w-content">
      <h1 className="font-outfit section-title">Análise de <span className="text-gold">Apólices</span> e Contratos</h1>
      <p className="section-subtitle">Acesso administrativo ao score financeiro e autorização de liberação dos veículos premium.</p>

      <div className="glass-panel" style={{padding: '1.5rem', marginTop: '2rem'}}>
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Nº Contrato</th>
                <th>Cliente ID</th>
                <th>Veículo</th>
                <th>Período Contratado</th>
                <th>Status</th>
                <th style={{textAlign: 'right'}}>Ação Administrativa</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="text-gold font-bold">CTX-{p.id.toString().padStart(4, '0')}</td>
                  <td className="text-muted">CLI-{p.clienteId.toString().padStart(4, '0')}</td>
                  <td className="font-medium text-lg">{p.automovelMarca} <span className="text-muted text-sm">{p.automovelModelo}</span></td>
                  <td>{p.dataInicio.split('-').reverse().join('/')} ➔ {p.dataFim.split('-').reverse().join('/')}</td>
                  <td>
                    <span className={`badge ${p.status === 'APROVADO' ? 'badge-success' : p.status === 'REJEITADO' ? 'badge-danger' : 'badge-pending'}`}>
                       {p.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    {p.status === 'PENDENTE' ? (
                      <div style={{display:'flex', gap:'0.8rem', justifyContent:'flex-end'}}>
                        <button disabled={loadingAction === p.id} onClick={() => avaliar(p.id, true)} className="btn-success" title="Aprovar e Gerar Contrato">
                           <Check size={16}/> Emitir
                        </button>
                        <button disabled={loadingAction === p.id} onClick={() => avaliar(p.id, false)} className="btn-danger-outline" title="Negar Risco Financeiro">
                           <X size={16}/> Negar
                        </button>
                      </div>
                    ) : <span className="text-muted text-xs italic"><ShieldAlert size={12} className="inline mr-1"/> Avaliador Finalizado</span>}
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && <tr><td colSpan="6" className="text-center text-muted" style={{padding: '3rem'}}>Nenhuma apólice requisitada hoje.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
