document.addEventListener("DOMContentLoaded", () => {
    const packagesContainer = document.getElementById('iamurel-packages-container');
    const leadForm = document.getElementById('iamurel-lead-form');
    const formMessage = document.getElementById('iamurel-form-message');

    async function loadPackages() {
        try {
            const { data: packages, error } = await iamurelSupabase
                .from('iamurel_packages')
                .select('*')
                .eq('is_published', true)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            if (!packages || packages.length === 0) {
                packagesContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center">Nenhum pacote disponível no momento.</p>';
                return;
            }

            packagesContainer.innerHTML = packages.map(pkg => `
                <div class="glass-effect p-8 rounded-3xl flex flex-col hover:-translate-y-2 transition duration-300">
                    <h4 class="text-2xl font-bold text-white mb-3">${pkg.name}</h4>
                    <p class="text-gray-400 mb-8 flex-grow leading-relaxed">${pkg.description || ''}</p>
                    <div class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-8">${pkg.price_value}</div>
                    <a href="#iamurel-contato" class="w-full text-center glass-button text-white py-4 rounded-xl font-medium">Selecionar plano</a>
                </div>
            `).join('');

        } catch (error) {
            console.error("Erro completo ao carregar pacotes:", error);
            packagesContainer.innerHTML = '<p class="text-red-400 text-center col-span-full">Verifique o console (F12) para ver o erro de conexão.</p>';
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
                console.error("Erro ao salvar lead:", error);
                formMessage.innerHTML = '<p class="text-red-400 mt-4">Falha ao conectar. Veja o console (F12).</p>';
            } else {
                formMessage.innerHTML = '<p class="text-emerald-400 mt-4 font-bold">Mensagem enviada com sucesso! Entraremos em contato.</p>';
                leadForm.reset();
            }
            
            submitBtn.textContent = 'Enviar Pedido';
            submitBtn.disabled = false;
        });
    }

    loadPackages();
});
