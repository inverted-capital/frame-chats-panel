import { useEffect, useState } from 'react'
import useAccountData from './hooks/useAccountData.ts'
import useAccountSaver from './hooks/useAccountSaver.ts'
import type { AccountData } from './types/account.ts'

const defaultProfile: AccountData = { name: '' }

export default function App() {
  const { data, loading, error } = useAccountData()
  const save = useAccountSaver()
  const [name, setName] = useState('')

  useEffect(() => {
    if (data) setName(data.name)
  }, [data])

  useEffect(() => {
    if (error === 'profile.json not found') {
      save(defaultProfile)
    }
  }, [error, save])

  const handleSave = () => {
    save({ name })
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
