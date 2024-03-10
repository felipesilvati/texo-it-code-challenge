'use client';
import { useRouter } from 'next/router';
import { Menu, Typography } from 'antd';
const { Title } = Typography;

const items = [
  { label: 'Dashboard', key: '/' },
  { label: 'Movies', key: '/movies' },
];

export default function Layout({ children }) {
  const router = useRouter();

  const handleMenuClick = (e) => {
    router.push(e.key);
  };

  return (
    <>
      <Title style={{ width: '100%', background: '#ececec', padding: '20px', fontSize: '1.5em' }}>
        Frontend React Test
      </Title>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: '256px', flexShrink: 0 }}>
          <Menu
            onClick={handleMenuClick}
            mode='inline'
            items={items}
            defaultSelectedKeys={[router.pathname]}
            style={{ height: '100%', borderRight: 0 }}
          />
        </aside>
        <main style={{ flexGrow: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </>
  );
}
