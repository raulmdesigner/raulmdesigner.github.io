document.addEventListener("DOMContentLoaded", () => {
    
    window.toggleFaq = function(id) {
        const answer = document.getElementById(`faq-answer-${id}`);
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    };

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

    // CORREÇÃO: Função para ser chamada quando clicar em um pacote
    window.selectPackage = function(packageName) {
        if (selectNecessidade && inputNecessidadeOutro) {
            selectNecessidade.value = 'Outro';
            inputNecessidadeOutro.classList.remove('hidden');
            inputNecessidadeOutro.required = true;
            inputNecessidadeOutro.value = `Interesse no plano: ${packageName}`;
        }
    };

    async function loadSettings() {
        try {
            const { data: settings } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
            if (settings) {
                if (settings.logo_url) document.getElementById('iamurel-logo-container').innerHTML = `<img src="${settings.logo_url}" class="h-10 object-contain">`;
                if (settings.hero_title) document.getElementById('iamurel-hero-title').innerHTML = settings.hero_title;
                if (settings.hero_subtitle) document.getElementById('iamurel-hero-subtitle').innerText = settings.hero_subtitle;
                if (settings.section_scenarios_title) document.getElementById('iamurel-scenarios-title').innerText = settings.section_scenarios_title;
                if (settings.section_method_title) document.getElementById('iamurel-method-title').innerText = settings.section_method_title;
                
                if (settings.form_budget_options) {
                    const selectOrcamento = document.getElementById('iamurel-orcamento');
                    selectOrcamento.innerHTML = '<option value="Não definido">Ainda não defini</option>'; 
                    const options = settings.form_budget_options.split('\n').filter(opt => opt.trim() !== '');
                    options.forEach(opt => {
                        const newOption = document.createElement('option');
                        newOption.value = opt.trim();
                        newOption.textContent = opt.trim();
                        selectOrcamento.appendChild(newOption);
                    });
                }

                const applyLink = (selector, url) => {
                    if (url && url.trim() !== '') {
                        document.querySelectorAll(selector).forEach(btn => {
                            btn.href = url;
                            btn.classList.remove('hidden');
                            btn.classList.add('inline-flex');
                        });
                    }
                };
                applyLink('.link-whatsapp', settings.contact_whatsapp ? `https://wa.me/${settings.contact_whatsapp.replace(/\D/g,'')}` : null);
                applyLink('.link-email', settings.contact_email ? `mailto:${settings.contact_email}` : null);
                applyLink('.link-instagram', settings.contact_instagram);
            }
        } catch (error) { console.error("Erro ao processar o visual", error); }
    }

    async function loadPackages() {
        const container = document.getElementById('iamurel-packages-container');
        const { data: packages } = await iamurelSupabase.from('iamurel_packages').select('*').eq('is_published', true).order('sort_order');
        
        if (!packages || packages.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-500">Montando opções...</p>';
            return;
        }

        container.innerHTML = packages.map(pkg => {
            const processList = (text, icon, colorClass) => {
                if (!text) return '';
                return text.split('\n').filter(line => line.trim() !== '').map(line => 
                    `<li class="flex items-start gap-3 text-sm text-gray-300 mb-3">
                        <span class="font-bold ${colorClass}">${icon}</span> <span class="leading-relaxed">${line.trim()}</span>
                    </li>`
                ).join('');
            };

            const includedHtml = processList(pkg.features_included, '✓', 'text-green-400');
            const excludedHtml = processList(pkg.features_excluded, '✗', 'text-red-400');

            return `
            <div class="glass-panel p-8 flex flex-col hover:-translate-y-2 transition duration-300 border-t-4 border-t-[#F6EEDC]">
                <h4 class="text-2xl font-bold text-[#F6EEDC] mb-2">${pkg.name}</h4>
                <p class="text-gray-400 mb-6 text-sm leading-relaxed">${pkg.description || ''}</p>
                <div class="text-3xl font-extrabold text-[#F6EEDC] mb-8">${pkg.price_value}</div>
                <ul class="mb-8 flex-grow">
                    ${includedHtml}
                    ${excludedHtml}
                </ul>
                <a href="#diagnostico" onclick="window.selectPackage('${pkg.name}')" class="w-full text-center border border-[#F6EEDC] text-[#F6EEDC] py-3 rounded-xl font-bold hover:bg-[#F6EEDC] hover:text-[#242322] transition mt-auto">Selecionar este</a>
            </div>
            `;
        }).join('');
    }

    async function loadCases() {
        const section = document.getElementById('portfolio');
        const container = document.getElementById('iamurel-cases-container');
        const { data: cases } = await iamurelSupabase.from('iamurel_cases').select('*').eq('is_published', true).order('sort_order');
        
        if (cases && cases.length > 0) {
            section.classList.remove('hidden');
            container.innerHTML = cases.map(c => `
                <div class="glass-panel overflow-hidden group">
                    ${c.image_url ? `<div class="h-56 overflow-hidden"><img src="${c.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></div>` : ''}
                    <div class="p-6">
                        <h4 class="font-bold text-xl mb-2">${c.title}</h4>
                        <p class="text-gray-400 text-sm leading-relaxed">${c.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    async function loadReviews() {
        const section = document.getElementById('avaliacoes');
        const container = document.getElementById('iamurel-reviews-container');
        const { data: reviews } = await iamurelSupabase.from('iamurel_reviews').select('*').eq('is_published', true).order('created_at', {ascending: false});
        
        if (reviews && reviews.length > 0) {
            section.classList.remove('hidden');
            container.innerHTML = reviews.map(r => `
                <div class="glass-panel p-8">
                    <p class="text-gray-300 italic mb-6 leading-relaxed">"${r.review_text}"</p>
                    <p class="font-bold text-[#F6EEDC]">— ${r.client_name}</p>
                </div>
            `).join('');
        }
    }

    async function loadFaqs() {
        const section = document.getElementById('faq');
        const container = document.getElementById('iamurel-faq-container');
        const { data: faqs } = await iamurelSupabase.from('iamurel_faqs').select('*').eq('is_published', true).order('sort_order');
        
        if (faqs && faqs.length > 0) {
            section.classList.remove('hidden');
            container.innerHTML = faqs.map(f => `
                <div class="glass-panel p-6 cursor-pointer hover:bg-white/5 transition" onclick="toggleFaq('${f.id}')">
                    <div class="flex justify-between items-center">
                        <h4 class="font-bold text-lg">${f.question}</h4>
                        <span class="text-xl font-bold text-gray-400">+</span>
                    </div>
                    <div id="faq-answer-${f.id}" class="faq-answer">
                        <p class="text-gray-400 pt-4 leading-relaxed">${f.answer}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    const leadForm = document.getElementById('iamurel-lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button[type="submit"]');
            btn.textContent = 'Processando...'; 
            btn.disabled = true;

            let necessidadeFinal = selectNecessidade.value;
            if (necessidadeFinal === 'Outro') {
                necessidadeFinal = inputNecessidadeOutro.value;
            }

            const newLead = {
                name: document.getElementById('iamurel-nome').value,
                email: document.getElementById('iamurel-email').value,
                phone: document.getElementById('iamurel-telefone').value,
                business: document.getElementById('iamurel-negocio').value,
                service_interest: necessidadeFinal,
                estimated_budget: document.getElementById('iamurel-orcamento').value,
                message: document.getElementById('iamurel-mensagem').value,
                consent_given: document.getElementById('iamurel-consentimento').checked,
                origin: 'Site Público - Diagnóstico',
                status: 'Novo'
            };

            const { error } = await iamurelSupabase.from('iamurel_leads').insert([newLead]);
            const msgDiv = document.getElementById('iamurel-form-message');
            
            if (error) {
                msgDiv.innerHTML = '<p class="text-red-400 mt-4 font-bold">Falha de conexão. Por favor, contate-nos via WhatsApp.</p>';
                console.error("Erro na captação:", error);
            } else { 
                msgDiv.innerHTML = '<p class="text-emerald-400 mt-4 font-bold text-lg">Diagnóstico recebido com sucesso! Nossa equipe entrará em contato.</p>'; 
                leadForm.reset();
                inputNecessidadeOutro.classList.add('hidden');
            }
            
            btn.textContent = 'Solicitar Proposta'; 
            btn.disabled = false;
        });
    }

    loadSettings();
    loadPackages();
    loadCases();
    loadReviews();
    loadFaqs();
});
