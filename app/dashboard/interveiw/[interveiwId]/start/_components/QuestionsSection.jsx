import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeach = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
    else {
      alert('Sorry, Your browser does not support text to speech')
    }
  }

  return mockInterviewQuestion && (
    <div className='p-6 border rounded-2xl shadow-sm bg-white h-full flex flex-col max-h-[calc(100vh-200px)]'>
      {/* Progress Grid */}
      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6'>
        {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs text-center font-medium cursor-pointer transition-all duration-300
            ${activeQuestionIndex == index
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
            `}
          >
            Q{index + 1}
          </h2>
        ))}
      </div>

      {/* Active Question */}
      <div className="flex-grow flex flex-col justify-center overflow-y-auto">
        <h2 className='text-lg md:text-xl font-bold text-gray-800 leading-relaxed animate-in fade-in slide-in-from-left-4 duration-500'>
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <div
            className='p-2 bg-blue-50 rounded-full cursor-pointer hover:bg-blue-100 transition-colors'
            onClick={() => textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}
            title="Read Question"
          >
            <Volume2 className='text-blue-600 h-5 w-5' />
          </div>
          <span className="text-xs text-gray-400">Click to listen</span>
        </div>
      </div>

      {/* Note Section */}
      <div className='border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg mt-4'>
        <h2 className='flex gap-2 items-center text-blue-700 font-bold mb-1 text-sm'>
          <Lightbulb className="h-4 w-4" />
          <span>Tip</span>
        </h2>
        <p className='text-xs text-blue-800 leading-relaxed'>
          {process.env.NEXT_PUBLIC_QUESTION_NOTE || "Click 'Record Answer' when ready. Speak clearly."}
        </p>
      </div>
    </div>
  )
}

export default QuestionsSection
