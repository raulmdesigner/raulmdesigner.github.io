import { useEffect, useState } from 'react';
import { dataLayer } from '../../lib/data';
import { Lead } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLeads(await dataLayer.getLeads());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Carregando...</div>;

  const newLeadsCount = leads.filter(l => l.status === 'novo').length;
  const inProgressCount = leads.filter(l => l.status === 'em_analise' || l.status === 'contatado' || l.status === 'proposta_enviada').length;
  const wonCount = leads.filter(l => l.status === 'ganho').length;

  return (
    <div className="space-y-8">
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded text-sm font-medium">
          Aviso: O Supabase não está configurado. O painel está rodando no modo de demonstração com dados locais temporários. Para persistência real, configure as variáveis de ambiente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Leads" value={leads.length} icon={Users} />
        <StatCard title="Novos" value={newLeadsCount} icon={CheckCircle} color="text-action" />
        <StatCard title="Em Negociação" value={inProgressCount} icon={Clock} color="text-trust" />
        <StatCard title="Projetos Ganhos" value={wonCount} icon={TrendingUp} color="text-emerald-600" />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-6">Últimos Leads</h3>
        {leads.length === 0 ? (
          <p className="text-muted text-sm">Ainda não há dados para esta métrica.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-3 font-medium">Nome</th>
                  <th className="pb-3 font-medium">Negócio</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map(lead => (
                  <tr key={lead.id} className="border-b border-border/50 last:border-0">
                    <td className="py-4 font-medium">{lead.name}</td>
                    <td className="py-4">{lead.business_name}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-bg rounded text-xs font-medium uppercase tracking-wider">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-muted">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-text" }: any) {
  return (
    <div className="p-6 bg-surface border border-border rounded-lg flex items-center gap-4">
      <div className={`p-3 rounded-full bg-bg ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
