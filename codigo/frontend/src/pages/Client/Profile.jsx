import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function Profile() {
  const { user } = useOutletContext(); // This is the Usuario ID
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({ id: '', nome: '', cpf: '', rg: '', endereco: '', profissao: '' });
  const [rendimentos, setRendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/clientes/usuario/${user.id}`);
      if (res.ok) {
        const cliente = await res.json();
        if (cliente) {
           setFormData({ 
              id: cliente.id || '', 
              nome: cliente.nome || user.nome, 
              cpf: cliente.cpf || '', 
              rg: cliente.rg || '', 
              endereco: cliente.endereco || '', 
              profissao: cliente.profissao || '' 
           });
           setRendimentos(cliente.rendimentos || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarRenda = () => {
    if (rendimentos.length >= 3) return showNotification('Limite Atingido', 'Máximo de 3 fontes de renda permitidas.', 'info');
    setRendimentos([...rendimentos, { fonte: '', valor: '' }]);
  };

  const updateRenda = (index, field, value) => {
    const newRendimentos = [...rendimentos];
    newRendimentos[index][field] = value;
    setRendimentos(newRendimentos);
  };

  const removeRenda = (index) => setRendimentos(rendimentos.filter((_, i) => i !== index));

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const payload = { 
       ...formData, 
       usuario: { id: user.id },
       rendimentos: rendimentos.map(r => ({ fonte: r.fonte, valor: parseFloat(r.valor) || 0 })) 
    };
    
    const url = formData.id ? `http://localhost:8081/api/clientes/${formData.id}` : `http://localhost:8081/api/clientes`;
    
    try {
      const res = await fetch(url, { 
         method: formData.id ? 'PUT' : 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify(payload) 
      });
      if (!res.ok) throw new Error('Falha ao atualizar dados. Verifique a central financeira.');
      showNotification('Perfil Atualizado', "Seu Perfil Premium e Score Financeiro foram atualizados com sucesso.", 'success');
      carregarPerfil();
    } catch (err) { 
      showNotification('Erro no Cadastro', err.message, 'error'); 
    }
  };

  if (loading) return <div className="p-8 text-muted">Carregando perfil digital...</div>;

  return (
    <div className="fade-in max-w-content">
       <h1 className="font-outfit section-title mb-1">Meu <span className="text-gold">Perfil</span> VIP</h1>
       <p className="section-subtitle mb-8 flex items-center gap-2">
          <ShieldCheck size={18} className="text-success" /> Mantenha suas documentações e comprovações de renda em dia.
       </p>
       
        <div className="glass-panel" style={{padding: '2.5rem', maxWidth: '800px'}}>
          <h3 className="section-subtitle border-b pb-3 mb-6">Informações Sensíveis</h3>
          <form onSubmit={handleSubmitProfile}>
            <div className="input-group">
               <label className="input-label">Nome Completo</label>
               <input required type="text" className="input-field" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div className="input-group">
                 <label className="input-label">Identificação Fiscal (CPF)</label>
                 <input required type="text" className="input-field" placeholder="111.111.111-11" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              </div>
              <div className="input-group">
                 <label className="input-label">Documento de Identidade (RG)</label>
                 <input type="text" className="input-field" placeholder="MG-00.000" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} />
              </div>
            </div>
            <div className="input-group">
               <label className="input-label">Endereço de Domicílio e Entrega</label>
               <input type="text" className="input-field" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} />
            </div>
            <div className="input-group">
               <label className="input-label">Ocupação / Cargo Executivo Atual</label>
               <input type="text" className="input-field" value={formData.profissao} onChange={e => setFormData({...formData, profissao: e.target.value})} />
            </div>

            <div className="flex justify-between items-center mt-8 mb-5 border-b border-dark pb-3">
              <h4 className="text-white font-medium text-lg font-outfit text-gold">Aporte e Comprovação de Renda (Máx 3)</h4>
              {rendimentos.length < 3 && (
                 <button type="button" onClick={handleAdicionarRenda} className="btn-secondary-sm"><Plus size={14}/> Nova Fonte</button>
              )}
            </div>

            {rendimentos.map((r, i) => (
              <div key={i} className="flex gap-4 mb-4 items-center bg-black/40 p-3 rounded-lg border border-dark">
                <div className="flex-1">
                   <input required placeholder="Instituição Empregadora / Fonte" className="input-field" value={r.fonte} onChange={e => updateRenda(i, 'fonte', e.target.value)} />
                </div>
                <div className="w-48">
                   <input required placeholder="Valor Oficial (R$)" min="0" step="0.01" className="input-field" type="number" value={r.valor} onChange={e => updateRenda(i, 'valor', e.target.value)} />
                </div>
                <button type="button" onClick={() => removeRenda(i)} className="action-btn text-danger ml-2 hover:bg-neutral-800" title="Remover"><Trash2 size={20}/></button>
              </div>
            ))}
            
            {rendimentos.length === 0 && <p className="text-muted text-sm italic mb-6">É altamente recomendável comprovar no mínimo R$ 15.000,00 de renda mensal para aprovação simplificada das apólices.</p>}

            <button type="submit" className="btn-primary w-full mt-6 py-4 text-lg">
              Atualizar Dossiê no Sistema
            </button>
          </form>
        </div>
    </div>
  );
}
