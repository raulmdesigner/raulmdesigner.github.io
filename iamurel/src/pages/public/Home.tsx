import React, { useState, useEffect } from 'react';
import { dataLayer } from '../../lib/data';
import { SiteSettings, Service, Package, Showcase, FAQ } from '../../types';
import { ArrowRight, Sparkles, PencilRuler, Target, LayoutGrid, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    async function loadData() {
      setSettings(await dataLayer.getSettings());
      setServices(await dataLayer.getServices());
      setPackages(await dataLayer.getPackages());
      setShowcases(await dataLayer.getShowcases());
      setFaqs(await dataLayer.getFaq());
    }
    loadData();
  }, []);

  if (!settings) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="w-full">
      <HeroSection settings={settings} />
      <DiagnosisSection />
      <MethodSection />
      <ShowcasesSection showcases={showcases} />
      <ServicesSection services={services} />
      <PackagesSection packages={packages} />
      <FaqSection faqs={faqs} />
      <ContactSection />
    </div>
  );
}

function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-trust/10 text-trust text-sm font-medium mb-8">
          <Sparkles size={16} />
          <span>Inteligência Artificial + Direção Humana</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display leading-[1.1] mb-8 text-text tracking-tight">
          {settings.hero_title}
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          {settings.hero_subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contato" className="w-full sm:w-auto px-8 py-4 bg-action hover:bg-action-hover text-white rounded font-medium transition-colors text-center">
            {settings.primary_cta_text}
          </a>
          <a href="#metodo" className="w-full sm:w-auto px-8 py-4 bg-surface border border-border hover:border-action/30 text-text rounded font-medium transition-colors text-center">
            {settings.secondary_cta_text}
          </a>
        </div>
      </div>
    </section>
  );
}

