import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <header className="w-full border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold tracking-tight text-text">
            IAMUREL
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text">
            <a href="#metodo" className="hover:text-action transition-colors">Método</a>
            <a href="#demonstracoes" className="hover:text-action transition-colors">Trabalhos</a>
            <a href="#servicos" className="hover:text-action transition-colors">Serviços</a>
            <a href="#pacotes" className="hover:text-action transition-colors">Pacotes</a>
          </nav>
          <a href="#contato" className="hidden md:inline-flex bg-action hover:bg-action-hover text-white px-6 py-2.5 rounded text-sm font-medium transition-colors">
            Falar sobre um projeto
          </a>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-text text-bg py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-display font-bold tracking-tight mb-4 inline-block">
              IAMUREL
            </Link>
            <p className="text-bg/70 max-w-sm mt-4">
              Conteúdo com direção. Design com intenção. Transformando ideias soltas em presença de marca.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-bg/70">
              <li><a href="#metodo" className="hover:text-action transition-colors">Método AI-First</a></li>
              <li><a href="#servicos" className="hover:text-action transition-colors">Serviços</a></li>
              <li><a href="#pacotes" className="hover:text-action transition-colors">Pacotes e Valores</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-bg/70">
              <li><a href="mailto:contato@iamurel.com" className="hover:text-action transition-colors">contato@iamurel.com</a></li>
              <li className="pt-4"><Link to="/admin" className="text-sm opacity-50 hover:opacity-100">Acesso Restrito</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
