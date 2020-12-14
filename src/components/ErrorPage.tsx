import React from 'react';
import './ErrorPage.css';

interface ContainerProps { }

const ErrorPage: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="error-container">
      <p className="error-text">{children}</p>
    </div>
  );
};

export default ErrorPage;
