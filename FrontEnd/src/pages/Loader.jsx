import React from 'react';

const Loader = ({ marginTop = "0px" }) => {
    return (
        <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50">
            <div 
                className="loader flex flex-col items-center"
                style={{ marginTop }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="mt-3 text-white font-medium">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
