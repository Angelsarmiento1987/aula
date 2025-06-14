import React, { useState } from 'react';
import asignaturaData from '../../Data/Asignatura.json';
import ubicacionData from '../../Data/Ubicacion.json';
import { supabase } from '../../Database/Supabase';
import { MyNavbar } from '../../Components/MyNavbar/MyNavbar';

const Home = () => {
  const [imageFile, setImageFile] = useState(null);
  const [zona, setZona] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [mensaje, setMensaje] = useState('');

  const zonas = [
    { key: 'Ciudad Autónoma de Buenos Aires', label: 'CABA' },
    { key: 'Buenos Aires', label: 'AMBA' }
  ];

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !zona || !ubicacion || !asignatura) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avisos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('imgbusqueda')
      .upload(filePath, imageFile);

    if (uploadError) {
      setMensaje('Error al subir imagen: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('imgbusqueda').getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    const { error: insertError } = await supabase.from('avisos').insert([
      {
        image_url: imageUrl,
        zona: zona === 'Buenos Aires' ? 'AMBA' : 'CABA',
        ubicacion,
        asignatura
      }
    ]);

    if (insertError) {
      setMensaje('Error al guardar aviso: ' + insertError.message);
    } else {
      setMensaje('Aviso cargado correctamente.');
      setImageFile(null);
      setZona('');
      setUbicacion('');
      setAsignatura('');
    }
  };

  return (
    <>
      <MyNavbar />
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        <h3 className="mb-4 text-center">Cargar nuevo aviso</h3>

        {mensaje && (
          <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Imagen:</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Zona:</label>
            <select className="form-select" value={zona} onChange={(e) => setZona(e.target.value)}>
              <option value="">Seleccionar</option>
              {zonas.map((z) => (
                <option key={z.key} value={z.key}>{z.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación:</label>
            <select
              className="form-select"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              disabled={!zona}
            >
              <option value="">Seleccionar</option>
              {(ubicacionData[zona] || []).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Asignatura:</label>
            <select className="form-select" value={asignatura} onChange={(e) => setAsignatura(e.target.value)}>
              <option value="">Seleccionar</option>
              {asignaturaData.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Subir aviso</button>
          </div>
        </form>
      </div>
    </>
  );
};

export { Home };
