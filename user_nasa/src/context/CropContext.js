import React, { createContext, useContext, useState } from 'react';

// Crear un contexto
const CropContext = createContext();

// Proveedor del contexto
export const CropProvider = ({ children }) => {
    const [cropData, setCropData] = useState({});

    return (
        <CropContext.Provider value={{ cropData, setCropData }}>
            {children}
        </CropContext.Provider>
    );
};

// Hook para usar el contexto
export const useCropContext = () => {
    return useContext(CropContext);
};
