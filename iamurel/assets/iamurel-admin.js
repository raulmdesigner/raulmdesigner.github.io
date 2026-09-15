document.addEventListener("DOMContentLoaded", () => {
    let currentLeads = [];
    let currentFilter = 'ativos';
    let openedLeadId = null;

    const views = {
        inbox: document.getElementById('view-inbox'),
        packages: document.getElementById('view-packages'),
        cases: document.getElementById('view-cases'),
        reviews: document.getElementById('view-reviews'),
        faq: document.getElementById('view-faq'),
        appearance: document.getElementById('view-appearance')
    };

    iamurelSupabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            document.getElementById('iamurel-login-view').classList.add('hidden');
            document.getElementById('iamurel-dashboard-view').classList.remove('hidden');
            loadAllData();
        } else {
            document.getElementById('iamurel-login-view').classList.remove('hidden');
            document.getElementById('iamurel-dashboard-view').classList.add('hidden');
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => iamurelSupabase.auth.signOut());

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            Object.values(views).forEach(v => v.classList.add('hidden'));
            const targetId = e.target.id.replace('btn-nav-', 'view-');
            if (views[targetId.replace('view-', '')]) views[targetId.replace('view-', '')].classList.remove('hidden');
        });
    });

    async function loadAllData() {
        loadLeads();
        loadPackagesAdmin();
        loadCasesAdmin();
        loadReviewsAdmin();
        loadFaqAdmin();
        loadSettingsAdmin();
    }

    // --- CRM / LEADS LOGIC --- //
    
    async function loadLeads() {
        const { data } = await iamurelSupabase.from('iamurel_leads').select('*').order('created_at', { ascending: false });
        if (data) {
            currentLeads = data;
            renderLeads();
        }
    }

    window.filterLeads = function(type) {
        currentFilter = type;
        renderLeads();
    };

    function renderLeads() {
        const tbody = document.getElementById('leads-table-body');
        
        let filtered = currentLeads.filter(l => {
            if (currentFilter === 'lixeira') return l.deleted_at !== null;
            if (currentFilter === 'arquivados') return l.is_archived === true && l.deleted_at === null;
            return l.is_archived === false && l.deleted_at === null; // ativos
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-500">Nenhum registro encontrado nesta pasta.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(lead => {
            let statusColor = 'bg-gray-100 text-gray-700';
            if(lead.status === 'Novo') statusColor = 'bg-blue-100 text-blue-700';
            if(lead.status === 'Ganho') statusColor = 'bg-green-100 text-green-700';
            if(lead.status === 'Perdido') statusColor = 'bg-red-100 text-red-700';

            return `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold ${statusColor}">${lead.status}</span></td>
                <td class="p-4 font-bold text-gray-800">${lead.name} <br><span class="font-normal text-sm text-gray-500">${lead.business}</span></td>
                <td class="p-4 text-gray-500">${new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                <td class="p-4 text-right">
                    <button onclick="window.openCrmModal('${lead.id}')" class="bg-[#242322] text-[#F6EEDC] px-4 py-1.5 rounded font-bold text-xs hover:bg-black transition">
                        ${currentFilter === 'lixeira' ? 'Ver Registro' : 'Abrir'}
                    </button>
                </td>
            </tr>
        `}).join('');
    }

    window.openCrmModal = function(id) {
        const lead = currentLeads.find(l => l.id === id);
        if (!lead) return;
        
        openedLeadId = id;
        document.getElementById('modal-name').textContent = lead.name;
        document.getElementById('modal-business').textContent = lead.business;
        document.getElementById('modal-date').textContent = new Date(lead.created_at).toLocaleDateString('pt-BR');
        document.getElementById('modal-message').textContent = lead.message;
        document.getElementById('modal-phone').textContent = lead.phone;
        document.getElementById('modal-email').textContent = lead.email;
        
        const wppNumber = lead.phone.replace(/\D/g,'');
        document.getElementById('btn-modal-wpp').href = `https://wa.me/${wppNumber}`;
        document.getElementById('modal-status-select').value = lead.status;

        const btnTrash = document.getElementById('btn-modal-trash');
        const btnArchive = document.getElementById('btn-modal-archive');
        
        if (lead.deleted_at) {
            btnTrash.textContent = 'Restaurar da Lixeira';
            btnArchive.classList.add('hidden');
        } else {
            btnTrash.textContent = 'Mover para Lixeira';
            btnArchive.classList.remove('hidden');
            btnArchive.textContent = lead.is_archived ? 'Desarquivar' : 'Arquivar';
        }

        document.getElementById('crm-modal').classList.remove('hidden');
        
        // Se status é Novo e foi aberto, passar para Em Análise automaticamente
        if (lead.status === 'Novo' && !lead.deleted_at) {
            updateLeadField(id, 'status', 'Em Análise');
            document.getElementById('modal-status-select').value = 'Em Análise';
        }
    };

    window.closeCrmModal = function() {
        document.getElementById('crm-modal').classList.add('hidden');
        openedLeadId = null;
    };

    document.getElementById('modal-status-select').addEventListener('change', (e) => {
        if(openedLeadId) updateLeadField(openedLeadId, 'status', e.target.value);
    });

    document.getElementById('btn-modal-archive').addEventListener('click', () => {
        const lead = currentLeads.find(l => l.id === openedLeadId);
        updateLeadField(openedLeadId, 'is_archived', !lead.is_archived);
        window.closeCrmModal();
    });

    document.getElementById('btn-modal-trash').addEventListener('click', () => {
        const lead = currentLeads.find(l => l.id === openedLeadId);
        const newValue = lead.deleted_at ? null : new Date().toISOString();
        updateLeadField(openedLeadId, 'deleted_at', newValue);
        window.closeCrmModal();
    });

    async function updateLeadField(id, field, value) {
        const idx = currentLeads.findIndex(l => l.id === id);
        if (idx !== -1) currentLeads[idx][field] = value;
        renderLeads(); // Atualiza UI na hora
        await iamurelSupabase.from('iamurel_leads').update({ [field]: value }).eq('id', id);
    }

    // --- GENERIC CRUD FUNCTION FOR DYNAMIC CONTENT --- //
    async function handleSimpleInsert(tableName, dataObj, formId, reloadFunc) {
        const { error } = await iamurelSupabase.from(tableName).insert([dataObj]);
        if (!error) { document.getElementById(formId).reset(); reloadFunc(); }
        else alert('Erro ao salvar. Verifique RLS.');
    }

    // Cases
    async function loadCasesAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_cases').select('*').order('sort_order');
        document.getElementById('cases-list').innerHTML = (data||[]).map(c => `
            <div class="border p-4 bg-white rounded-lg flex justify-between items-center">
                <div><p class="font-bold">${c.title}</p><p class="text-sm text-gray-500">${c.is_published ? 'Público' : 'Rascunho'}</p></div>
                <button onclick="iamurelSupabase.from('iamurel_cases').delete().eq('id','${c.id}').then(()=>loadAllData())" class="text-red-500 text-sm font-bold">Apagar</button>
            </div>`).join('');
    }
    document.getElementById('form-new-case').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSimpleInsert('iamurel_cases', {
            title: document.getElementById('case-title').value,
            description: document.getElementById('case-desc').value,
            image_url: document.getElementById('case-img').value,
            is_published: document.getElementById('case-published').checked
        }, 'form-new-case', loadCasesAdmin);
    });

    // Reviews
    async function loadReviewsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_reviews').select('*').order('created_at');
        document.getElementById('reviews-list').innerHTML = (data||[]).map(r => `
            <div class="border p-4 bg-white rounded-lg flex justify-between items-center">
                <div><p class="font-bold">${r.client_name}</p><p class="text-sm text-gray-500 truncate w-48">${r.review_text}</p></div>
                <button onclick="iamurelSupabase.from('iamurel_reviews').delete().eq('id','${r.id}').then(()=>loadAllData())" class="text-red-500 text-sm font-bold">Apagar</button>
            </div>`).join('');
    }
    document.getElementById('form-new-review').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSimpleInsert('iamurel_reviews', {
            client_name: document.getElementById('rev-name').value,
            review_text: document.getElementById('rev-text').value,
            is_published: document.getElementById('rev-published').checked
        }, 'form-new-review', loadReviewsAdmin);
    });

    // FAQ
    async function loadFaqAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_faqs').select('*').order('sort_order');
        document.getElementById('faq-list').innerHTML = (data||[]).map(f => `
            <div class="border p-4 bg-white rounded-lg flex justify-between items-center">
                <div><p class="font-bold">${f.question}</p><p class="text-sm text-gray-500 truncate w-48">${f.answer}</p></div>
                <button onclick="iamurelSupabase.from('iamurel_faqs').delete().eq('id','${f.id}').then(()=>loadAllData())" class="text-red-500 text-sm font-bold">Apagar</button>
            </div>`).join('');
    }
    document.getElementById('form-new-faq').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSimpleInsert('iamurel_faqs', {
            question: document.getElementById('faq-question').value,
            answer: document.getElementById('faq-answer').value,
            is_published: document.getElementById('faq-published').checked
        }, 'form-new-faq', loadFaqAdmin);
    });

    // Packages (Existing logic kept compact)
    async function loadPackagesAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_packages').select('*').order('sort_order');
        document.getElementById('packages-list').innerHTML = (data||[]).map(pkg => `
            <div class="border p-4 rounded-xl bg-white flex flex-col shadow-sm">
                <h4 class="font-bold text-lg">${pkg.name}</h4><span class="text-blue-600 font-bold mb-2">${pkg.price_value}</span>
                <span class="text-xs px-2 py-1 rounded w-max mb-2 ${pkg.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">${pkg.is_published ? 'Público' : 'Oculto'}</span>
            </div>`).join('');
    }
    document.getElementById('form-new-package').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSimpleInsert('iamurel_packages', {
            name: document.getElementById('pkg-name').value, price_value: document.getElementById('pkg-price').value,
            description: document.getElementById('pkg-desc').value, is_published: document.getElementById('pkg-published').checked
        }, 'form-new-package', loadPackagesAdmin);
    });

    // Settings (Existing logic kept compact)
    async function loadSettingsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
        if (data) {
            ['hero_title','hero_subtitle','primary_color','logo_url','whatsapp','email','instagram'].forEach(k => {
                if(document.getElementById(`app-${k}`)) document.getElementById(`app-${k}`).value = data[k==='whatsapp'||k==='email'||k==='instagram' ? `contact_${k}` : k] || (k==='primary_color'?'#3b82f6':'');
            });
        }
    }
    document.getElementById('form-appearance').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('app-msg'); msg.textContent = 'Atualizando...';
        const updates = {
            hero_title: document.getElementById('app-hero-title').value, hero_subtitle: document.getElementById('app-hero-subtitle').value,
            primary_color: document.getElementById('app-primary-color').value, logo_url: document.getElementById('app-logo-url').value,
            contact_whatsapp: document.getElementById('app-whatsapp').value, contact_email: document.getElementById('app-email').value,
            contact_instagram: document.getElementById('app-instagram').value, updated_at: new Date()
        };
        const { data: s } = await iamurelSupabase.from('iamurel_site_settings').select('id').limit(1).maybeSingle();
        const { error } = s ? await iamurelSupabase.from('iamurel_site_settings').update(updates).eq('id', s.id) : await iamurelSupabase.from('iamurel_site_settings').insert([updates]);
        msg.textContent = error ? 'Erro ao salvar.' : 'Salvo com sucesso!';
    });

    if(document.getElementById('iamurel-login-form')) {
        document.getElementById('iamurel-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await iamurelSupabase.auth.signInWithPassword({
                email: document.getElementById('login-email').value, password: document.getElementById('login-password').value
            });
        });
    }
});
