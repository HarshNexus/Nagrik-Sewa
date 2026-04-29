import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot, 
  Settings,
  Minimize2,
  RefreshCw,
  Languages,
  UserCheck,
  Users,
  HelpCircle,
  Star,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  FileText,
  Search,
  Clock,
  Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChatMessage } from '../../services/chatbot';
import { ChatFeedback } from './ChatFeedback';

export const ChatbotWidget: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    sessionId,
    userType,
    openChat,
    closeChat,
    sendMessage,
    setUserType,
    clearChat
  } = useChatbot();

  const { language, setLanguage } = useLanguage();
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick actions based on user type
  const quickActions = userType === 'customer' ? [
    { icon: Calendar, text: 'Book Service', query: 'I want to book a service' },
    { icon: Search, text: 'Find Workers', query: 'How can I find workers in my area?' },
    { icon: Clock, text: 'Track Order', query: 'How can I track my service appointment?' },
    { icon: CreditCard, text: 'Payment Help', query: 'I need help with payments and pricing' },
    { icon: MapPin, text: 'Service Areas', query: 'What areas do you serve?' },
    { icon: Phone, text: 'Contact Support', query: 'I need to contact customer support' }
  ] : [
    { icon: UserCheck, text: 'Join Platform', query: 'How can I register as a worker?' },
    { icon: FileText, text: 'Verification', query: 'What documents do I need for verification?' },
    { icon: Award, text: 'Get Training', query: 'Tell me about training programs and certifications' },
    { icon: CreditCard, text: 'Earnings', query: 'How much can I earn and how do payments work?' },
    { icon: Users, text: 'Profile Help', query: 'Help me optimize my worker profile' },
    { icon: Phone, text: 'Support', query: 'I need help with my worker account' }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setShowQuickActions(false); // Hide quick actions after first message
    
    await sendMessage(message);
  };

  const handleQuickAction = async (query: string) => {
    setShowQuickActions(false);
    await sendMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'हिंदी',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'bn': 'বাংলা',
      'mr': 'मराठी',
      'gu': 'ગુજરાતી',
      'kn': 'ಕನ್ನಡ',
      'ml': 'മലയാളം',
      'pa': 'ਪੰਜਾਬੀ',
      'ur': 'اردو'
    };
    return languages[code] || 'English';
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const isRetryMessage = message.content.includes('🔄 Connection issue');

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-brand-600 text-white' 
              : isRetryMessage 
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-600'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          
          <div className={`rounded-2xl px-4 py-2 ${
            isUser 
              ? 'bg-brand-600 text-white' 
              : isRetryMessage
                ? 'bg-gray-100 text-gray-700'
                : 'bg-white border border-gray-200 text-gray-800'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-1 ${
              isUser ? 'text-brand-100' : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openChat}
          className="rounded-full w-14 h-14 bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="sm"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-white shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Nagrik Sewa AI</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-white bg-opacity-20 text-white border-0">
                  {userType === 'worker' ? <UserCheck className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                  {userType === 'worker' ? 'Worker' : 'Customer'}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-white bg-opacity-20 text-white border-0">
                  <Languages className="w-3 h-3 mr-1" />
                  {getLanguageName(language)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFeedback(!showFeedback)}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 p-0"
              title="Feedback"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChat}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Feedback Panel */}
            {showFeedback && sessionId && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <ChatFeedback
                  sessionId={sessionId}
                  onFeedbackSubmitted={() => setShowFeedback(false)}
                />
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">I am a:</label>
                    <Select value={userType} onValueChange={(value: 'customer' | 'worker') => setUserType(value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="worker">Worker/Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Language:</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                        <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                        <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                        <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: showSettings || showFeedback ? '380px' : '480px' }}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm mb-4">AI Assistant is ready to help!</p>
                    
                    {/* Quick Actions */}
                    {showQuickActions && (
                      <div className="max-w-sm">
                        <p className="text-xs text-gray-600 mb-3 font-medium">Quick Actions:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 h-auto py-2 px-3 text-xs bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                              onClick={() => handleQuickAction(action.query)}
                            >
                              <action.icon className="w-3 h-3" />
                              <span className="truncate">{action.text}</span>
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                          onClick={() => setShowQuickActions(false)}
                        >
                          Or type your question below...
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Show quick actions if no user messages yet */}
                  {showQuickActions && messages.filter(m => m.role === 'user').length === 0 && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium">Need help with:</p>
                      <div className="flex flex-wrap gap-1">
                        {quickActions.slice(0, 4).map((action, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs text-brand-600 hover:bg-brand-50"
                            onClick={() => handleQuickAction(action.query)}
                          >
                            <action.icon className="w-3 h-3 mr-1" />
                            {action.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={userType === 'worker' ? "Ask about joining, training, verification..." : "Ask about services, booking, pricing..."}
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Powered by Gemini AI</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
