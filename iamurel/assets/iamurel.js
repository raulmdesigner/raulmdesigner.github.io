document.addEventListener("DOMContentLoaded", () => {
    
    // Função utilitária para abrir/fechar as perguntas do FAQ
    window.toggleFaq = function(id) {
        const answer = document.getElementById(`faq-answer-${id}`);
        const icon = document.getElementById(`faq-icon-${id}`);
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.style.transform = "rotate(0deg)";
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.style.transform = "rotate(45deg)";
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

                if (settings.primary_color) document.documentElement.style.setProperty('--primary-color', settings.primary_color);
                if (settings.hero_title) document.getElementById('iamurel-hero-title').innerHTML = settings.hero_title;
                if (settings.hero_subtitle) document.getElementById('iamurel-hero-subtitle').innerText = settings.hero_subtitle;

                // Contatos Externos (Fora do formulário)
                if (settings.contact_whatsapp && settings.contact_whatsapp.trim() !== '') {
                    document.querySelectorAll('.link-whatsapp').forEach(btn => {
                        btn.href = `https://wa.me/${settings.contact_whatsapp.replace(/\D/g,'')}`;
                        btn.classList.remove('hidden');
                        btn.classList.add('flex');
                    });
                }
                if (settings.contact_email && settings.contact_email.trim() !== '') {
                    document.querySelectorAll('.link-email').forEach(btn => {
                        btn.href = `mailto:${settings.contact_email}`;
                        btn.classList.remove('hidden');
                        btn.classList.add('flex');
                    });
                }
                if (settings.contact_instagram && settings.contact_instagram.trim() !== '') {
                    document.querySelectorAll('.link-instagram').forEach(btn => {
                        btn.href = settings.contact_instagram;
                        btn.classList.remove('hidden');
                        btn.classList.add('flex');
                    });
                }
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
            <div class="glass-panel p-8 flex flex-col hover:-translate-y-2 transition duration-300">
                <h4 class="text-2xl font-bold text-[#F6EEDC] mb-3">${pkg.name}</h4>
                <p class="text-gray-400 mb-8 flex-grow leading-relaxed">${pkg.description || ''}</p>
                <div class="text-3xl font-extrabold text-[#F6EEDC] mb-8">${pkg.price_value}</div>
                <a href="#contato" onclick="document.getElementById('iamurel-diagnostico').value='Ainda não sei, preciso de ajuda';" class="w-full text-center bg-[#F6EEDC] text-[#242322] py-4 rounded-xl font-bold hover:bg-white transition">Selecionar plano</a>
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
                <div class="glass-panel overflow-hidden group">
                    ${c.image_url ? `<div class="h-48 overflow-hidden"><img src="${c.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></div>` : ''}
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
                <div class="glass-panel p-6 cursor-pointer" onclick="toggleFaq('${f.id}')">
                    <div class="flex justify-between items-center">
                        <h4 class="font-bold text-lg">${f.question}</h4>
                        <span id="faq-icon-${f.id}" class="text-2xl font-bold transition-transform duration-300">+</span>
                    </div>
                    <div id="faq-answer-${f.id}" class="faq-answer mt-0">
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
            btn.textContent = 'Enviando...'; btn.disabled = true;

            const diagnostico = document.getElementById('iamurel-diagnostico').value;
            const mensagemBruta = document.getElementById('iamurel-mensagem').value;
            const mensagemFinal = `[Interesse: ${diagnostico}] \n\n${mensagemBruta}`;

            const newLead = {
                name: document.getElementById('iamurel-nome').value,
                email: document.getElementById('iamurel-email').value,
                phone: document.getElementById('iamurel-telefone').value,
                business: document.getElementById('iamurel-negocio').value,
                message: mensagemFinal
            };

            const { error } = await iamurelSupabase.from('iamurel_leads').insert([newLead]);

            const msgDiv = document.getElementById('iamurel-form-message');
            if (error) {
                msgDiv.innerHTML = '<p class="text-red-400 mt-4 font-bold">Falha de conexão. Tente nossos canais rápidos acima.</p>';
            } else {
                msgDiv.innerHTML = '<p class="text-emerald-400 mt-4 font-bold">Diagnóstico enviado com sucesso! Entraremos em contato.</p>';
                leadForm.reset();
            }
            btn.textContent = 'Solicitar Proposta'; btn.disabled = false;
        });
    }

    loadSettings();
    loadPackages();
    loadCases();
    loadReviews();
    loadFaqs();
});
