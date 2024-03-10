'use client';
import { Button } from 'antd';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  }
  
  return (
    <>
      <h1>Hello, World!</h1>
      <Button onClick={handleClick} type="primary">Button</Button>
      <p>You clicked {count} times</p>
    </>
  );
}
