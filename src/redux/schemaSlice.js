import { createSlice } from '@reduxjs/toolkit';
import { buildSchema } from '../utils/schemaUtils';

const initialState = {
  fields: [
    { name: 'field1', type: 'string', fields: [] },
  ],
  jsonOutput: { field1: '' }
};

export const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
      state.jsonOutput = buildSchema(action.payload);
    },
    addField: (state, action) => {
      state.fields.push(action.payload);
      state.jsonOutput = buildSchema(state.fields);
    },
    removeField: (state, action) => {
      state.fields.splice(action.payload, 1);
      state.jsonOutput = buildSchema(state.fields);
    },
    addNestedField: (state, action) => {
      const { parentPath, field } = action.payload;
      const pathArray = parentPath.split('.');
      
      let current = state.fields;
      for (let i = 0; i < pathArray.length; i++) {
        const index = parseInt(pathArray[i]);
        if (i === pathArray.length - 1) {
          current[index].fields.push(field);
        } else {
          current = current[index].fields;
        }
      }
      
      state.jsonOutput = buildSchema(state.fields);
    },
    removeNestedField: (state, action) => {
      const { parentPath, index } = action.payload;
      const pathArray = parentPath.split('.');
      
      let current = state.fields;
      for (let i = 0; i < pathArray.length; i++) {
        const idx = parseInt(pathArray[i]);
        if (i === pathArray.length - 1) {
          current[idx].fields.splice(index, 1);
        } else {
          current = current[idx].fields;
        }
      }
      
      state.jsonOutput = buildSchema(state.fields);
    },
    updateField: (state, action) => {
      const { path, field } = action.payload;
      const pathArray = path.split('.');
      
      let current = state.fields;
      for (let i = 0; i < pathArray.length; i++) {
        const index = parseInt(pathArray[i]);
        if (i === pathArray.length - 1) {
          
          const existingFields = current[index].fields || [];
          current[index] = { 
            ...current[index], 
            ...field,
            
            fields: field.fields || existingFields
          };
        } else {
          current = current[index].fields;
        }
      }
      
      state.jsonOutput = buildSchema(state.fields);
    }
  }
});

export const { 
  setFields, 
  addField, 
  removeField, 
  addNestedField, 
  removeNestedField,
  updateField
} = schemaSlice.actions;

export default schemaSlice.reducer;