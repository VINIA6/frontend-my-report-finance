import React, { useState } from 'react'
import { FileText, Download, Eye, MoreVertical, Search, Plus, ChevronRight } from 'lucide-react'

const InvoicesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const invoices = [
    { 
      id: 1, 
      number: 'INV-2024-001', 
      client: 'Tech Solutions Ltd', 
      amount: 15000, 
      date: '15/01/2024',
      status: 'paid',
      dueDate: '30/01/2024'
    },
    { 
      id: 2, 
      number: 'INV-2024-002', 
      client: 'Digital Marketing Co', 
      amount: 8500, 
      date: '20/01/2024',
      status: 'pending',
      dueDate: '05/02/2024'
    },
    { 
      id: 3, 
      number: 'INV-2024-003', 
      client: 'StartUp Innovation', 
      amount: 22000, 
      date: '25/01/2024',
      status: 'paid',
      dueDate: '10/02/2024'
    },
    { 
      id: 4, 
      number: 'INV-2024-004', 
      client: 'Global Services Inc', 
      amount: 12750, 
      date: '28/01/2024',
      status: 'overdue',
      dueDate: '28/01/2024'
    },
    { 
      id: 5, 
      number: 'INV-2024-005', 
      client: 'Creative Agency', 
      amount: 9200, 
      date: '02/02/2024',
      status: 'pending',
      dueDate: '17/02/2024'
    },
    { 
      id: 6, 
      number: 'INV-2024-005', 
      client: 'Creative Agency', 
      amount: 9200, 
      date: '02/02/2024',
      status: 'pending',
      dueDate: '17/02/2024'
    },
    { 
      id: 6, 
      number: 'INV-2024-005', 
      client: 'Creative Agency', 
      amount: 9200, 
      date: '02/02/2024',
      status: 'pending',
      dueDate: '17/02/2024'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago'
      case 'pending':
        return 'Pendente'
      case 'overdue':
        return 'Vencido'
      default:
        return status
    }
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-[890px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Faturas</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredInvoices.length} faturas enviadas</p>
          </div>
        </div>
        <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors group">
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar faturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {invoice.number}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.client}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Data: {invoice.date}</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  R$ {invoice.amount.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                <button className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                </button>
              </div>
            </div>

            {invoice.status === 'overdue' && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Vencido há {Math.floor(Math.random() * 10) + 1} dias
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          <span>Ver todas as faturas</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default InvoicesList
