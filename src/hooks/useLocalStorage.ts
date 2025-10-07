import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Tentar buscar do localStorage
      const item = window.localStorage.getItem(key)
      // Parsear JSON armazenado ou retornar initialValue se não existir
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se houver erro, retornar initialValue
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Função para atualizar o valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value seja uma função como useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salvar estado
      setStoredValue(valueToStore)
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  return [storedValue, setValue] as const
}

