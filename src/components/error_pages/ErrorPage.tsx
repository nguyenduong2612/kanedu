import React from 'react';
import './ErrorPage.scss';

interface ErrorPageProps { }

const ErrorPage: React.FC<ErrorPageProps> = ({ children }) => {
  return (
    <div className="error-container">
      <p className="error-text">{children}</p>
    </div>
  );
};

export default ErrorPage;
