import { useState, useEffect } from 'react'
import { priceComparisonService } from '../lib/priceComparisonService'

export function usePriceComparison() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultados, setResultados] = useState(null)

  const compararPrecos = async (produto, plataformas = ['mercadolivre']) => {
    if (!produto?.trim()) {
      setError('Nome do produto é obrigatório')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const dados = await priceComparisonService.compararPrecos(produto, plataformas)
      setResultados(dados)
      return dados
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const limparResultados = () => {
    setResultados(null)
    setError(null)
  }

  return {
    loading,
    error,
    resultados,
    compararPrecos,
    limparResultados
  }
}

export function usePromocoes() {
  const [loading, setLoading] = useState(false)
  const [promocoes, setPromocoes] = useState([])
  const [error, setError] = useState(null)

  const carregarPromocoes = async (plataformas = ['mercadolivre']) => {
    setLoading(true)
    setError(null)
    
    try {
      const dados = await priceComparisonService.obterPromocoes(plataformas)
      setPromocoes(dados)
      return dados
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Carregar promoções automaticamente
    carregarPromocoes()
  }, [])

  return {
    loading,
    error,
    promocoes,
    carregarPromocoes
  }
}
