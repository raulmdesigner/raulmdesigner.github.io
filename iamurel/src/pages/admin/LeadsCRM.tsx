import { useEffect, useState } from 'react';
import { dataLayer } from '../../lib/data';
import { Lead, LeadStatus } from '../../types';
import { User, Briefcase, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

const STATUS_COLUMNS: { id: LeadStatus; label: string }[] = [
  { id: 'novo', label: 'Novos' },
  { id: 'em_analise', label: 'Em Análise' },
  { id: 'contatado', label: 'Contatado' },
  { id: 'proposta_enviada', label: 'Proposta' },
  { id: 'ganho', label: 'Ganho' },
  { id: 'perdido', label: 'Perdido' }
];

export default function LeadsCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeads() {
    setLoading(true);
    setLeads(await dataLayer.getLeads());
    setLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic UI update
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    const success = await dataLayer.updateLeadStatus(leadId, newStatus);
    if (!success) {
      // Revert if failed
      loadLeads();
    }
  };

  if (loading) return <div>Carregando Kanban...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pipeline de Leads</h2>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.id} className="min-w-[300px] w-[300px] bg-surface border border-border rounded-lg flex flex-col max-h-full">
            <div className="p-4 border-b border-border bg-bg/50 rounded-t-lg flex items-center justify-between">
              <h3 className="font-medium text-sm">{column.label}</h3>
              <span className="bg-bg text-muted px-2 py-0.5 rounded text-xs font-bold">
                {leads.filter(l => l.status === column.id).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {leads.filter(l => l.status === column.id).map(lead => (
                <div key={lead.id} className="bg-bg border border-border rounded p-4 shadow-sm hover:border-action/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-sm text-text truncate pr-2">{lead.name}</h4>
                    {lead.priority === 'high' && <AlertCircle size={14} className="text-action shrink-0" />}
                  </div>
                  
                  <div className="space-y-2 text-xs text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={12} />
                      <span className="truncate">{lead.business_name}</span>
                    </div>
                    {lead.service_interest && (
                      <div className="flex items-center gap-2 text-trust">
                        <MessageSquare size={12} />
                        <span className="truncate">{lead.service_interest}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="w-full text-xs bg-surface border border-border rounded p-1.5 focus:outline-none focus:border-action"
                    >
                      {STATUS_COLUMNS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
