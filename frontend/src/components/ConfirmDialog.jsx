import { AlertCircle } from 'lucide-react'

const ConfirmDialog = ({ 
  title = 'KICK IT UP SAYS', 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'OK',
  cancelText = 'CANCEL'
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn">
      <div className="bg-white border-2 border-black rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        {/* Header */}
        <div className="px-8 py-6 border-b-2 border-black">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-black flex-shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="px-8 py-8">
          <p className="text-sm uppercase tracking-wider font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 border-t-2 border-black flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-8 py-3 bg-white text-black border-2 border-black rounded-full font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-black text-white border-2 border-black rounded-full font-bold uppercase text-sm tracking-wider hover:bg-gray-800 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
