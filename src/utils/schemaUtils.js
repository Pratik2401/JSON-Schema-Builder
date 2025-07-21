export function buildSchema(fields) {
  const schema = {};
  fields.forEach(field => {
    
    const key = field.name && field.name.trim() ? field.name : 'key';
    
    if (field.type === 'nested') {
      
      schema[key] = buildSchema(field.fields || []);
    } else {
      
      const typeLabel = field.type.charAt(0).toUpperCase() + field.type.slice(1);
      schema[key] = typeLabel;
    }
  });
  return schema;
}
