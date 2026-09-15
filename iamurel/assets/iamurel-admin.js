document.addEventListener("DOMContentLoaded", () => {
    let currentLeads = [];
    const views = { inbox: document.getElementById('view-inbox'), packages: document.getElementById('view-packages'), appearance: document.getElementById('view-appearance') };

    iamurelSupabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            document.getElementById('iamurel-login-view').classList.add('hidden');
            document.getElementById('iamurel-dashboard-view').classList.remove('hidden');
            loadLeads(); loadPackagesAdmin(); loadSettingsAdmin();
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

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            Object.values(views).forEach(v => v.classList.add('hidden'));
            const targetId = e.target.id.replace('btn-nav-', 'view-');
            if (views[targetId]) views[targetId].classList.remove('hidden');
        });
    });

    async function loadLeads() {
        const tbody = document.getElementById('leads-table-body');
        const { data } = await iamurelSupabase.from('iamurel_leads').select('*').order('created_at', { ascending: false });
        if (data) {
            currentLeads = data;
            tbody.innerHTML = data.map(lead => `
                <tr class="hover:bg-gray-50 border-b">
                    <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">${lead.status}</span></td>
                    <td class="p-4 font-bold text-gray-800">${lead.name} <br><span class="font-normal text-sm text-gray-500">${lead.business}</span></td>
                    <td class="p-4 text-gray-500">${new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                    <td class="p-4 text-right"><button onclick="window.openCrmModal('${lead.id}')" class="bg-[#242322] text-[#F6EEDC] px-4 py-1.5 rounded font-bold text-xs hover:bg-black transition">Abrir</button></td>
                </tr>
            `).join('');
        }
    }

    window.openCrmModal = function(id) {
        const lead = currentLeads.find(l => l.id === id);
        if (!lead) return;
        document.getElementById('modal-name').textContent = lead.name;
        document.getElementById('modal-business').textContent = lead.business;
        document.getElementById('modal-interest').textContent = lead.service_interest || 'N/A';
        document.getElementById('modal-budget').textContent = lead.estimated_budget || 'N/A';
        document.getElementById('modal-message').textContent = lead.message;
        document.getElementById('modal-phone').textContent = lead.phone;
        document.getElementById('modal-email').textContent = lead.email;
        document.getElementById('btn-modal-wpp').href = `https://wa.me/${lead.phone.replace(/\D/g,'')}`;
        document.getElementById('crm-modal').classList.remove('hidden');
    };

    window.closeCrmModal = function() { document.getElementById('crm-modal').classList.add('hidden'); };

    async function loadPackagesAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_packages').select('*').order('sort_order');
        if (data) {
            document.getElementById('packages-list').innerHTML = data.map(pkg => `
                <div class="border p-4 rounded-xl bg-white flex flex-col shadow-sm">
                    <h4 class="font-bold text-lg">${pkg.name}</h4><span class="text-blue-600 font-bold mb-2">${pkg.price_value}</span>
                    <button onclick="iamurelSupabase.from('iamurel_packages').delete().eq('id','${pkg.id}').then(()=>loadPackagesAdmin())" class="text-red-500 text-sm font-bold text-left mt-2">Apagar Pacote</button>
                </div>`).join('');
        }
    }

    document.getElementById('form-new-package').addEventListener('submit', async (e) => {
        e.preventDefault();
        await iamurelSupabase.from('iamurel_packages').insert([{
            name: document.getElementById('pkg-name').value, price_value: document.getElementById('pkg-price').value,
            features_included: document.getElementById('pkg-included').value, features_excluded: document.getElementById('pkg-excluded').value,
            is_published: document.getElementById('pkg-published').checked
        }]);
        e.target.reset(); loadPackagesAdmin();
    });

    async function loadSettingsAdmin() {
        const { data } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
        if (data) {
            document.getElementById('app-hero-title').value = data.hero_title || '';
            document.getElementById('app-hero-subtitle').value = data.hero_subtitle || '';
            document.getElementById('app-scenarios-title').value = data.section_scenarios_title || '';
            document.getElementById('app-method-title').value = data.section_method_title || '';
            document.getElementById('app-budget-options').value = data.form_budget_options || '';
        }
    }

    document.getElementById('form-appearance').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('app-msg'); msg.textContent = 'Atualizando...';
        const updates = {
            hero_title: document.getElementById('app-hero-title').value,
            hero_subtitle: document.getElementById('app-hero-subtitle').value,
            section_scenarios_title: document.getElementById('app-scenarios-title').value,
            section_method_title: document.getElementById('app-method-title').value,
            form_budget_options: document.getElementById('app-budget-options').value
        };
        const { data: s } = await iamurelSupabase.from('iamurel_site_settings').select('id').limit(1).maybeSingle();
        if (s) { await iamurelSupabase.from('iamurel_site_settings').update(updates).eq('id', s.id); msg.textContent = 'Salvo com sucesso!'; }
    });
});
