import { Spinner } from '@/components/ui/spinner'
import React from 'react'

interface LoadingTableProps {
  message: string
  color: string
}

const LoadingTable = ({ message, color }: LoadingTableProps) => {
  return (
    <div className="p-4 flex flex-col gap-2 justify-center items-center h-screen">
    <Spinner className={`size-8 text-${color}-500 mx-auto animate-spin`} />
    <p className="text-sm text-gray-500">{message}</p>
  </div>
  )
}

export default LoadingTable