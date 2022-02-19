import React, { useEffect } from 'react'
import './global.css'
import { NearContextProvider, useNear } from './Context/near-context'

export default function App() {
  return <NearContextProvider>
    <h1>Hello world</h1>
    <TestComponent />
  </NearContextProvider>
}

const TestComponent = () => {
  const { contract, user } = useNear();
  useEffect(() => {
    console.log(user);
  }, [user]);
  return <button onClick={async () => await contract.login()} value="Sign In"/>
}