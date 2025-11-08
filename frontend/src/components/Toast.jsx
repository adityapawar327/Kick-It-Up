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
    success: <CheckCircle className="h-7 w-7" />,
    error: <XCircle className="h-7 w-7" />,
    info: <Info className="h-7 w-7" />,
    warning: <AlertCircle className="h-7 w-7" />
  }

  const styles = {
    success: 'bg-white border-black text-black',
    error: 'bg-black border-black text-white',
    info: 'bg-white border-black text-black',
    warning: 'bg-white border-black text-black'
  }

  const iconStyles = {
    success: 'text-black',
    error: 'text-white',
    info: 'text-black',
    warning: 'text-black'
  }

  const closeButtonStyles = {
    success: 'hover:bg-black/10',
    error: 'hover:bg-white/20',
    info: 'hover:bg-black/10',
    warning: 'hover:bg-black/10'
  }

  return (
    <div className="fixed top-24 right-4 z-50 animate-slideDown">
      <div className={`rounded-3xl p-6 shadow-2xl border-2 ${styles[type]} min-w-[320px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 ${iconStyles[type]}`}>
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm uppercase tracking-wider break-words leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 w-8 h-8 rounded-full transition-all flex items-center justify-center ${closeButtonStyles[type]}`}
          >
            <X className={`h-5 w-5 ${iconStyles[type]}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
