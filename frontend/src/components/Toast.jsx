import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
    warning: <AlertCircle className="h-6 w-6 text-yellow-500" />
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <div className={`fixed top-24 right-4 z-50 animate-slideDown`}>
      <div className={`glass rounded-3xl p-6 shadow-2xl border-2 ${styles[type]} min-w-[320px] max-w-md`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg break-words">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
