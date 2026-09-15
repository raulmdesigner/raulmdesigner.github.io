document.addEventListener("DOMContentLoaded", () => {
    window.toggleFaq = function(id) {
        const answer = document.getElementById(`faq-answer-${id}`);
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    };

    async function loadSettings() {
        try {
            const { data: settings } = await iamurelSupabase.from('iamurel_site_settings').select('*').limit(1).maybeSingle();
            if (settings) {
                const logoContainer = document.getElementById('iamurel-logo-container');
                if (settings.logo_url && settings.logo_url.trim() !== '') {
                    logoContainer.innerHTML = `<img src="${settings.logo_url}" alt="IAMUREL" class="h-8 md:h-10 object-contain">`;
                }

                if (settings.hero_title) document.getElementById('iamurel-hero-title').innerHTML = settings.hero_title;
                if (settings.hero_subtitle) document.getElementById('iamurel-hero-subtitle').innerText = settings.hero_subtitle;

                const applyLink = (selector, url) => {
                    if (url && url.trim() !== '') {
                        document.querySelectorAll(selector).forEach(btn => {
                            btn.href = url;
                            btn.classList.remove('hidden');
                        });
                    }
                };
                applyLink('.link-whatsapp', settings.contact_whatsapp ? `https://wa.me/${settings.contact_whatsapp.replace(/\D/g,'')}` : null);
                applyLink('.link-email', settings.contact_email ? `mailto:${settings.contact_email}` : null);
                applyLink('.link-instagram', settings.contact_instagram);
            }
        } catch (error) { console.error("Erro visual", error); }
    }

    async function loadPackages() {
        const container = document.getElementById('iamurel-packages-container');
        const { data: packages } = await iamurelSupabase.from('iamurel_packages').select('*').eq('is_published', true).order('sort_order');
        
        if (!packages || packages.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full text-gray-500">Montando opções...</p>';
            return;
        }

        container.innerHTML = packages.map(pkg => `
            <div class="glass-panel p-8 flex flex-col hover:-translate-y-2 transition duration-300 border-t-4 border-t-[#F6EEDC]">
                <h4 class="text-2xl font-bold text-[#F6EEDC] mb-2">${pkg.name}</h4>
                <p class="text-gray-400 mb-6 flex-grow text-sm leading-relaxed">${pkg.description || ''}</p>
                <div class="text-3xl font-extrabold text-[#F6EEDC] mb-6">${pkg.price_value}</div>
                <a href="#diagnostico" onclick="document.getElementById('iamurel-necessidade').value='Não tenho certeza, preciso de ajuda';" class="w-full text-center border border-[#F6EEDC] text-[#F6EEDC] py-3 rounded-xl font-bold hover:bg-[#F6EEDC] hover:text-[#242322] transition">Selecionar este</a>
            </div>
        `).join('');
    }

    async function loadCases() {
        const section = document.getElementById('portfolio');
        const container = document.getElementById('iamurel-cases-container');
        const { data: cases } = await iamurelSupabase.from('iamurel_cases').select('*').eq('is_published', true).order('sort_order');
        
        if (cases && cases.length > 0) {
            section.classList.remove('hidden');
            container.innerHTML = cases.map(c => `
                <div class="glass-panel overflow-hidden">
                    ${c.image_url ? `<div class="h-56 overflow-hidden"><img src="${c.image_url}" class="w-full h-full object-cover"></div>` : ''}
                    <div class="p-6">
                        <h4 class="font-bold text-xl mb-2">${c.title}</h4>
                        <p class="text-gray-400 text-sm leading-relaxed">${c.description}</p>
                    </div>
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
                <div class="glass-panel p-6 cursor-pointer" onclick="toggleFaq('${f.id}')">
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
            btn.textContent = 'Processando...'; btn.disabled = true;

            const newLead = {
                name: document.getElementById('iamurel-nome').value,
                contact_info: document.getElementById('iamurel-email').value, // Fallback p/ campo antigo se existir
                email: document.getElementById('iamurel-email').value,
                phone: document.getElementById('iamurel-telefone').value,
                business: document.getElementById('iamurel-negocio').value,
                service_interest: document.getElementById('iamurel-necessidade').value,
                estimated_budget: document.getElementById('iamurel-orcamento').value,
                message: document.getElementById('iamurel-mensagem').value,
                consent_given: document.getElementById('iamurel-consentimento').checked,
                origin: 'Site Público - Diagnóstico',
                status: 'Novo'
            };

            const { error } = await iamurelSupabase.from('iamurel_leads').insert([newLead]);

            const msgDiv = document.getElementById('iamurel-form-message');
            if (error) {
                msgDiv.innerHTML = '<p class="text-red-400 mt-4 font-bold">Falha de conexão. Verifique sua internet ou contate-nos via WhatsApp.</p>';
                console.error(error);
            } else {
                msgDiv.innerHTML = '<p class="text-emerald-400 mt-4 font-bold text-lg">Diagnóstico recebido com sucesso! Nossa equipe analisará os dados e entrará em contato em breve.</p>';
                leadForm.reset();
            }
            btn.textContent = 'Enviar Diagnóstico'; btn.disabled = false;
        });
    }

    loadSettings();
    loadPackages();
    loadCases();
    loadFaqs();
});
