document.addEventListener("DOMContentLoaded", () => {
    
    // Lógica para revelar o campo "Outro" no formulário
    const selectNecessidade = document.getElementById('iamurel-necessidade');
    const inputNecessidadeOutro = document.getElementById('iamurel-necessidade-outro');
    
    if (selectNecessidade && inputNecessidadeOutro) {
        selectNecessidade.addEventListener('change', (e) => {
            if (e.target.value === 'Outro') {
                inputNecessidadeOutro.classList.remove('hidden');
                inputNecessidadeOutro.required = true;
            } else {
                inputNecessidadeOutro.classList.add('hidden');
                inputNecessidadeOutro.required = false;
            }
        });
    }

    async function loadSettings() {
        try {
            const { data: settings } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
            if (settings) {
                if (settings.logo_url) document.getElementById('iamurel-logo-container').innerHTML = `<img src="${settings.logo_url}" class="h-10 object-contain">`;
                if (settings.hero_title) document.getElementById('iamurel-hero-title').innerHTML = settings.hero_title;
                if (settings.hero_subtitle) document.getElementById('iamurel-hero-subtitle').innerText = settings.hero_subtitle;
                if (settings.section_scenarios_title) document.getElementById('iamurel-scenarios-title').innerText = settings.section_scenarios_title;
                if (settings.section_method_title) document.getElementById('iamurel-method-title').innerText = settings.section_method_title;
                
                // Popular opções de orçamento customizáveis
                if (settings.form_budget_options) {
                    const selectOrcamento = document.getElementById('iamurel-orcamento');
                    const options = settings.form_budget_options.split('\n').filter(opt => opt.trim() !== '');
                    options.forEach(opt => {
                        const newOption = document.createElement('option');
                        newOption.value = opt.trim();
                        newOption.textContent = opt.trim();
                        selectOrcamento.appendChild(newOption);
                    });
                }
            }
        } catch (error) { console.error("Erro visual", error); }
    }

    async function loadPackages() {
        const container = document.getElementById('iamurel-packages-container');
        const { data: packages } = await iamurelSupabase.from('iamurel_packages').select('*').eq('is_published', true).order('sort_order');
        
        if (!packages || packages.length === 0) return;

        container.innerHTML = packages.map(pkg => {
            // Transforma o texto com quebras de linha em uma lista visual bonita
            const processList = (text, icon, colorClass) => {
                if (!text) return '';
                return text.split('\n').filter(line => line.trim() !== '').map(line => 
                    `<li class="flex items-start gap-2 text-sm text-gray-300 mb-2">
                        <span class="font-bold ${colorClass}">${icon}</span> ${line.trim()}
                    </li>`
                ).join('');
            };

            const includedHtml = processList(pkg.features_included, '✓', 'text-green-400');
            const excludedHtml = processList(pkg.features_excluded, '✗', 'text-red-400');

            return `
            <div class="glass-panel p-8 flex flex-col hover:-translate-y-2 transition duration-300 border-t-4 border-t-[#F6EEDC]">
                <h4 class="text-2xl font-bold text-[#F6EEDC] mb-2">${pkg.name}</h4>
                <div class="text-3xl font-extrabold text-[#F6EEDC] mb-6 mt-4">${pkg.price_value}</div>
                <ul class="mb-8 flex-grow">
                    ${includedHtml}
                    ${excludedHtml}
                </ul>
                <a href="#diagnostico" onclick="document.getElementById('iamurel-necessidade').value='Não tenho certeza, preciso de ajuda';" class="w-full text-center border border-[#F6EEDC] text-[#F6EEDC] py-3 rounded-xl font-bold hover:bg-[#F6EEDC] hover:text-[#242322] transition mt-auto">Selecionar este</a>
            </div>
            `;
        }).join('');
    }

    const leadForm = document.getElementById('iamurel-lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button[type="submit"]');
            btn.textContent = 'Processando...'; btn.disabled = true;

            let necessidadeFinal = selectNecessidade.value;
            if (necessidadeFinal === 'Outro') necessidadeFinal = inputNecessidadeOutro.value;

            const newLead = {
                name: document.getElementById('iamurel-nome').value,
                email: document.getElementById('iamurel-email').value,
                phone: document.getElementById('iamurel-telefone').value,
                business: document.getElementById('iamurel-negocio').value,
                service_interest: necessidadeFinal,
                estimated_budget: document.getElementById('iamurel-orcamento').value,
                message: document.getElementById('iamurel-mensagem').value,
                status: 'Novo'
            };

            const { error } = await iamurelSupabase.from('iamurel_leads').insert([newLead]);
            const msgDiv = document.getElementById('iamurel-form-message');
            if (error) msgDiv.innerHTML = '<p class="text-red-400 mt-4 font-bold">Falha de conexão.</p>';
            else { msgDiv.innerHTML = '<p class="text-emerald-400 mt-4 font-bold text-lg">Diagnóstico recebido com sucesso!</p>'; leadForm.reset(); }
            btn.textContent = 'Enviar Diagnóstico'; btn.disabled = false;
        });
    }
    loadSettings();
    loadPackages();
});
