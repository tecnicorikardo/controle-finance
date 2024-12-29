document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-financas');
    const tbody = document.querySelector('#tabela-transacoes tbody');
    const resumoReceitas = document.getElementById('resumo-receitas');
    const resumoDespesas = document.getElementById('resumo-despesas');
    const resumoSaldo = document.getElementById('resumo-saldo');
    const btnRelatorio = document.getElementById('gerar-relatorio');

    let transacoes = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const data = document.getElementById('data').value;
        const categoria = document.getElementById('categoria').value;
        const status = document.getElementById('status').value;

        const transacao = { descricao, valor, data, categoria, status, id: Date.now() };
        transacoes.push(transacao);

        adicionarTransacaoNaTabela(transacao);
        atualizarResumo();
        form.reset();
    });

    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id);
            transacoes = transacoes.filter(transacao => transacao.id !== id);
            e.target.closest('tr').remove();
            atualizarResumo();
        }

        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id);
            const transacao = transacoes.find(transacao => transacao.id === id);

            document.getElementById('descricao').value = transacao.descricao;
            document.getElementById('valor').value = transacao.valor;
            document.getElementById('data').value = transacao.data;
            document.getElementById('categoria').value = transacao.categoria;
            document.getElementById('status').value = transacao.status;

            transacoes = transacoes.filter(transacao => transacao.id !== id);
            e.target.closest('tr').remove();
            atualizarResumo();
        }
    });

    btnRelatorio.addEventListener('click', gerarRelatorio);

    function adicionarTransacaoNaTabela(transacao) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transacao.descricao}</td>
            <td>R$ ${transacao.valor.toFixed(2)}</td>
            <td>${transacao.categoria}</td>
            <td>${transacao.data}</td>
            <td>${transacao.status}</td>
            <td>
                <button class="edit-btn" data-id="${transacao.id}">Editar</button>
                <button class="delete-btn" data-id="${transacao.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    function atualizarResumo() {
        const receitas = transacoes.filter(t => t.categoria === 'receita').reduce((acc, t) => acc + t.valor, 0);
        const despesas = transacoes.filter(t => t.categoria === 'despesa').reduce((acc, t) => acc + t.valor, 0);
        const saldo = receitas - despesas;

        resumoReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
        resumoDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
        resumoSaldo.textContent = `R$ ${saldo.toFixed(2)}`;

        exibirNotificacaoSaldo(saldo);
    }

    function exibirNotificacaoSaldo(saldo) {
        if (!('Notification' in window)) {
            console.warn('Este navegador não suporta notificações.');
            return;
        }

        if (Notification.permission === 'granted') {
            enviarNotificacao(saldo);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    enviarNotificacao(saldo);
                }
            });
        }
    }

    function enviarNotificacao(saldo) {
        let mensagem = '';
        if (saldo > 0) {
            mensagem = `Saldo positivo: R$ ${saldo.toFixed(2)}`;
        } else if (saldo < 0) {
            mensagem = `Cuidado! Saldo negativo: R$ ${saldo.toFixed(2)}`;
        } else {
            mensagem = 'Saldo zerado!';
        }

        new Notification('Resumo Financeiro', {
            body: mensagem,
            icon: 'https://example.com/icon.png' // Substitua pelo URL de um ícone, se desejar
        });
    }

    function gerarRelatorio() {
        const { jsPDF } = window.jspdf; // Certifique-se de usar o namespace correto
        const doc = new jsPDF();
    
        doc.setFontSize(16);
        doc.text('Relatório Financeiro', 20, 20);
    
        let yPosition = 30; // Posição inicial no eixo Y
    
        transacoes.forEach((transacao, index) => {
            const texto = `${index + 1}. ${transacao.descricao}: R$ ${transacao.valor.toFixed(2)} - ${transacao.categoria} - ${transacao.data} - ${transacao.status}`;
            doc.text(texto, 20, yPosition);
            yPosition += 10; // Incrementa a posição Y para a próxima linha
        });
    
        doc.save('relatorio-financeiro.pdf');
    }
    
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript conectado com sucesso!");
});
