document.addEventListener("DOMContentLoaded", () => {
    const loginView = document.getElementById('iamurel-login-view');
    const dashboardView = document.getElementById('iamurel-dashboard-view');
    const loginForm = document.getElementById('iamurel-login-form');
    
    const btnsNav = {
        inbox: document.getElementById('btn-nav-inbox'),
        packages: document.getElementById('btn-nav-packages'),
        appearance: document.getElementById('btn-nav-appearance')
    };
    const views = {
        inbox: document.getElementById('view-inbox'),
        packages: document.getElementById('view-packages'),
        appearance: document.getElementById('view-appearance')
    };

    iamurelSupabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            showDashboard();
            loadLeads();
            loadPackagesAdmin();
            loadSettingsAdmin();
        } else {
            showLogin();
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const submitBtn = loginForm.querySelector('button');
            submitBtn.textContent = 'Autenticando...';
            
            const { error } = await iamurelSupabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                document.getElementById('login-error').textContent = 'Erro de acesso. Verifique credenciais.';
                document.getElementById('login-error').classList.remove('hidden');
                submitBtn.textContent = 'Entrar no Studio';
            }
        });
    }

    document.getElementById('btn-logout').addEventListener('click', async () => await iamurelSupabase.auth.signOut());

    function switchView(viewName) {
        Object.keys(views).forEach(key => views[key].classList.add('hidden'));
        Object.keys(btnsNav).forEach(key => btnsNav[key].classList.remove('active'));
        
        views[viewName].classList.remove('hidden');
        btnsNav[viewName].classList.add('active');
    }
    
    btnsNav.inbox.addEventListener('click', () => switchView('inbox'));
    btnsNav.packages.addEventListener('click', () => switchView('packages'));
    btnsNav.appearance.addEventListener('click', () => switchView('appearance'));

    async function loadLeads() {
        const tbody = document.getElementById('leads-table-body');
        const { data, error } = await iamurelSupabase.from('iamurel_leads').select('*').order('created_at', { ascending: false });
        
        if (error || !data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">Nenhum contato encontrado.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(lead => `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-4 font-bold text-gray-800">${lead.name} <br><span class="font-normal text-sm text-gray-500">${lead.email} | ${lead.phone}</span></td>
                <td class="p-4 text-gray-700">${lead.business}</td>
                <td class="p-4 text-gray-500">${new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                <td class="p-4"><button onclick="alert('Mensagem de ${lead.name}:\\n\\n${lead.message}')" class="text-blue-600 font-bold hover:underline">Ler Mensagem</button></td>
            </tr>
        `).join('');
    }

    async function loadPackagesAdmin() {
        const container = document.getElementById('packages-list');
        const { data, error } = await iamurelSupabase.from('iamurel_packages').select('*').order('sort_order');
        
        if (data) {
            container.innerHTML = data.map(pkg => `
                <div class="border p-4 rounded-xl bg-white flex flex-col shadow-sm">
                    <h4 class="font-bold text-lg text-gray-800">${pkg.name}</h4>
                    <span class="text-blue-600 font-bold mb-2">${pkg.price_value}</span>
                    <span class="text-xs px-2 py-1 rounded inline-block w-max mb-2 ${pkg.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                        ${pkg.is_published ? 'Publicado no site' : 'Rascunho (Oculto)'}
                    </span>
                </div>
            `).join('');
        }
    }

    document.getElementById('form-new-package').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('pkg-msg');
        msg.textContent = 'Salvando pacote...'; 
        msg.className = 'mt-2 text-sm font-bold text-gray-500';
        
        const newPkg = {
            name: document.getElementById('pkg-name').value,
            price_value: document.getElementById('pkg-price').value,
            description: document.getElementById('pkg-desc').value,
            is_published: document.getElementById('pkg-published').checked
        };

        const { error } = await iamurelSupabase.from('iamurel_packages').insert([newPkg]);
        
        if (error) {
            msg.textContent = 'Erro ao salvar. Verifique sua permissão de banco de dados.'; 
            msg.classList.add('text-red-500');
        } else {
            msg.textContent = 'Pacote criado e salvo com sucesso!'; 
            msg.classList.add('text-green-600');
            e.target.reset();
            loadPackagesAdmin();
        }
    });

    async function loadSettingsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).single();
        if (data) {
            document.getElementById('app-hero-title').value = data.hero_title || '';
            document.getElementById('app-hero-subtitle').value = data.hero_subtitle || '';
            document.getElementById('app-primary-color').value = data.primary_color || '#3b82f6';
            document.getElementById('app-logo-url').value = data.logo_url || '';
            document.getElementById('app-whatsapp').value = data.contact_whatsapp || '';
            document.getElementById('app-email').value = data.contact_email || '';
            document.getElementById('app-instagram').value = data.contact_instagram || '';
        }
    }

    document.getElementById('form-appearance').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('app-msg');
        msg.textContent = 'Aplicando atualizações no site público...'; 
        msg.className = 'mt-4 text-sm font-bold text-gray-500 text-center';

        const updates = {
            hero_title: document.getElementById('app-hero-title').value,
            hero_subtitle: document.getElementById('app-hero-subtitle').value,
            primary_color: document.getElementById('app-primary-color').value,
            logo_url: document.getElementById('app-logo-url').value,
            contact_whatsapp: document.getElementById('app-whatsapp').value,
            contact_email: document.getElementById('app-email').value,
            contact_instagram: document.getElementById('app-instagram').value,
            updated_at: new Date()
        };

        const { data: settings } = await iamurelSupabase.from('iamurel_site_settings').select('id').limit(1).single();
        
        if (settings) {
            const { error } = await iamurelSupabase.from('iamurel_site_settings').update(updates).eq('id', settings.id);
            if (error) { 
                msg.textContent = 'Falha ao salvar. Atualize a página e tente novamente.'; 
                msg.classList.add('text-red-500'); 
            } else { 
                msg.textContent = 'Configurações salvas e ativas!'; 
                msg.classList.add('text-green-600'); 
            }
        }
    });

    function showLogin() { loginView.classList.remove('hidden'); dashboardView.classList.add('hidden'); }
    function showDashboard() { loginView.classList.add('hidden'); dashboardView.classList.remove('hidden'); switchView('inbox'); }
});