function DiagnosisSection() {
  const problems = [
    "Cada postagem parece pertencer a uma marca diferente.",
    "Existem boas ideias, mas ninguém consegue organizar a produção.",
    "O negócio precisa publicar, mas não sabe o que dizer.",
    "Existe uma logo, mas não existe um sistema para o dia a dia.",
    "A comunicação parece menor ou menos profissional que o negócio.",
    "As campanhas começam sem conceito e terminam desconectadas."
  ];

  return (
    <section className="py-24 bg-surface px-6 border-y border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-display leading-tight mb-6">
            Sua comunicação reflete o valor do seu negócio?
          </h2>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Muitas marcas perdem grandes oportunidades não por falta de qualidade no produto, mas por uma identidade fragmentada e mensagens confusas.
          </p>
          <a href="#contato" className="inline-flex items-center gap-2 text-action font-medium hover:gap-3 transition-all">
            Vamos resolver isso <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {problems.map((problem, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-bg rounded border border-border">
              <CheckCircle2 className="text-action shrink-0 mt-0.5" size={24} />
              <p className="text-text font-medium">{problem}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  const steps = [
    { icon: Target, title: "Entender", desc: "Mapeamos seu objetivo, sua audiência e o que precisa ser comunicado de verdade." },
    { icon: Sparkles, title: "Explorar", desc: "Usamos IA para expandir possibilidades, testar caminhos e organizar referências em tempo recorde." },
    { icon: PencilRuler, title: "Dirigir", desc: "Direção humana entra para filtrar, refinar e garantir que a linguagem seja proprietária." },
    { icon: LayoutGrid, title: "Entregar", desc: "Arquivos, guias e sistemas visuais prontos para sua equipe aplicar no dia a dia." }
  ];

  return (
    <section id="metodo" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display mb-6">O Método AI-First</h2>
          <p className="text-lg text-muted">
            A IA acelera possibilidades. A direção humana define contexto, prioridade e intenção. Não vendemos conteúdo gerado automaticamente; vendemos clareza estratégica.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-start p-8 bg-surface rounded border border-border">
                <div className="w-12 h-12 bg-trust/10 text-trust rounded-full flex items-center justify-center mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcasesSection({ showcases }: { showcases: Showcase[] }) {
  if (!showcases.length) return null;
  return (
    <section id="demonstracoes" className="py-24 bg-surface px-6 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-display mb-16 text-center">Processo e Estudos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {showcases.map(showcase => (
            <div key={showcase.id} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-bg border border-border rounded mb-6 flex items-center justify-center overflow-hidden relative">
                {showcase.image_url ? (
                  <img src={showcase.image_url} alt={showcase.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-muted opacity-50 font-display text-2xl tracking-widest uppercase">
                    IAMUREL_DEMO
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur px-3 py-1 rounded text-xs font-medium uppercase tracking-wider text-trust">
                  {showcase.label === 'demonstration' ? 'Demonstração' : showcase.label}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{showcase.title}</h3>
              <p className="text-muted mb-4">{showcase.context}</p>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-text"><strong>Entregável:</strong> {showcase.deliverable}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-display mb-16">Especialidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.filter(s => s.status === 'active').map(service => (
            <div key={service.id} className="p-8 bg-surface border border-border rounded flex flex-col h-full">
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted mb-8 flex-1">{service.problem_solved}</p>
              <div className="space-y-4 text-sm bg-bg p-6 rounded border border-border">
                <div><span className="font-bold">O que entregamos:</span> {service.deliverables}</div>
                <div><span className="font-bold">Para quem é:</span> {service.target_audience}</div>
                <div className="pt-4 mt-4 border-t border-border flex justify-between items-center text-trust font-medium">
                  <span>{service.timeframe}</span>
                  <span>{service.investment_range}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesSection({ packages }: { packages: Package[] }) {
  const activePkgs = packages.filter(p => p.status === 'active').sort((a,b) => a.order_index - b.order_index);
  
  return (
    <section id="pacotes" className="py-24 bg-surface px-6 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display mb-6">Soluções Completas</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Da marca inicial ao sistema estruturado. Escolha o momento do seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {activePkgs.map(pkg => (
            <div key={pkg.id} className={`flex flex-col p-8 rounded border ${pkg.is_highlighted ? 'border-action bg-action/5 relative' : 'border-border bg-bg'}`}>
              {pkg.is_highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-action text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Recomendado
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{pkg.level}</h3>
              <p className="text-sm text-muted mb-6 h-10">{pkg.commercial_role}</p>
              
              <div className="text-3xl font-display font-bold mb-8">
                {pkg.price_type === 'on_request' ? 'Sob consulta' : pkg.price_type === 'starting_at' ? `A partir de R$ ${pkg.price}` : `R$ ${pkg.price}`}
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {pkg.items?.sort((a,b) => a.order_index - b.order_index).map(item => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <CheckCircle2 size={18} className="text-trust shrink-0" />
                    <span>{item.quantity ? <span className="font-bold">{item.quantity}x </span> : null}{item.title}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-border/50 text-xs text-muted mb-6 space-y-2">
                <p>Tempo estimado: {pkg.timeframe}</p>
                <p>{pkg.revisions}</p>
              </div>
              
              <a href="#contato" className={`w-full py-3 rounded text-center font-medium transition-colors ${pkg.is_highlighted ? 'bg-action hover:bg-action-hover text-white' : 'bg-surface border border-border hover:border-text text-text'}`}>
                Selecionar
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs.length) return null;
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-display mb-12 text-center">Perguntas Comuns</h2>
        <div className="space-y-8">
          {faqs.map(faq => (
            <div key={faq.id} className="p-6 bg-surface border border-border rounded">
              <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
              <p className="text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const leadData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      business_name: formData.get('business_name') as string,
      need: formData.get('need') as string,
      objective: formData.get('objective') as string,
      timeframe: formData.get('timeframe') as string,
      message: formData.get('message') as string,
      consent: true,
      origin: 'Site Publico',
      preferred_channel: 'email'
    };
    
    const res = await dataLayer.submitLead(leadData);
    if (res.success) {
      setSuccess(true);
      e.currentTarget.reset();
    }
    setLoading(false);
  }

  return (
    <section id="contato" className="py-24 bg-text text-bg px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-display mb-6">Vamos organizar as ideias?</h2>
          <p className="text-bg/70 mb-8 leading-relaxed">
            Preencha o formulário para entendermos seu momento. Retornaremos com uma proposta de direção e os próximos passos para o seu projeto.
          </p>
          <div className="space-y-6">
            <div className="pt-6 border-t border-bg/10">
              <h4 className="font-bold mb-2">Próximos passos após o envio:</h4>
              <ul className="space-y-3 text-sm text-bg/70">
                <li>1. Lemos e avaliamos sua solicitação.</li>
                <li>2. Entramos em contato para alinhar detalhes.</li>
                <li>3. Enviamos uma proposta comercial clara e sem surpresas.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-bg text-text p-8 rounded">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-trust/10 text-trust rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Solicitação enviada</h3>
              <p className="text-muted mb-8">Nossa equipe recebeu seu contato e retornará em breve.</p>
              <button onClick={() => setSuccess(false)} className="text-action font-medium hover:underline">
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome completo</label>
                <input required name="name" type="text" className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input required name="email" type="email" className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Negócio</label>
                <input required name="business_name" type="text" className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qual o seu momento / necessidade?</label>
                <select required name="need" className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action appearance-none">
                  <option value="">Selecione...</option>
                  <option value="comecando">Estou começando uma marca do zero</option>
                  <option value="organizar">Preciso organizar meu conteúdo nas redes</option>
                  <option value="campanha">Quero lançar uma campanha específica</option>
                  <option value="nao_sei">Ainda não sei, preciso de diagnóstico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prazo ideal</label>
                <input name="timeframe" type="text" placeholder="Ex: Próximo mês, Sem pressa" className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensagem (Opcional)</label>
                <textarea name="message" rows={4} className="w-full p-3 bg-surface border border-border rounded focus:outline-none focus:border-action resize-none" placeholder="Conte um pouco mais sobre o projeto..."></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-4 bg-action hover:bg-action-hover disabled:opacity-50 text-white rounded font-medium transition-colors mt-6">
                {loading ? 'Enviando...' : 'Solicitar Orçamento'}
              </button>
              <p className="text-xs text-muted text-center mt-4">
                Ao enviar, você concorda que possamos armazenar seus dados para retornar o contato.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
