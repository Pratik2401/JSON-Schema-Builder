
/**
 * FieldRow.jsx
 * ------------
 * Component for rendering and managing a single field (row) in the schema builder.
 * Supports editing field name, type, value, and nested fields.
 * Handles debounced updates, nested field management, and sibling field addition.
 * Uses Ant Design for UI and Redux for state management.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Select, Button, Card, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { addField, addNestedField, removeNestedField, updateField } from '../redux/schemaSlice';
import '../styles/FieldRow.css';

// Supported field types for the schema builder
const FIELD_TYPES = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Null', value: 'null' },
  { label: 'Array', value: 'array' },
  { label: 'Nested', value: 'nested' },
];

/**
 * FieldRow
 * --------
 * Renders and manages a single field (row) in the schema builder.
 * Handles editing, debounced updates, nested field management, and sibling field addition.
 * Uses Ant Design for UI and Redux for state management.
 */
export default function FieldRow({ index = 0, path = '0', field = { name: '', type: 'string', value: '', fields: [] }, onRemove = () => {} }) {
  const dispatch = useDispatch();
  const { fields: allFields } = useSelector(state => state.schema);
  const [fieldName, setFieldName] = useState(field.name);
  const [fieldType, setFieldType] = useState(field.type);
  const [fieldValue, setFieldValue] = useState(field.value !== undefined ? field.value : '');

  // Parses the path for nested/sibling logic.
  const pathParts = path.split('.');
  const currentIndex = parseInt(pathParts[pathParts.length - 1]);
  const parentPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('.') : null;

  /**
   * Syncs local state with Redux field prop.
   */
  useEffect(() => {
    if (field.name !== fieldName) {
      setFieldName(field.name || '');
    }
    if (field.type !== fieldType) {
      setFieldType(field.type || 'string');
    }
    if (field.value !== fieldValue && field.value !== undefined) {
      setFieldValue(field.value);
    }
  }, [field]);

  /**
   * Handles debounced update for field name.
   */
  const timeoutRef = React.useRef(null);
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFieldName(newName);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (path) {
        dispatch(updateField({
          path,
          field: { ...field, name: newName, fields: field.fields || [] }
        }));
      }
    }, 300);
  };

  /**
   * Handles debounced update for field value.
   */
  const valueTimeoutRef = useRef(null);
  const handleValueChange = (e) => {
    let newValue = e.target.value;
    if (fieldType === 'number') newValue = Number(newValue) || 0;
    else if (fieldType === 'boolean') newValue = newValue === 'true';
    else if (fieldType === 'null') newValue = null;
    setFieldValue(newValue);
    if (valueTimeoutRef.current) clearTimeout(valueTimeoutRef.current);
    valueTimeoutRef.current = setTimeout(() => {
      if (path) {
        dispatch(updateField({
          path,
          field: { ...field, value: newValue }
        }));
      }
    }, 300);
  };

  /**
   * Handles debounced update for field type.
   */
  const typeTimeoutRef = useRef(null);
  const handleTypeChange = (value) => {
    setFieldType(value);
    let defaultVal = '';
    if (value === 'number') defaultVal = 0;
    else if (value === 'boolean') defaultVal = false;
    else if (value === 'null') defaultVal = null;
    else if (value === 'array') defaultVal = [];
    else if (value === 'string') defaultVal = '';
    setFieldValue(defaultVal);
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    typeTimeoutRef.current = setTimeout(() => {
      if (path) {
        const updatedField = { 
          ...field, 
          type: value,
          value: defaultVal,
          fields: value === 'nested' ? (field.fields && field.fields.length > 0 ? field.fields : []) : []
        };
        dispatch(updateField({ path, field: updatedField }));
        if (value === 'nested' && (!field.fields || field.fields.length === 0)) {
          dispatch(addNestedField({
            parentPath: path,
            field: { name: 'property1', type: 'string', fields: [] }
          }));
        }
      }
    }, 300);
  };

  /**
   * Adds a nested field to a nested object.
   */
  const handleAddNestedField = () => {
    if (fieldType === 'nested') {
      const nestedCount = (field.fields || []).length + 1;
      const nestedName = `property${nestedCount}`;
      dispatch(addNestedField({
        parentPath: path,
        field: { name: nestedName, type: 'string', fields: [] }
      }));
    }
  };

  /**
   * Removes a nested field by index.
   */
  const handleRemoveNestedField = (nestedIndex) => {
    dispatch(removeNestedField({
      parentPath: path,
      index: nestedIndex
    }));
  };

  /**
   * Adds a sibling field at the same level.
   */
  const handleAddSiblingField = () => {
    if (parentPath) {
      const siblingIndex = (field.name.match(/\d+$/) || [0])[0];
      const siblingPrefix = field.name.replace(/\d+$/, '');
      const nextIndex = parseInt(siblingIndex) + 1 || currentIndex + 1;
      const siblingName = `${siblingPrefix || 'property'}${nextIndex}`;
      dispatch(addNestedField({
        parentPath: parentPath,
        field: { name: siblingName, type: 'string', fields: [] }
      }));
    } else {
      const fieldCount = allFields.length + 1;
      dispatch(addField({ name: `field${fieldCount}`, type: 'string', fields: [] }));
    }
  };

  /**
   * Renders the field row UI, including nested fields if applicable.
   */
  return (
    <Card
      className={`fieldRowCard ${path && path.includes('.') ? 'nested' : ''}`}
      size="small"
    >
      <div className="fieldRowContainer">
        <Input
          className="fieldNameInput"
          value={fieldName}
          onChange={handleNameChange}
          placeholder={fieldType === 'string' ? 'String' : 
                     fieldType === 'number' ? 'Number' : 
                     fieldType === 'boolean' ? 'Boolean' : 
                     fieldType === 'null' ? 'Null' : 
                     fieldType === 'array' ? 'Array' : 
                     fieldType === 'nested' ? 'Nested Object' : 'Field Name'}
        />
        <Select 
          className="fieldTypeSelect"
          value={fieldType}
          onChange={handleTypeChange}
          options={FIELD_TYPES}
          defaultValue="string"
          placeholder="Select type"
        />
        <Space>
          <Button
            className="buttonPrimary"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={onRemove}
          >
            Delete
          </Button>
          <Button
            className="buttonPrimary"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSiblingField}
          >
            Add Sibling
          </Button>
          {fieldType === 'nested' && (
            <Button
              className="buttonPrimary"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNestedField}
            >
              Add Property
            </Button>
          )}
        </Space>
      </div>
      {fieldType === 'nested' && field.fields && field.fields.length > 0 && (
        <div className="nestedFieldsContainer">
          {field.fields.map((nestedField, idx) => (
            <FieldRow
              key={`${path}.${idx}`}
              index={idx}
              path={`${path}.${idx}`}
              field={nestedField}
              onRemove={() => handleRemoveNestedField(idx)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
