import '../css/detallecliente.css'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAutorizaciones from "../hooks/useAutorizaciones";

const DetalleCliente = () => {
 const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAutorizaciones();
  const role = admin?.sector;

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const cargarCliente = async () => {
      try{
        setLoading(true);
        setError(null);

        if (!id){
          setError("No se especifico un cliente.");
          setLoading(false);
          return;
        }

        const respuesta = await fetch(`https://fakestoreapi.com/users/${id}`);
        if (!respuesta.ok) {
          throw new Error(`No se pudo obtener el cliente. Codigo: ${respuesta.status}`);
        }
        const data = await respuesta.json();
        if(!data){
          throw new Error("No se encontro el cliente");
        }

        setCliente(data);
      }catch (error) {
        setError(error.message);
      }finally{
        setLoading(false);
      }
    };
    cargarCliente();
  }, [id]);

  const eliminarCliente = async () => {
    if (role?.trim() !== "Gerencia") {
      setMensaje("No tenes permisos para eliminar clientes");
      return;
    }
    try {
      const respuesta = await fetch(
        `https://fakestoreapi.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (respuesta.ok) {
        setMensaje("Cliente eliminado correctamente");

        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      }
    } catch (error) {
      setMensaje("Error al eliminar cliente");
    }
  };

  
  if (loading) {
    return <h2>Cargando cliente...</h2>;
  }

  if (error) {
  return (
    <div className="detalle-cliente error-cliente">
      <h2>{error}</h2>

      <div className="acciones-error">
        <button
          className="btn-reintentar"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>

        <button
          className="btn-volver"
          onClick={() => navigate("/clientes")}
        >
          Volver a clientes
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className = 'mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      <h2>Credenciales</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      <p>
        <strong>Contraseña:</strong> {cliente.password}
      </p>

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar'onClick={eliminarCliente}>
          Eliminar Cliente
        </button>
      )}
    </div>
  );
};

export default DetalleCliente;