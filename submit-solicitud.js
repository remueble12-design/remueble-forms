require('dotenv').config();
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const PORT = 3000;

const CAMPOS = [
  'flow','tipo_de_mueble','cantidad','estado_del_mueble','ubicacion',
  'nombre','contacto','precio_solicitado','acepta_ofertas','logistica',
  'metodo_restauracion','interes_en_historia','interes_en_kit',
  'fecha_de_envio','estado_gestion','nota_adicional',
  'mejoras_deseadas','descripcion_del_mueble','fotos_subidas'
];

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (req.method === 'POST' && req.url === '/submit') {
    try {
      const data = await parseBody(req);
      console.log('📥 Solicitud recibida:', data);
      const fila = {};
      CAMPOS.forEach(k => { if (data[k] !== undefined && data[k] !== '') fila[k] = String(data[k]); });
      if (!fila.estado_gestion) fila.estado_gestion = 'pendiente';
      const { data: result, error } = await supabase.from('solicitudes').insert([fila]).select();
      if (error) {
        console.error('❌ Error Supabase:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: error.message }));
      }
      console.log('✅ Guardado:', result[0].id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, id: result[0].id }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }

  } else if (req.method === 'POST' && req.url === '/submit/update-fotos') {
    try {
      const data = await parseBody(req);
      const { error } = await supabase.from('solicitudes').update({ fotos_subidas: data.fotos_subidas }).eq('id', data.id);
      if (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: error.message }));
      }
      console.log('📸 Fotos actualizadas para id:', data.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }

  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));