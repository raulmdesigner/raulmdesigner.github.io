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

            if (error) throw error;

            if (!packages || packages.length === 0) {
                packagesContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Nenhum pacote disponível no momento.</p>';
                return;
            }

            packagesContainer.innerHTML = packages.map(pkg => `
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h4 class="text-2xl font-bold text-slate-900 mb-2">${pkg.name}</h4>
                    <p class="text-gray-600 mb-6 flex-grow">${pkg.description || ''}</p>
                    <div class="text-2xl font-extrabold text-blue-600 mb-6">${pkg.price_value}</div>
                    <a href="#iamurel-contato" class="w-full text-center bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition">Selecionar plano</a>
                </div>
            `).join('');

        } catch (error) {
            console.error("Erro ao carregar pacotes:", error);
            packagesContainer.innerHTML = '<p class="text-red-500">Erro ao carregar pacotes.</p>';
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
                formMessage.innerHTML = '<p class="text-red-500 mt-4">Ocorreu um erro. Tente novamente.</p>';
            } else {
                formMessage.innerHTML = '<p class="text-green-600 mt-4 font-bold">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>';
                leadForm.reset();
            }
            
            submitBtn.textContent = 'Enviar Pedido';
            submitBtn.disabled = false;
        });
    }

    loadPackages();
});
