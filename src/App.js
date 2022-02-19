import React from 'react'
import './global.css'
import { NearContextProvider, useNear } from './Context/near-context'
import Navbar from './components/shared/organisms/navbar'
import LayoutPage from './pages/shared/layout-page'

export default function App() {
  return <NearContextProvider>
    <BootstrapComponent />
  </NearContextProvider>
}

const BootstrapComponent = () => {
  const { initialized } = useNear();
  if (!initialized)
    return <div>Loading...</div>;
  
  return <LayoutPage />
}
