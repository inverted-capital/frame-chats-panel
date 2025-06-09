import { useExists, useJson } from '@artifact/client/hooks'
import { accountDataSchema, type AccountData } from '../types/account.ts'
import { useEffect, useState } from 'react'

const useAccountData = () => {
  const exists = useExists('profile.json')
  const raw = useJson('profile.json')
  const [data, setData] = useState<AccountData>()

  useEffect(() => {
    if (raw !== undefined) {
      setData(accountDataSchema.parse(raw))
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'profile.json not found' : null

  return { data, loading, error }
}

export default useAccountData
