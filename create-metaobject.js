require('dotenv').config();

const SHOP = process.env.SHOPIFY_SHOP;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const mutation = `
mutation {
  metaobjectDefinitionCreate(definition: {
    type: "rmbl_solicitud",
    name: "Solicitud Remueble",
    fieldDefinitions: [
      { key: "flow", name: "Flow", type: "single_line_text_field" },
      { key: "tipo", name: "Tipo de mueble", type: "single_line_text_field" },
      { key: "cantidad", name: "Cantidad", type: "single_line_text_field" },
      { key: "estado", name: "Estado del mueble", type: "single_line_text_field" },
      { key: "ubicacion", name: "Ubicación", type: "single_line_text_field" },
      { key: "nombre", name: "Nombre", type: "single_line_text_field" },
      { key: "contacto", name: "Contacto", type: "single_line_text_field" },
      { key: "precio", name: "Precio solicitado", type: "single_line_text_field" },
      { key: "ofertas", name: "Acepta ofertas", type: "single_line_text_field" },
      { key: "logistica", name: "Logística", type: "single_line_text_field" },
      { key: "metodo", name: "Método restauración", type: "single_line_text_field" },
      { key: "historia", name: "Interés en historia", type: "single_line_text_field" },
      { key: "kit", name: "Interés en kit", type: "single_line_text_field" },
      { key: "nota", name: "Nota adicional", type: "multi_line_text_field" },
      { key: "mejoras", name: "Mejoras deseadas", type: "multi_line_text_field" },
      { key: "fotos", name: "Fotos subidas", type: "multi_line_text_field" },
      { key: "descripcion", name: "Descripción del mueble", type: "multi_line_text_field" },
      { key: "fecha", name: "Fecha de envío", type: "single_line_text_field" },
      { key: "estado_gestion", name: "Estado gestión", type: "single_line_text_field" }
    ]
  }) {
    metaobjectDefinition { id type name }
    userErrors { field message }
  }
}`;

async function run() {
  console.log('URL:', `https://${SHOP}/admin/api/2025-01/graphql.json`);
  console.log('TOKEN:', TOKEN ? 'OK (definido)' : 'UNDEFINED');
  
  const res = await fetch(`https://${SHOP}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify({ query: mutation })
  });
  const json = await res.json();
  console.log('Respuesta completa:', JSON.stringify(json, null, 2));
}

run();
