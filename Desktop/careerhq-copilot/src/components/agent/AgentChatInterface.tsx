'use client'

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Button } from "@/components/ui/button"
import { BrainIcon, SendIcon } from "lucide-react"
import { useState } from "react"

export function AgentChatInterface() {
  const [inputValue, setInputValue] = useState("")
  const [activeCategory, setActiveCategory] = useState("")
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'agent'}[]>([])

  const handleSend = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, {text: inputValue, sender: 'user'}])
      
      // Simulate agent response
      setTimeout(() => {
        let response = "I'm processing your request about: " + inputValue
        if (inputValue.toLowerCase().includes('resume')) {
          response = "I can help analyze and improve your resume. Would you like to upload your current resume or start creating a new one?"
        } else if (inputValue.toLowerCase().includes('job') || inputValue.toLowerCase().includes('search')) {
          response = "I can help with your job search. Would you like to search for specific positions or get advice on job search strategies?"
        }
        setMessages(prev => [...prev, {text: response, sender: 'agent'}])
      }, 1000)
      
      setInputValue("")
      setActiveCategory("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptInputValueChange = (value: string) => {
    setInputValue(value)
    // Clear active category when typing something different
    if (value.trim() === "") {
      setActiveCategory("")
    }
  }

  // Get suggestions based on active category
  const activeCategoryData = suggestionGroups.find(
    (group) => group.label === activeCategory
  )

  // Determine which suggestions to show
  const showCategorySuggestions = activeCategory !== ""

  return (
    <div className="flex w-full flex-col space-y-4 h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-gray-50 rounded-lg">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <BrainIcon className="h-12 w-12 mb-3 text-gray-400" />
            <h3 className="text-lg font-medium">How can I help you today?</h3>
            <p className="text-sm max-w-md mt-1">
              Ask me about resume optimization, job searching, interview preparation, or choose a suggestion below.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <PromptInput
        className="border-input bg-background border shadow-xs"
        value={inputValue}
        onValueChange={handlePromptInputValueChange}
        onSubmit={handleSend}
      >
        <PromptInputTextarea
          placeholder="Ask about resume optimization, job searching..."
          className="min-h-[44px]"
          onKeyDown={handleKeyDown}
        />
        <PromptInputActions className="justify-end">
          <Button
            size="sm"
            className="h-9 w-9 rounded-full"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </PromptInputActions>
      </PromptInput>

      {/* Suggestions */}
      <div className="relative flex w-full flex-col items-center justify-center space-y-2">
        <div className="h-[70px] w-full">
          {showCategorySuggestions ? (
            <div className="flex w-full flex-col space-y-1">
              {activeCategoryData?.items.map((suggestion) => (
                <PromptSuggestion
                  key={suggestion}
                  highlight={activeCategoryData.highlight}
                  onClick={() => {
                    setInputValue(suggestion)
                  }}
                >
                  {suggestion}
                </PromptSuggestion>
              ))}
            </div>
          ) : (
            <div className="relative flex w-full flex-wrap items-stretch justify-start gap-2">
              {suggestionGroups.map((suggestion) => (
                <PromptSuggestion
                  key={suggestion.label}
                  onClick={() => {
                    setActiveCategory(suggestion.label)
                    setInputValue("")
                  }}
                  className="capitalize"
                >
                  <BrainIcon className="mr-2 h-4 w-4" />
                  {suggestion.label}
                </PromptSuggestion>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const suggestionGroups = [
  {
    label: "Resume",
    highlight: "Resume",
    items: [
      "Improve my resume",
      "Upload my resume for analysis",
      "Create a new resume from scratch",
      "Optimize my resume for ATS",
    ],
  },
  {
    label: "Job Search",
    highlight: "job",
    items: [
      "Find job openings in my field",
      "Help me search for remote positions",
      "Compare job opportunities",
      "Get job search strategies",
    ],
  },
  {
    label: "Interviews",
    highlight: "interview",
    items: [
      "Practice interview questions",
      "Prepare for an upcoming interview",
      "Help with salary negotiation",
      "Review common interview questions",
    ],
  },
  {
    label: "Career",
    highlight: "career",
    items: [
      "Get advice on career change",
      "Career assessment tools",
      "Career development options",
      "Evaluate career progression",
    ],
  },
]

// export default at the end
