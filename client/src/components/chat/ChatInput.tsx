import { FormEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gray-100 flex-shrink-0 bg-white sm:rounded-b-2xl"
    >
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        disabled={isLoading}
        autoComplete="off"
        enterKeyHint="send"
        className="flex-1 px-4 py-3 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-clinic-teal/50 focus:border-clinic-teal disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="w-11 h-11 sm:w-10 sm:h-10 bg-clinic-teal hover:bg-clinic-teal-dark text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-clinic-teal flex-shrink-0"
      >
        <Send className="w-5 h-5 sm:w-4 sm:h-4" />
      </button>
    </form>
  )
}
