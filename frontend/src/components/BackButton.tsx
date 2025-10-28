import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }
`;

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <ArrowLeft size={24} />
    </Button>
  );
};

export default BackButton; 