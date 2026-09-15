document.addEventListener("DOMContentLoaded", () => {
    const packagesContainer = document.getElementById('iamurel-packages-container');
    const leadForm = document.getElementById('iamurel-lead-form');
    const formMessage = document.getElementById('iamurel-form-message');

    async function loadSettings() {
        try {
            // maybeSingle() evita que o site quebre se a tabela estiver vazia
            const { data: settings, error } = await iamurelSupabase
                .from('iamurel_site_settings')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (settings) {
                const logoContainer = document.getElementById('iamurel-logo-container');
                if (settings.logo_url && settings.logo_url.trim() !== '') {
                    logoContainer.innerHTML = `<img src="${settings.logo_url}" alt="IAMUREL" class="h-8 md:h-10 object-contain">`;
                }

                if (settings.primary_color) {
                    document.documentElement.style.setProperty('--primary-color', settings.primary_color);
                }

                if (settings.hero_title) document.getElementById('iamurel-hero-title').innerHTML = settings.hero_title;
                if (settings.hero_subtitle) document.getElementById('iamurel-hero-subtitle').innerText = settings.hero_subtitle;

                const wppButtons = document.querySelectorAll('.link-whatsapp');
                if (settings.contact_whatsapp && settings.contact_whatsapp.trim() !== '') {
                    wppButtons.forEach(btn => {
                        btn.href = `https://wa.me/${settings.contact_whatsapp.replace(/\D/g,'')}`;
                        btn.classList.remove('hidden');
                    });
                }

                const emailButtons = document.querySelectorAll('.link-email');
                if (settings.contact_email && settings.contact_email.trim() !== '') {
                    emailButtons.forEach(btn => {
                        btn.href = `mailto:${settings.contact_email}`;
                        btn.classList.remove('hidden');
                    });
                }

                const instButtons = document.querySelectorAll('.link-instagram');
                if (settings.contact_instagram && settings.contact_instagram.trim() !== '') {
                    instButtons.forEach(btn => {
                        btn.href = settings.contact_instagram;
                        btn.classList.remove('hidden');
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao carregar configurações de aparência", error);
        }
    }

    async function loadPackages() {
        try {
            const { data: packages, error } = await iamurelSupabase
                .from('iamurel_packages')
                .select('*')
                .eq('is_published', true)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error("Erro de permissão no Supabase:", error);
                throw error;
            }

            if (!packages || packages.length === 0) {
                packagesContainer.innerHTML = '<p class="text-center col-span-full text-gray-500">Nenhum pacote disponível.</p>';
                return;
            }

            packagesContainer.innerHTML = packages.map(pkg => `
                <div class="glass-panel p-8 flex flex-col hover:-translate-y-2 transition duration-300">
                    <h4 class="text-2xl font-bold text-[#F6EEDC] mb-3">${pkg.name}</h4>
                    <p class="text-gray-400 mb-8 flex-grow leading-relaxed">${pkg.description || ''}</p>
                    <div class="text-3xl font-extrabold text-[#F6EEDC] mb-8">${pkg.price_value}</div>
                    <a href="#contato" class="w-full text-center bg-[#F6EEDC] text-[#242322] py-4 rounded-xl font-bold hover:bg-white transition">Selecionar plano</a>
                </div>
            `).join('');
        } catch (error) {
            packagesContainer.innerHTML = '<p class="text-red-400 text-center col-span-full">Verifique a aba Console (F12) para detalhes do erro.</p>';
        }
    }

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const newLead = {
                name: document.getElementById('iamurel-nome').value,
                email: document.getElementById('iamurel-email').value,
                phone: document.getElementById('iamurel-telefone').value,
                business: document.getElementById('iamurel-negocio').value,
                message: document.getElementById('iamurel-mensagem').value
            };

            const { error } = await iamurelSupabase.from('iamurel_leads').insert([newLead]);

            if (error) {
                formMessage.innerHTML = '<p class="text-red-400 mt-4">Falha de comunicação com o banco de dados.</p>';
                console.error("Erro no formulário:", error);
            } else {
                formMessage.innerHTML = '<p class="text-emerald-400 mt-4 font-bold">Mensagem enviada com sucesso! Entraremos em contato.</p>';
                leadForm.reset();
            }
            submitBtn.textContent = 'Solicitar Orçamento';
            submitBtn.disabled = false;
        });
    }

    // Chama as duas funções independentemente
    loadSettings();
    loadPackages();
});
