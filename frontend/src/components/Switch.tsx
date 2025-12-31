// import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Switch = ({ isDarkMode, toggleTheme }: SwitchProps) => {
  return (
    /* We use $isDarkMode (transient prop) to prevent it from being passed to the DOM */
    <StyledWrapper $isDarkMode={isDarkMode}>
      <div className="container">
        <label htmlFor="theme-switch" className="toggle" title="Toggle Light/Dark Mode">
          <input 
            type="checkbox" 
            className="input" 
            id="theme-switch" 
            checked={isDarkMode} 
            onChange={toggleTheme} 
          />
          <div className="icon icon--moon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={28} height={28}>
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="icon icon--sun">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={28} height={28}>
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $isDarkMode: boolean }>`
  /* Ensure the switch container is always on top */
  position: relative;
  z-index: 9999; 

  .toggle {
    background-color: ${props => props.$isDarkMode ? '#0A2533' : '#fff'};
    color: ${props => props.$isDarkMode ? '#0AD1C8' : '#F7AD19'};
    border: 2px solid ${props => props.$isDarkMode ? '#0AD1C8' : '#F7AD19'};
    
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: ${props => props.$isDarkMode 
      ? '0 0 30px rgba(10, 209, 200, 0.4)' 
      : '0 0 30px rgba(247, 173, 25, 0.2)'};
    transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input {
    display: none;
  }

  .icon {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* When in Light Mode: Show Moon (Switch to Dark) */
  .icon--moon {
    opacity: ${props => props.$isDarkMode ? 0 : 1};
    transform: ${props => props.$isDarkMode ? 'rotate(180deg) scale(0)' : 'rotate(0deg) scale(1)'};
  }

  /* When in Dark Mode: Show Sun (Switch to Light) */
  .icon--sun {
    opacity: ${props => props.$isDarkMode ? 1 : 0};
    transform: ${props => props.$isDarkMode ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0)'};
  }

  &:hover .toggle {
    transform: scale(1.05);
    box-shadow: ${props => props.$isDarkMode 
      ? '0 0 40px rgba(10, 209, 200, 0.6)' 
      : '0 0 40px rgba(247, 173, 25, 0.4)'};
  }
`;

export default Switch;