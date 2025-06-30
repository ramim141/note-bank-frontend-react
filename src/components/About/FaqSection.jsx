"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

const FaqSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      question: "How do I upload notes?",
      answer:
        "You can upload notes from your dashboard after logging in. Simply navigate to the 'Upload Note' section and follow the instructions.",
    },
    {
      question: "Are the notes approved by faculty?",
      answer:
        "While we encourage quality, notes are primarily community-rated. However, we have moderation systems in place to ensure content appropriateness.",
    },
    {
      question: "Can I download notes?",
      answer:
        "Yes, you can download notes after liking or rating them, depending on the uploader's settings. Download counts are tracked to highlight popular resources.",
    },
    {
      question: "What if I can't find the note I need?",
      answer:
        "You can use our 'Request Note' feature to let the community know what you're looking for. Someone might be able to help!",
    },
    {
      question: "Is NoteBank free to use?",
      answer:
        "Yes, NoteBank is completely free to use. You can upload, download, and share notes without any cost. We believe education should be accessible to everyone.",
    },
    {
      question: "How do I report inappropriate content?",
      answer:
        "If you find any inappropriate content, you can report it using the report button on each note. Our moderation team will review it promptly and take appropriate action.",
    },
  ]

  return (
    <section className="px-4 py-12 mb-12 sm:px-6 sm:py-16 sm:mb-16 lg:px-8 lg:py-20 lg:mb-24">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-black text-gray-900 sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Questions
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl xl:text-2xl xl:max-w-3xl">
            Find answers to common questions about using NoteBank and get the help you need.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mx-auto space-y-3 max-w-4xl sm:space-y-4 lg:max-w-5xl xl:max-w-6xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl sm:rounded-2xl"
            >
              <button
                className="flex justify-between items-center p-4 w-full text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 sm:p-6 lg:p-8"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                aria-expanded={expandedFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex gap-3 items-start sm:gap-4 lg:gap-6">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg sm:p-2.5 lg:p-3">
                    <HelpCircle className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl xl:text-2xl">
                    {faq.question}
                  </h3>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <div className="p-1 rounded-full transition-transform duration-200 hover:bg-gray-100">
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    )}
                  </div>
                </div>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out ${
                  expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                  <div className="pl-10 sm:pl-12 lg:pl-16">
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg xl:text-xl xl:leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  )
}

export default FaqSection
