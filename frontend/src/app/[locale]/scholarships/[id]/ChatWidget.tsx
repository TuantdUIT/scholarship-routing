import React, { useState, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ----------------------------------------------------
// 1. Định nghĩa Typescript Interfaces cho Props
// ----------------------------------------------------
interface ChatWidgetProps {
    title?: string;
    position?: 'bottom-right' | 'bottom-left';
    buttonColor?: string;
}

// ----------------------------------------------------
// 2. Định nghĩa Keyframes (Hoạt ảnh)
// ----------------------------------------------------
const openAnimation = keyframes`
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

// ----------------------------------------------------
// 3. Định nghĩa Styled Components (Styling)
// ----------------------------------------------------
const Container = styled.div<{ position: ChatWidgetProps['position'] }>`
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;

    /* Logic định vị */
    ${props => props.position === 'bottom-right' && css`
        bottom: 20px;
        right: 20px;
    `}
`;

const Window = styled.div<{ $isOpen: boolean, buttonColor: string }>`
    width: 300px;
    height: 400px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    
    /* Hoạt ảnh mở */
    ${props => props.$isOpen && css`
        animation: ${openAnimation} 0.3s ease-in-out forwards;
    `}
`;

const Header = styled.div<{ buttonColor: string }>`
    background: ${props => props.buttonColor};
    color: white;
    padding: 10px;
    font-weight: bold;
    text-align: center;
`;

const Body = styled.div`
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    background: #f9f9f9;
`;

const Footer = styled.div`
    padding: 10px;
    border-top: 1px solid #eee;
    display: flex;
`;

const Button = styled.button<{ buttonColor: string }>`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${props => props.buttonColor};
    color: white;
    font-size: 24px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: scale(1.05);
    }
`;

// ----------------------------------------------------
// 4. React Component chính (Functional Component)
// ----------------------------------------------------
export const ChatWidget: React.FC<ChatWidgetProps> = ({
    title = 'Chào mừng đến với ScholarBot - người bạn đồng hành trong hành trình du học của bạn',
    position = 'bottom-right',
    buttonColor = '#007bff' // Màu xanh dương mặc định
}) => {
    // Sử dụng Hook useState để quản lý trạng thái mở/đóng
    const [isOpen, setIsOpen] = useState(false);

    // Sử dụng Hook useCallback để tối ưu hóa hàm toggle
    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Sử dụng Hook useMemo để tính toán biểu tượng dựa trên trạng thái
    const buttonIcon = useMemo(() => (
        isOpen ? '✖' : '💬'
    ), [isOpen]);

    return (
        <Container position={position}>
            <Window $isOpen={isOpen} buttonColor={buttonColor}>
                <Header buttonColor={buttonColor}>
                    {title}
                </Header>
                <Body>
                    <p style={{ color: '#666' }}>Chào mừng! Bạn cần hỗ trợ gì?</p>
                    {/* Thêm các tin nhắn và logic khác tại đây */}
                </Body>
                <Footer>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        style={{ flexGrow: 1, padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button
                        style={{ marginLeft: '5px', background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Gửi
                    </button>
                </Footer>
            </Window>

            <Button
                buttonColor={buttonColor}
                onClick={toggleChat}
                aria-expanded={isOpen}
            >
                <span className="chat-button-icon">{buttonIcon}</span>
            </Button>
        </Container>
    );
};