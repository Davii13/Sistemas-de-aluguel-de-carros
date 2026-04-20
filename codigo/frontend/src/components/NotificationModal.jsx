import { CheckCircle, AlertTriangle, XCircle, X, HelpCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationModal() {
  const { 
    notification, closeNotification, 
    confirmation, closeConfirmation, handleConfirm 
  } = useNotification();

  // Se houver uma confirmação ativa, damos prioridade ou mostramos em overlay
  if (confirmation) {
    return (
      <div className="modal-overlay" style={{ zIndex: 10000 }}>
        <div className="modal-content glass-panel bounce-in" style={{ maxWidth: '450px', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <HelpCircle size={48} className="text-gold" />
            </div>
          </div>
          
          <h2 className="font-outfit" style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'white' }}>
            {confirmation.title}
          </h2>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            {confirmation.message}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={handleConfirm} 
              className="btn-primary flex-1"
              style={{ padding: '0.8rem' }}
            >
              Confirmar
            </button>
            <button 
              onClick={closeConfirmation} 
              className="btn-secondary flex-1"
              style={{ padding: '0.8rem' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!notification) return null;

  const { title, message, type } = notification;

  const styles = {
    success: { icon: <CheckCircle className="text-success" size={48} />, color: 'var(--success)' },
    error: { icon: <XCircle className="text-danger" size={48} />, color: 'var(--danger)' },
    info: { icon: <AlertTriangle className="text-gold" size={48} />, color: 'var(--primary-gold)' },
  };

  const current = styles[type] || styles.info;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel fade-in" style={{ maxWidth: '400px', textAlign: 'center', padding: '2.5rem' }}>
        <button 
          onClick={closeNotification} 
          className="modal-close" 
          style={{ top: '15px', right: '15px' }}
        >
          <X size={20} />
        </button>
        
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          {current.icon}
        </div>
        
        <h2 className="font-outfit" style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'white' }}>
          {title}
        </h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          {message}
        </p>
        
        <button 
          onClick={closeNotification} 
          className="btn-primary w-full"
          style={{ padding: '0.8rem' }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
