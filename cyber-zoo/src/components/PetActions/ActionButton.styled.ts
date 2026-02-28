import styled, { css } from 'styled-components';

export const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  position: relative;
  padding: 10px 24px;
  border: none;
  color: white;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin: 5px;
  transition: all 0.2s ease;

  clip-path: polygon(
    10px 0, 100% 0, 
    100% calc(100% - 10px), 
    calc(100% - 10px) 100%, 
    0 100%, 
    0 10px
  );

  ${(props) => props.$variant === 'danger' 
    ? css`
      background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
      &:hover { background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%); }
    ` 
    : css`
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      &:hover { background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%); }
    `
  }

  &:active {
    transform: translateY(2px);
  }

  &:disabled {
    background: #434343;
    color: #888;
    cursor: not-allowed;
    pointer-events: none;
  }
`;