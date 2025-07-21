
import { useState } from 'react';
import { Layout, Typography } from 'antd';
import SchemaBuilder from './components/SchemaBuilder';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fffaf0' }}>
      <Content style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>JSON Schema Builder</Title>
          <Paragraph type="secondary">Create and visualize your data schema</Paragraph>
        </div>
        <SchemaBuilder />
      </Content>
    </Layout>
  )
}

export default App
