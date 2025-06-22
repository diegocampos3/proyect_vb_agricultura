import { Fragment } from 'react';

// Routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

/** COMPONENTS */
/** Layout */
import Header from './componentes/layout/Header';
import Navegacion from './componentes/layout/Navegacion';

/** Crop Registration */
import Cultivo from './componentes/registro/crop';

/** Analysis */
import Droughts from './componentes/analysis/Droughts';
import Precipitation from './componentes/analysis/Precipitation';

import { CropProvider } from './context/CropContext'; 

function App() {
    return (
      <BrowserRouter>
        <CropProvider> 
          <Fragment>
              <Header />
              <div className="grid contenedor contenido-principal">
                <Navegacion />
                <main className="caja-contenido col-9">
                  <Routes>

                      <Route path="/registerCrop" element={<Cultivo />} />
                      <Route path="/analysisCropD" element={<Droughts />} />
                      <Route path="/analysisCropP" element={<Precipitation />} />

                  </Routes>
                </main>
              </div>
          </Fragment>
        </CropProvider>
      </BrowserRouter>
    )
}

export default App;

