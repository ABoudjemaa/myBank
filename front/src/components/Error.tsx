import React from 'react';

const Error = ({error}:{error:any}) => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg font-semibold text-red-500">Error: {error.message}</p>
        </div>
    );
};

export default Error;