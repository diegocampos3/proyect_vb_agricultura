import { Link } from "react-router-dom";

const Navegacion = () => {
    return ( 
        <aside className="sidebar col-3">
            <h2>Navigation</h2>
            <nav className="navegacion">
                <Link to={"/registerCrop"} className="clientes">Registrar Cultivo</Link>
                <Link to={"/analysisCropP"} className="productos">Precipitacion Vlady</Link>
                <Link to={"/analysisCropD"} className="productos">Sequias</Link>
            </nav>
        </aside> 
    );
}
 
export default Navegacion;

