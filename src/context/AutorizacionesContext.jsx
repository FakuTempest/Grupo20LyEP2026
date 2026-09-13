import { createContext, useState, useEffect } from 'react'

export const AutorizacionesContext = createContext()

const AutorizacionesProvider = ({ children }) => {

  const [admin, setAdmin] = useState(()=>{
    const adminGuardado= localStorage.getItem('admin')
    if(adminGuardado){
      return JSON.parse(adminGuardado)
    }
    return null
  })
useEffect(()=>{
  if(admin){
    localStorage.setItem(
      'admin',
      JSON.stringify(admin)
    )
  }else{
    localStorage.removeItem('admin')
  }

},[admin])
// El rol vive solo en el Context (admin.sector), no en localStorage:
// ver hallazgos #2 y #3 del analisis tecnico.
const cerrarSesion=()=>{
  setAdmin(null)
  localStorage.removeItem('role')
}
return (
    <AutorizacionesContext.Provider
      value={{ admin, setAdmin, cerrarSesion }}
    >
      {children}
    </AutorizacionesContext.Provider>
  )
}

export default AutorizacionesProvider