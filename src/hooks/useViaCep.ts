import { useState, useEffect } from 'react'

interface ViaCepRawResponse {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

interface ViaCepResult {
  street: string
  neighborhood: string
  city: string
  state: string
}

export function useViaCep() {
  const [cep, setCep] = useState('')
  const [result, setResult] = useState<ViaCepResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length !== 8) {
      // Resetting state synchronously here is intentional: clearing
      // a previous lookup result when the input becomes incomplete
      // again is not "syncing with an external system" — it's a
      // direct response to the cep value changing.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null)
      setNotFound(false)
      return
    }

    // Debounce — waits 600ms after user stops typing
    const timer = setTimeout(async () => {
      setIsLoading(true)
      setNotFound(false)

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
        const data = (await res.json()) as ViaCepRawResponse

        if (data.erro) {
          setNotFound(true)
          setResult(null)
        } else {
          setResult({
            street: data.logradouro ?? '',
            neighborhood: data.bairro ?? '',
            city: data.localidade ?? '',
            state: data.uf ?? '',
          })
        }
      } catch {
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [cep])

  return { setCep, result, isLoading, notFound }
}
