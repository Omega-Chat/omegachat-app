import React from 'react';

interface ErrorProps {
    error_text: string;
}

const ValidationMessage: React.FC<ErrorProps> = ({error_text}) => {
    return (
        <div style={{
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <h3 style={{
            color: '#ff6b6b',
            fontWeight: "normal",
            fontSize: 20,
            textAlign: "center"}}>{error_text}
            </h3>
        </div>
    );
};

export default ValidationMessage;