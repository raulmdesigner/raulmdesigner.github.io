document.addEventListener("DOMContentLoaded", () => {
    let currentLeads = [];
    let openedLeadId = null;

    const PIPELINE_STATUSES = ['Novo', 'Qualificação', 'Contato iniciado', 'Briefing recebido', 'Proposta enviada', 'Negociação', 'Ganho', 'Perdido', 'Arquivado'];

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

    document.getElementById('iamurel-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const { error } = await iamurelSupabase.auth.signInWithPassword({
            email: document.getElementById('login-email').value, password: document.getElementById('login-password').value
        });
        if (error) document.getElementById('login-error').classList.remove('hidden');
    });

    document.getElementById('btn-logout').addEventListener('click', () => iamurelSupabase.auth.signOut());

    // SISTEMA DE NAVEGAÇÃO BLINDADO
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 1. Remove a cor ativa de todos os botões
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            // 2. Esconde TODAS as telas do painel
            document.querySelectorAll('.content-view').forEach(v => v.classList.add('hidden'));
            
            // 3. Ativa o botão clicado e mostra a tela correspondente
            this.classList.add('active');
            const targetViewId = this.id.replace('btn-nav-', 'view-');
            const targetView = document.getElementById(targetViewId);
            if (targetView) targetView.classList.remove('hidden');
        });
    });

    async function loadAllData() {
        await loadLeads();
        loadPackagesAdmin();
        loadCasesAdmin();
        loadReviewsAdmin();
        loadFaqAdmin();
        loadSettingsAdmin();
    }

    // --- CRM E DASHBOARD LOGIC --- //

    async function loadLeads() {
        const { data } = await iamurelSupabase.from('iamurel_leads').select('*').order('created_at', { ascending: false });
        if (data) {
            currentLeads = data;
            updateDashboardStats();
            renderTable(currentLeads);
            renderKanban(currentLeads);
        }
    }

    function updateDashboardStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let novos = 0;
        let andamento = 0;
        let ganhos = 0;
        let totaisTratados = 0;

        currentLeads.forEach(l => {
            const date = new Date(l.created_at);
            if (date >= thirtyDaysAgo) {
                if (l.status === 'Novo') novos++;
                if (['Qualificação', 'Contato iniciado', 'Briefing recebido', 'Proposta enviada', 'Negociação'].includes(l.status)) andamento++;
                if (l.status === 'Ganho') ganhos++;
                if (['Qualificação', 'Contato iniciado', 'Briefing recebido', 'Proposta enviada', 'Negociação', 'Ganho', 'Perdido'].includes(l.status)) totaisTratados++;
            }
        });

        const conversao = totaisTratados > 0 ? Math.round((ganhos / totaisTratados) * 100) : 0;

        document.getElementById('dash-novos').textContent = novos;
        document.getElementById('dash-andamento').textContent = andamento;
        document.getElementById('dash-ganhos').textContent = ganhos;
        document.getElementById('dash-conversao').textContent = conversao + '%';
    }

    document.getElementById('btn-view-table').addEventListener('click', (e) => {
        document.getElementById('crm-table-container').classList.remove('hidden');
        document.getElementById('crm-kanban-container').classList.add('hidden');
        e.target.classList.replace('text-gray-600', 'text-[#F6EEDC]');
        e.target.classList.replace('hover:bg-gray-100', 'bg-[#242322]');
        document.getElementById('btn-view-kanban').classList.replace('bg-[#242322]', 'hover:bg-gray-100');
        document.getElementById('btn-view-kanban').classList.replace('text-[#F6EEDC]', 'text-gray-600');
    });

    document.getElementById('btn-view-kanban').addEventListener('click', (e) => {
        document.getElementById('crm-kanban-container').classList.remove('hidden');
        document.getElementById('crm-table-container').classList.add('hidden');
        e.target.classList.replace('text-gray-600', 'text-[#F6EEDC]');
        e.target.classList.replace('hover:bg-gray-100', 'bg-[#242322]');
        document.getElementById('btn-view-table').classList.replace('bg-[#242322]', 'hover:bg-gray-100');
        document.getElementById('btn-view-table').classList.replace('text-[#F6EEDC]', 'text-gray-600');
    });

    document.getElementById('search-lead').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = currentLeads.filter(l => 
            l.name.toLowerCase().includes(term) || (l.business && l.business.toLowerCase().includes(term))
        );
        renderTable(filtered);
        renderKanban(filtered);
    });

    function getStatusColor(status) {
        if(status === 'Novo') return 'bg-blue-100 text-blue-700';
        if(status === 'Ganho') return 'bg-green-100 text-green-700';
        if(status === 'Perdido' || status === 'Arquivado') return 'bg-gray-200 text-gray-600';
        return 'bg-orange-100 text-orange-700';
    }

    function renderTable(leads) {
        const tbody = document.getElementById('leads-table-body');
        if (leads.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-500">Nenhum registro encontrado.</td></tr>`; return; }
        
        tbody.innerHTML = leads.map(lead => `
            <tr class="hover:bg-gray-50 border-b cursor-pointer transition" onclick="window.openCrmModal('${lead.id}')">
                <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold ${getStatusColor(lead.status)}">${lead.status}</span></td>
                <td class="p-4 font-bold text-gray-800">${lead.name} <br><span class="font-normal text-xs text-gray-500 uppercase">${lead.business}</span></td>
                <td class="p-4 text-gray-700 font-medium text-xs">${lead.service_interest || 'Não especificado'}</td>
                <td class="p-4 text-gray-500 text-xs">${new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                <td class="p-4 text-right"><button class="bg-gray-100 text-gray-700 px-4 py-1.5 rounded font-bold text-xs hover:bg-[#242322] hover:text-[#F6EEDC] transition">Gerenciar</button></td>
            </tr>
        `).join('');
    }

    function renderKanban(leads) {
        const container = document.getElementById('crm-kanban-container');
        container.innerHTML = PIPELINE_STATUSES.map(status => {
            const columnLeads = leads.filter(l => l.status === status);
            return `
                <div class="kanban-col bg-gray-100 p-4 rounded-xl border border-gray-200 flex-shrink-0">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-bold text-gray-700 uppercase text-xs tracking-wider">${status}</h4>
                        <span class="bg-white text-gray-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">${columnLeads.length}</span>
                    </div>
                    <div class="space-y-3">
                        ${columnLeads.map(l => `
                            <div onclick="window.openCrmModal('${l.id}')" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition">
                                <p class="font-bold text-gray-800 text-sm mb-1">${l.name}</p>
                                <p class="text-xs text-gray-500 uppercase truncate mb-2">${l.business}</p>
                                <p class="text-xs font-bold text-blue-600 bg-blue-50 w-max px-2 py-1 rounded">${l.estimated_budget || 'Sem orçamento'}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openCrmModal = function(id) {
        const lead = currentLeads.find(l => l.id === id);
        if (!lead) return;
        openedLeadId = id;
        document.getElementById('modal-name').textContent = lead.name;
        document.getElementById('modal-business').textContent = lead.business;
        document.getElementById('modal-interest').textContent = lead.service_interest || 'Não especificado';
        document.getElementById('modal-budget').textContent = lead.estimated_budget || 'Não definido';
        document.getElementById('modal-message').textContent = lead.message;
        document.getElementById('modal-phone').textContent = lead.phone;
        document.getElementById('modal-email').textContent = lead.email;
        document.getElementById('modal-notes').value = lead.internal_notes || '';
        document.getElementById('modal-date').textContent = 'Capturado em: ' + new Date(lead.created_at).toLocaleString('pt-BR');
        document.getElementById('btn-modal-wpp').href = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;
        document.getElementById('modal-status-select').value = lead.status;
        document.getElementById('note-msg').classList.add('hidden');
        document.getElementById('crm-modal').classList.remove('hidden');
    };

    window.closeCrmModal = function() { document.getElementById('crm-modal').classList.add('hidden'); openedLeadId = null; };

    document.getElementById('modal-status-select').addEventListener('change', async (e) => {
        if (!openedLeadId) return;
        const newStatus = e.target.value;
        const idx = currentLeads.findIndex(l => l.id === openedLeadId);
        currentLeads[idx].status = newStatus;
        
        const logEntry = { date: new Date().toISOString(), action: 'Status alterado para ' + newStatus };
        const newHistory = [...(currentLeads[idx].history_log || []), logEntry];
        currentLeads[idx].history_log = newHistory;

        updateDashboardStats();
        renderTable(currentLeads);
        renderKanban(currentLeads);
        await iamurelSupabase.from('iamurel_leads').update({ status: newStatus, history_log: newHistory }).eq('id', openedLeadId);
    });

    document.getElementById('btn-save-notes').addEventListener('click', async () => {
        if (!openedLeadId) return;
        const notes = document.getElementById('modal-notes').value;
        const idx = currentLeads.findIndex(l => l.id === openedLeadId);
        currentLeads[idx].internal_notes = notes;
        
        await iamurelSupabase.from('iamurel_leads').update({ internal_notes: notes }).eq('id', openedLeadId);
        const msg = document.getElementById('note-msg');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 2000);
    });

    async function handleSimpleInsert(tableName, dataObj, formId, reloadFunc) {
        const { error } = await iamurelSupabase.from(tableName).insert([dataObj]);
        if (!error) { document.getElementById(formId).reset(); reloadFunc(); }
        else alert('Erro ao salvar no banco de dados. Verifique a aba Console.');
    }
    
    async function handleSimpleDelete(tableName, id, reloadFunc) {
        if(confirm("Tem certeza que deseja excluir permanentemente este item?")) {
            await iamurelSupabase.from(tableName).delete().eq('id', id);
            reloadFunc();
        }
    }

    async function loadPackagesAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_packages').select('*').order('sort_order');
        document.getElementById('packages-list').innerHTML = (data||[]).map(pkg => `
            <div class="border p-4 rounded-xl bg-white flex flex-col shadow-sm">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-lg">${pkg.name}</h4>
                    <span class="text-xs px-2 py-1 rounded w-max ${pkg.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">${pkg.is_published ? 'Público' : 'Rascunho'}</span>
                </div>
                <span class="text-blue-600 font-bold mb-2">${pkg.price_value}</span>
                <button data-id="${pkg.id}" class="btn-del-pkg text-red-500 text-sm font-bold text-left mt-auto pt-2 border-t">Excluir Pacote</button>
            </div>`).join('');
            
        document.querySelectorAll('.btn-del-pkg').forEach(btn => btn.addEventListener('click', (e) => handleSimpleDelete('iamurel_packages', e.target.getAttribute('data-id'), loadPackagesAdmin)));
    }

    document.getElementById('form-new-package').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSimpleInsert('iamurel_packages', {
            name: document.getElementById('pkg-name').value, 
            price_value: document.getElementById('pkg-price').value,
            features_included: document.getElementById('pkg-included').value, 
            features_excluded: document.getElementById('pkg-excluded').value,
            is_published: document.getElementById('pkg-published').checked
        }, 'form-new-package', loadPackagesAdmin);
    });

    async function loadCasesAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_cases').select('*').order('sort_order');
        document.getElementById('cases-list').innerHTML = (data||[]).map(c => `<div class="border p-4 bg-white rounded-lg flex justify-between items-center"><div><p class="font-bold">${c.title}</p><p class="text-sm text-gray-500">${c.is_published ? 'Público' : 'Oculto'}</p></div><button data-id="${c.id}" class="btn-del-case text-red-500 text-sm font-bold">Apagar</button></div>`).join('');
        document.querySelectorAll('.btn-del-case').forEach(btn => btn.addEventListener('click', (e) => handleSimpleDelete('iamurel_cases', e.target.getAttribute('data-id'), loadCasesAdmin)));
    }
    document.getElementById('form-new-case').addEventListener('submit', (e) => {
        e.preventDefault(); handleSimpleInsert('iamurel_cases', { title: document.getElementById('case-title').value, description: document.getElementById('case-desc').value, image_url: document.getElementById('case-img').value, is_published: document.getElementById('case-published').checked }, 'form-new-case', loadCasesAdmin);
    });

    async function loadReviewsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_reviews').select('*').order('created_at');
        document.getElementById('reviews-list').innerHTML = (data||[]).map(r => `<div class="border p-4 bg-white rounded-lg flex justify-between items-center"><div><p class="font-bold">${r.client_name}</p></div><button data-id="${r.id}" class="btn-del-rev text-red-500 text-sm font-bold">Apagar</button></div>`).join('');
        document.querySelectorAll('.btn-del-rev').forEach(btn => btn.addEventListener('click', (e) => handleSimpleDelete('iamurel_reviews', e.target.getAttribute('data-id'), loadReviewsAdmin)));
    }
    document.getElementById('form-new-review').addEventListener('submit', (e) => {
        e.preventDefault(); handleSimpleInsert('iamurel_reviews', { client_name: document.getElementById('rev-name').value, review_text: document.getElementById('rev-text').value, is_published: document.getElementById('rev-published').checked }, 'form-new-review', loadReviewsAdmin);
    });

    async function loadFaqAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_faqs').select('*').order('sort_order');
        document.getElementById('faq-list').innerHTML = (data||[]).map(f => `<div class="border p-4 bg-white rounded-lg flex justify-between items-center"><div><p class="font-bold">${f.question}</p></div><button data-id="${f.id}" class="btn-del-faq text-red-500 text-sm font-bold">Apagar</button></div>`).join('');
        document.querySelectorAll('.btn-del-faq').forEach(btn => btn.addEventListener('click', (e) => handleSimpleDelete('iamurel_faqs', e.target.getAttribute('data-id'), loadFaqAdmin)));
    }
    document.getElementById('form-new-faq').addEventListener('submit', (e) => {
        e.preventDefault(); handleSimpleInsert('iamurel_faqs', { question: document.getElementById('faq-question').value, answer: document.getElementById('faq-answer').value, is_published: document.getElementById('faq-published').checked }, 'form-new-faq', loadFaqAdmin);
    });

    async function loadSettingsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
        if (data) {
            document.getElementById('app-logo-url').value = data.logo_url || '';
            document.getElementById('app-hero-title').value = data.hero_title || '';
            document.getElementById('app-hero-subtitle').value = data.hero_subtitle || '';
            document.getElementById('app-scenarios-title').value = data.section_scenarios_title || '';
            document.getElementById('app-method-title').value = data.section_method_title || '';
            document.getElementById('app-budget-options').value = data.form_budget_options || '';
            document.getElementById('app-whatsapp').value = data.contact_whatsapp || '';
            document.getElementById('app-email').value = data.contact_email || '';
            document.getElementById('app-instagram').value = data.contact_instagram || '';
        }
    }

    document.getElementById('form-appearance').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('app-msg'); msg.textContent = 'Salvando e atualizando o site público...';
        const updates = {
            logo_url: document.getElementById('app-logo-url').value, hero_title: document.getElementById('app-hero-title').value, hero_subtitle: document.getElementById('app-hero-subtitle').value,
            section_scenarios_title: document.getElementById('app-scenarios-title').value, section_method_title: document.getElementById('app-method-title').value, form_budget_options: document.getElementById('app-budget-options').value,
            contact_whatsapp: document.getElementById('app-whatsapp').value, contact_email: document.getElementById('app-email').value, contact_instagram: document.getElementById('app-instagram').value, updated_at: new Date()
        };
        const { data: s } = await iamurelSupabase.from('iamurel_site_settings').select('id').limit(1).maybeSingle();
        if (s) { await iamurelSupabase.from('iamurel_site_settings').update(updates).eq('id', s.id); msg.textContent = 'Site público atualizado com sucesso!'; msg.classList.add('text-green-500'); }
    });
});
