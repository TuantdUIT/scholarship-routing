"use client";

import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ChatWidgetProps {
    title?: string;
    position?: 'bottom-right' | 'bottom-left';
    buttonColor?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
    title = 'Chào mừng đến với ScholarBot - người bạn đồng hành trong hành trình du học của bạn',
    position = 'bottom-right',
    buttonColor = '#007bff'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    const positionClasses = position === 'bottom-right' 
        ? 'bottom-5 right-5' 
        : 'bottom-5 left-5';

    return (
        <div className={`fixed z-[9999] flex flex-col gap-2.5 ${positionClasses}`}>
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="w-[300px] h-[400px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
                >
                    {/* Header */}
                    <div 
                        className="text-white p-2.5 font-bold text-center text-sm"
                        style={{ backgroundColor: buttonColor }}
                    >
                        {title}
                    </div>

                    {/* Body */}
                    <div className="flex-grow p-2.5 overflow-y-auto bg-gray-50">
                        <p className="text-gray-600 text-sm">Chào mừng! Bạn cần hỗ trợ gì?</p>
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 border-t border-gray-200 flex gap-1.5">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-grow px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="w-[60px] h-[60px] rounded-full text-white text-2xl border-none cursor-pointer shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: buttonColor }}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Đóng chat" : "Mở chat"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};
