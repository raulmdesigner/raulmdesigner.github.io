document.addEventListener("DOMContentLoaded", () => {
    const loginView = document.getElementById('iamurel-login-view');
    const dashboardView = document.getElementById('iamurel-dashboard-view');
    const loginForm = document.getElementById('iamurel-login-form');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');
    const leadsTableBody = document.getElementById('leads-table-body');

    // Verifica automaticamente se o usuário já tem uma sessão ativa salva no navegador
    iamurelSupabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            showDashboard();
            loadLeads();
        } else {
            showLogin();
        }
    });

    // Função para realizar o login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const submitBtn = loginForm.querySelector('button');
            
            submitBtn.textContent = 'Autenticando...';
            submitBtn.disabled = true;

            const { error } = await iamurelSupabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                loginError.textContent = 'Acesso negado. Verifique e-mail e senha.';
                loginError.classList.remove('hidden');
                submitBtn.textContent = 'Entrar no Studio';
                submitBtn.disabled = false;
            }
        });
    }

    // Função para sair do painel
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await iamurelSupabase.auth.signOut();
        });
    }

    // Busca os contatos no banco de dados
    async function loadLeads() {
        try {
            // A leitura só funciona porque você fez login e a regra RLS permite administradores
            const { data: leads, error } = await iamurelSupabase
                .from('iamurel_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!leads || leads.length === 0) {
                leadsTableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">Nenhum contato recebido ainda.</td></tr>';
                return;
            }

            leadsTableBody.innerHTML = leads.map(lead => {
                const date = new Date(lead.created_at).toLocaleDateString('pt-BR');
                return `
                    <tr class="hover:bg-gray-50 transition">
                        <td class="p-4">
                            <div class="font-bold text-[#242322]">${lead.name}</div>
                            <div class="text-sm text-gray-500">${lead.email} | ${lead.phone}</div>
                        </td>
                        <td class="p-4 text-gray-700">${lead.business}</td>
                        <td class="p-4 text-gray-500">${date}</td>
                        <td class="p-4">
                            <button onclick="alert('Mensagem: ${lead.message}')" class="text-blue-600 hover:underline font-medium">Ler Mensagem</button>
                        </td>
                    </tr>
                `;
            }).join('');

        } catch (error) {
            console.error("Erro ao carregar leads:", error);
            leadsTableBody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-red-500">Erro ao carregar os dados.</td></tr>';
        }
    }

    // Funções de controle de tela
    function showLogin() {
        loginView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
    }

    function showDashboard() {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
    }
});
