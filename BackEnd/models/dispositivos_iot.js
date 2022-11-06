const con = require('../models/conexion.js');


const callback = (err, rows, resolve, reject, msg) => {
  if (err) { console.log(err); return reject(err) };
  if (msg) console.log(msg)
  return resolve(rows);
}

module.exports = {

  //Métodos del crud para la administración de dispositivos IoT
  methods: {
    selectAll: function () {
      return new Promise((resolve, reject) => {
        con.query('SELECT *FROM dispositivo_iot', (err, rows) => {
          callback(err, rows, resolve, reject)
        })
      })
    },
    deleteDevice: function (id) {
      return new Promise((resolve, reject) => {
        con.query(`DELETE FROM dispositivo_iot WHERE id_dispositivo_iot = ${id}`, (err, rows) => {
          callback(err, rows, resolve, reject)
        });
      })
    },
    insertDevice: function (data) {
      return new Promise((resolve, reject) => {
        con.query(`INSERT INTO dispositivo_iot (id_dispositivo_iot, nombre, tipo, estado, dato_medida) VALUES (${parseInt(data.id)}, '${data.nombre}', '${data.tipo}', ${JSON.parse(data.estado.toLowerCase())}, '${data.variable_medida}')`, (err, rows) => {
          callback(err, rows, resolve, reject)
        })
      })
    },
    updateDevice: function (data) {
      return new Promise((resolve, reject) => {
        con.query(`UPDATE dispositivo_iot SET nombre = '${data.nombre}', tipo = '${data.tipo}', dato_medida = '${data.variable_medida}' WHERE id_dispositivo_iot = '${data.id}'`, (err, rows) => {
          callback(err, rows, resolve, reject)
        });
      });
    }
  }
}