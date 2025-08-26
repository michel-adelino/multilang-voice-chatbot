# 🤖 Voice Chatbot

This is a React application that integrates with an OpenAI API and leverages the Web Speech API for voice recognition and speech synthesis.  
It provides an interactive and immersive calling conversational experience through voice.  
Users can initiate a conversation, speak commands, or ask questions in multiple languages.

## 🌟 Features

- **Voice Recognition**: Utilizes Web Speech API to recognize spoken commands.
- **Text-to-Speech**: Read the chatbot responses aloud.

- **Multi-language Support**: Uses the `next-i18next` package for i18n and allows conversation in multiple languages.

- **Interactive UI**: Easy-to-use interface with buttons to initiate and end calls.

- **Mobile Support**: Offers a mobile-friendly responsive interface.

- **Conversation History**: Stores previous conversations locally.

## ✨ Demo

### Basic calling functionality

https://github.com/shihui-huang/react-voice-chatbot/assets/52117621/f3faa11a-aeae-4b0a-82cd-864e42950383

### Calling history & Responsiveness

https://github.com/shihui-huang/react-voice-chatbot/assets/52117621/0abfbab5-143b-4346-b50f-0bb28a50cf95

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Conversational Engine**: [OpenAI API](https://openai.com/)
- **Speech Recognition**: [react-speech-recognition](https://www.npmjs.com/package/react-speech-recognition)
- **Speech Synthesis**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **UI Library**: [AntDesign](https://ant.design/)
- **Styling**: [styled-components](https://styled-components.com/) & [Tailwind CSS](https://tailwindcss.com/) & [FontAswsome](https://fontawesome.com/)
- **Localization**: [i18next](https://www.i18next.com/)
- **Testing**: [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)

## Run
clone locally:

```
$ git clone https://github.com/michel-adelino/multilang-voice-chatbot
```

Then, run the development server:

```bash
$ cd /multilang-voice-chatbot
$ npm install
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
