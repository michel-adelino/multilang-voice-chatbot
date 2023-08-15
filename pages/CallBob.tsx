import 'regenerator-runtime/runtime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faQuoteLeft, faSquare } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { METHODS } from '@/constants'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useLanguage } from './LanguageContext'

export default function CallBob() {
  const commands = [
    {
      command: ['*'],
      callback: (command: string) => handleSend(command),
    },
  ]
  const router = useRouter()

  const [isCalling, setIsCalling] = useState(false)
  const { transcript, resetTranscript, listening } = useSpeechRecognition({ commands })
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis>()
  const [isChatbotSpeaking, setIsChatBotSpeaking] = useState(false)
  const { t, i18n } = useTranslation()
  const { selectedLanguage, changeLanguage } = useLanguage()
  const defaultIntroduction = t('bob.introduction')
  const defaultMessage = [
    {
      message: defaultIntroduction,
      sender: 'ChatGPT',
    },
  ]
  const [messages, setMessages] = useState(defaultMessage)

  // if selectedLanguage changes, reset call
  useEffect(() => {
    endCall()
    console.log(systemMessageToSetChatGptBehaviour)
  }, [defaultIntroduction])

  const handleLanguageChange = (newLocale: string) => {
    console.log(i18n.language, newLocale)
    changeLanguage(newLocale)
  }

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis)
  }, [])

  const chatBotSpeak = (message: string) => {
    if (isChatbotSpeaking || !speechSynthesis) {
      return
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(t('bob.browserNotSupportSpeechRecognitionMessage')))
      return
    }
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = selectedLanguage
    utterance.onstart = handleChatbotSpeechStart
    utterance.onend = handleChatbotSpeechEnd
    speechSynthesis.speak(utterance)
  }

  const handleChatbotSpeechStart = () => {
    setIsChatBotSpeaking(true)
    SpeechRecognition.stopListening()
  }

  const handleChatbotSpeechEnd = () => {
    if (isCalling) {
      SpeechRecognition.startListening({ language: selectedLanguage })
    }
    setIsChatBotSpeaking(false)
  }
  const systemMessageToSetChatGptBehaviour = {
    role: 'system',
    content: t('bob.systemMessage'),
  }

  const handleSend = async (message: string) => {
    if (!message) {
      return
    }
    const formattedMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    }

    const updatedMessages = [...messages, formattedMessage]

    setMessages(updatedMessages)

    await getChatGptAnswer(updatedMessages)
  }

  async function getChatGptAnswer(messagesWithSender: { message: string; sender: string }[]) {
    const chatGptApiFormattedMessages = messagesWithSender.map((messageObject) => {
      return {
        role: messageObject.sender === 'ChatGPT' ? 'assistant' : 'user',
        content: messageObject.message,
      }
    })

    const chatGptApiMessages = [
      systemMessageToSetChatGptBehaviour, // The system message DEFINES the logic of our chatGPT
      ...chatGptApiFormattedMessages, // The messages from our chat with ChatGPT
    ]

    try {
      const response = await fetch(`/api/chat/message`, {
        method: METHODS.POST,
        body: JSON.stringify(chatGptApiMessages),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      const { choices } = data
      setMessages([
        ...messagesWithSender,
        {
          message: choices[0].message.content,
          sender: 'ChatGPT',
        },
      ])
      chatBotSpeak(choices[0].message.content)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const userSpeak = () => {
    SpeechRecognition.startListening({ language: selectedLanguage })

    if (transcript !== '') {
      resetTranscript()
    }
  }
  const userStopSpeaking = () => {
    SpeechRecognition.stopListening()
  }

  const userCall = () => {
    setIsCalling(true)
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setMessages([
        ...messages,
        {
          message: t('bob.browserNotSupportSpeechRecognitionMessage'),
          sender: 'ChatGPT',
        },
      ])
      setIsCalling(false)
      return
    }

    const firstMessage = t('bob.firstMessage')
    const formattedMessage = {
      message: firstMessage,
      sender: 'assistant',
    }

    const updatedMessages = [...messages, formattedMessage]

    setMessages(updatedMessages)
    chatBotSpeak(firstMessage)
    setTimeout(() => userSpeak(), 2000)
  }

  const resetConversation = () => {
    setMessages(defaultMessage)
  }

  const endCall = () => {
    SpeechRecognition.stopListening()
    resetConversation()
    setIsCalling(false)
    if (isChatbotSpeaking) {
      speechSynthesis?.cancel()
    }
    setIsChatBotSpeaking(false)
  }

  const callingButtons = React.useMemo(() => {
    return (
      <React.Fragment>
        {listening ? (
          <button className='pb-10 pt-5' onClick={userStopSpeaking}>
            <span className='relative flex h-[60px] w-[60px]'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5797] '></span>
              <span className='relative inline-flex rounded-full h-[60px] w-[60px] bg-[#fc4189] opacity-15 justify-center items-center'>
                <FontAwesomeIcon icon={faSquare} style={{ color: 'white', fontSize: '25px' }}></FontAwesomeIcon>
              </span>
            </span>
          </button>
        ) : (
          <button className='pb-10 pt-5' onClick={userSpeak}>
            <span className='relative flex h-[60px] w-[60px]'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-gray-300'></span>
              <span className='relative inline-flex rounded-full h-[60px] w-[60px] bg-[#fc4189] opacity-15 justify-center items-center'>
                <FontAwesomeIcon icon={faMicrophone} style={{ color: 'white', fontSize: '25px' }}></FontAwesomeIcon>
              </span>
            </span>
          </button>
        )}

        <button
          className='cursor-pointer outline-none w-[120px] h-[50px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
          onClick={endCall}
        >
          {t('call.hangUp')}
        </button>
      </React.Fragment>
    )
  }, [listening])

  return (
    <main className='bg-[#45badd]'>
      <div className='h-screen w-screen lg:flex lg:flex-row lg:items-center lg:justify-center flex-col items-center justify-end lg:p-24 p-10 pt-0 overflow-auto'>
        <div className='bg-[url(../public/Bob.gif)] lg:h-[600px] lg:w-[600px] md:h-[calc(100%-200px)] xs:h-[calc(100%-300px)] w-full bg-no-repeat bg-contain bg-center'></div>
        <div className='flex justify-center flex-col items-center lg:w-[calc(100%-600px)]'>
          <div className='text-xl text-[#433136] font-bold pb-4'>
            <FontAwesomeIcon
              icon={faQuoteLeft}
              style={{ color: 'black', fontSize: '35px', paddingRight: '12px' }}
            ></FontAwesomeIcon>
            {messages[messages.length - 1].message}
          </div>
          <button className='w-[120px] h-[50px]' onClick={() => handleLanguageChange('zh-CN')}>
            change
          </button>
          {!isCalling ? (
            <button
              className='cursor-pointer outline-none w-[120px] h-[50px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
              onClick={userCall}
            >
              {t('call.call')}
            </button>
          ) : (
            callingButtons
          )}
        </div>
      </div>
    </main>
  )
}
