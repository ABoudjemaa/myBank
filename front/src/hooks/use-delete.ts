import { useState } from 'react'
import useAuthenticatedApi from './use-authenticated-api'

export function useDelete() {
  const authenticatedApi = useAuthenticatedApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const deleteItem = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      await authenticatedApi.delete(url)
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteItem, loading, error }
}
