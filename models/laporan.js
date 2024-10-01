'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Laporan extends Model {
    static associate(models) {
      // define association here, jika ada
    }
  }

  Laporan.init({
    vendor: DataTypes.STRING,
    date: DataTypes.DATE,
    nama_barang: DataTypes.STRING,
    delivered_by: DataTypes.STRING,
    fileUpload: DataTypes.STRING, // URL dari ImageKit
    username: DataTypes.STRING,
    no_resi: DataTypes.STRING,
    part_number: DataTypes.STRING,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Laporan',
    tableName: 'laporan', // pastikan sesuai dengan nama tabel di database
    timestamps: true, // jika menggunakan created_at dan updated_at
    createdAt: 'created_at',
    updatedAt: false // jika tidak perlu menggunakan updated_at
  });

  return Laporan;
};
