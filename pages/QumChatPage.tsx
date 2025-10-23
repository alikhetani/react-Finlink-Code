import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PaperAirplaneIcon, UserCircleIcon } from '../components/icons';
import { api } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';

const QumAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
        Q
    </div>
);

const ChatBubble: React.FC<{ message: ChatMessageType }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
            {isUser ? <UserCircleIcon className="w-10 h-10 text-slate-500" /> : <QumAvatar />}
            <div className={`max-w-xs md:max-w-md rounded-xl px-4 py-3 ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

const ThinkingIndicator = () => (
    <div className="flex items-start gap-3 my-4">
        <QumAvatar />
        <div className="max-w-xs md:max-w-md rounded-xl px-4 py-3 bg-slate-200 dark:bg-slate-700 rounded-bl-none">
            <div className="flex items-center space-x-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Qum is thinking</span>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

const SuggestionChip: React.FC<{ text: string, onClick: (text: string) => void }> = ({ text, onClick }) => (
    <button
        onClick={() => onClick(text)}
        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
    >
        {text}
    </button>
);

export const QumChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([
        { id: '1', text: "Hello! I'm Qum, your 24/7 virtual banking assistant. How can I help you today?", sender: 'qum', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const suggestions = ["How to open an account?", "What's my loan status?", "Help with KYC"];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: ChatMessageType = {
            id: String(Date.now()),
            text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsThinking(true);

        try {
            const response = await api.getQumResponse(text);
            const qumMessage: ChatMessageType = {
                id: String(Date.now() + 1),
                text: response.text,
                sender: 'qum',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, qumMessage]);
        } catch (error) {
            console.error("Failed to get response from Qum API", error);
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <QumAvatar />
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Qum – Your Banking Assistant</h1>
                    <p className="text-sm text-green-500 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Online</p>
                </div>
            </div>
             <p className="text-xs text-center text-slate-400 dark:text-slate-500 mb-4">This chat may be monitored for quality purposes.</p>
            <Card className="flex flex-col h-[70vh]">
                <div className="flex-grow overflow-y-auto p-4 md:p-6">
                    {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                    {isThinking && <ThinkingIndicator />}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {suggestions.map(s => <SuggestionChip key={s} text={s} onClick={handleSendMessage} />)}
                    </div>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input
                            id="chat-input"
                            label=""
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-grow"
                            autoComplete="off"
                        />
                        <Button type="submit" className="!p-3" disabled={!inputValue.trim() || isThinking}>
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};