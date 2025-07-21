
/**
 * SchemaBuilder.jsx
 * -----------------
 * Main component for building a dynamic JSON schema.
 * Allows users to add, edit, and remove fields, including nested fields.
 * Displays a real-time JSON preview of the schema.
 * Responsive layout: side-by-side on desktop, stacked on mobile.
 * Uses Redux for state management and Ant Design for UI.
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Row, Col } from 'antd';
import FieldRow from './FieldRow';
import { addField, removeField, setFields } from '../redux/schemaSlice';
import '../styles/SchemaBuilder.css';

/**
 * SchemaBuilder
 * -------------
 * Main functional component for the schema builder UI.
 * Handles responsive layout, field management, and JSON preview.
 */
export default function SchemaBuilder() {
  const dispatch = useDispatch();
  const { fields, jsonOutput } = useSelector(state => state.schema);

  useEffect(() => {
    if (!fields || fields.length === 0) {
      dispatch(setFields([{ name: 'field1', type: 'string', fields: [] }]));
    }
  }, [dispatch]);

  /**
   * BuilderComponent
   * ----------------
   * Renders the list of fields and the "Add Field" button.
   */
  const BuilderComponent = () => (
    <div className="builderContainer">
      <div className="fieldsContainer">
        {fields.map((field, idx) => (
          <FieldRow
            key={idx}
            index={idx}
            path={`${idx}`}
            field={field}
            onRemove={() => dispatch(removeField(idx))}
          />
        ))}
      </div>
      
      <Button 
        className="addFieldButton"
        type="primary" 
        block
        onClick={() => {
          const fieldCount = fields.length + 1;
          dispatch(addField({ name: `field${fieldCount}`, type: 'string', fields: [] }));
        }}
      >
        Add Field
      </Button>
    </div>
  );

  /**
   * JsonOutputComponent
   * -------------------
   * Displays the real-time JSON output of the schema.
   */
  const JsonOutputComponent = () => (
    <div className="jsonOutputContainer">
      <pre className="jsonOutputPre">
        {JSON.stringify(jsonOutput, null, 2)}
      </pre>
    </div>
  );

  /**
   * Main render: Responsive layout with Builder and JSON Output
   */
  return (
    <Card 
      className="schemaBuilderCard"
      title="Schema Builder"
      headStyle={{ background: '#e96c55', color: 'white' }}
    >
      <div className="mobileView">
        <Card className="innerCard" title="Builder" headClassName="innerCardHead" style={{ marginBottom: 16 }}>
          <BuilderComponent />
        </Card>
        <Card className="innerCard" title="JSON Output" headClassName="innerCardHead">
          <JsonOutputComponent />
        </Card>
      </div>
      
      <Row className="desktopView" gutter={16}>
        <Col span={12}>
          <Card className="innerCard" title="Builder" headClassName="innerCardHead">
            <BuilderComponent />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="innerCard" title="JSON Output" headClassName="innerCardHead">
            <JsonOutputComponent />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
