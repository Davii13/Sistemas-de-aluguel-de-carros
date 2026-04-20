import { useState, useEffect } from 'react';

export default function Clients() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/clientes');
      if (res.ok) setClientes(await res.json());
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fade-in max-w-content">
       <h1 className="font-outfit section-title">Governança de <span className="text-gold">Clientes</span></h1>
       <p className="section-subtitle mb-8">Auditoria de usuários e revisão do Score Patrimonial.</p>
       
       <div className="glass-panel" style={{padding: '2rem'}}>
         <h3 className="section-subtitle border-b pb-3 mb-5">Central de Registros de Locatários</h3>
         <div className="table-wrapper">
           <table className="premium-table">
             <thead>
               <tr>
                 <th>Identificação do Portador</th>
                 <th>Profissão</th>
                 <th>Identificação (CPF/RG)</th>
                 <th>Endereço Registrado</th>
                 <th style={{textAlign: 'right'}}>Patrimônio / Rendimentos Declarados</th>
               </tr>
             </thead>
             <tbody>
               {clientes.map(cli => (
                 <tr key={cli.id}>
                   <td className="font-bold text-lg text-gold">{cli.nome}</td>
                   <td className="text-muted">{cli.profissao || 'Não reportado'}</td>
                   <td>
                     <div className="flex flex-col gap-1 text-sm text-muted">
                        <span>CPF: {cli.cpf}</span>
                        <span>RG: {cli.rg || 'Não reportado'}</span>
                     </div>
                   </td>
                   <td className="text-sm">{cli.endereco || 'Não reportado'}</td>
                   <td style={{textAlign: 'right'}}>
                     {cli.rendimentos && cli.rendimentos.length > 0 ? (
                       <div className="flex flex-col gap-2 items-end">
                         {cli.rendimentos.map((r, idx) => (
                           <span key={idx} className="badge badge-pending whitespace-nowrap">
                             {r.fonte}: <strong className="text-success">R$ {parseFloat(r.valor).toFixed(2)}</strong>
                           </span>
                         ))}
                       </div>
                     ) : <span className="badge badge-danger">Dossiê Incompleto</span>}
                   </td>
                 </tr>
               ))}
               {clientes.length === 0 && <tr><td colSpan="5" className="text-center text-muted" style={{padding: '3rem'}}>Central Vazia.</td></tr>}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
}
