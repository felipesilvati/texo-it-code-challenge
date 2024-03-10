'use client';
import { Button } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const [count, setCount] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  }
  
  return (
    <>
      <h1>Dashboard</h1>
      <Button onClick={handleClick} type="primary">Button</Button>
      <p>You clicked {count} times</p>
      <Button onClick={() => router.push('/movies')} type="primary">Go to Movies</Button>
    </>
  );
}
