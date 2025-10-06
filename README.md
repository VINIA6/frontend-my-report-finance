# Finance Dashboard - Aplicação de Gestão Financeira

Uma aplicação web moderna e elegante para gerenciamento de finanças pessoais e empresariais, com interface clean e responsiva.

## 🎨 Características

### 📊 Dashboard Completo
- **Gráfico por Quartil**: Visualização semanal do mês (Q1-Q4 representam as 4 semanas)
- **Despesas Fixas**: Lista detalhada com gráfico de pizza interativo
- **Faturas**: Gerenciamento completo de faturas com busca e status

### 🌓 Modo Dark/Light
- Toggle entre modo claro e escuro
- Preferência salva no localStorage
- Transições suaves entre os modos

### 📱 Interface Responsiva
- Menu lateral retrátil
- Layout adaptável para mobile, tablet e desktop
- Componentes otimizados para todas as telas

### 🎯 Funcionalidades
- Sistema de abas PF/PJ
- Busca de faturas em tempo real
- Botões de ação rápida (adicionar despesas e faturas)
- Gráficos interativos com tooltips
- Status visual de faturas (Pago, Pendente, Vencido)

## 🚀 Tecnologias

- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd finance

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🎯 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── QuarterlyChart.tsx    # Gráfico semanal
│   ├── FixedExpenses.tsx     # Despesas fixas
│   └── InvoicesList.tsx      # Lista de faturas
├── styles/             # Estilos globais
│   └── index.css       # CSS principal com Tailwind
├── App.tsx             # Componente principal
└── main.tsx            # Entry point
```

## 🎨 Componentes

### Gráfico por Quartil
- Mostra dados semanais do mês (Semana 1-4)
- Linha de média em verde
- Tooltips informativos
- Responsivo e interativo

### Despesas Fixas
- Lista de despesas com valores
- Gráfico de pizza grande e colorido
- Botão para adicionar novas despesas
- Indicador de variação mensal

### Lista de Faturas
- Busca em tempo real
- Status coloridos (Pago, Pendente, Vencido)
- Botão de adicionar fatura
- Ações rápidas (visualizar, download)

## 🌓 Modo Dark

O modo dark é ativado através do botão no header (ícone de sol/lua) e persiste entre sessões através do localStorage.

## 📱 Responsividade

A aplicação se adapta perfeitamente a diferentes tamanhos de tela:

- **Mobile** (<768px): Menu em overlay, layout em coluna única
- **Tablet** (768px-1024px): Layout adaptável
- **Desktop** (>1024px): Layout completo com sidebar fixa

## 🎯 Próximas Funcionalidades

- [ ] Integração com backend/API
- [ ] Formulários para adicionar despesas e faturas
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Filtros avançados
- [ ] Gráficos adicionais
- [ ] Notificações de vencimento
- [ ] Multi-idioma

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Visualiza build de produção
```

## 🎨 Paleta de Cores

**Modo Light:**
- Background: `#f9fafb` (gray-50)
- Cards: `#ffffff` (white)
- Texto: `#111827` (gray-900)

**Modo Dark:**
- Background: `#111827` (gray-900)
- Cards: `#1f2937` (gray-800)
- Texto: `#f9fafb` (gray-50)

## 📄 Licença

MIT License - sinta-se livre para usar este projeto como desejar.

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido com foco em:
- Clean Code
- Componentização
- Performance
- UX/UI moderna
- Acessibilidade
- Responsividade

---

Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS