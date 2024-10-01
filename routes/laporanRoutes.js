const express = require('express');
const laporanController = require('../controllers/laporanController');

const router = express.Router();
const upload = require('../middleware/multer');

// Endpoint untuk membuat laporan
router.post('/laporan', upload, laporanController.createLaporan);

// Endpoint untuk mendapatkan semua laporan
router.get('/laporan', laporanController.getAllLaporan);

// Endpoint untuk mendapatkan laporan berdasarkan ID
router.get('/laporan/:id', laporanController.getLaporanById);

router.put('/laporan/:id',upload, laporanController.updateLaporan); // Update
router.delete('/laporan/:id', laporanController.deleteLaporan); // Delete
router.get('/laporan/username/:username', laporanController.getLaporanByUsername);
// Endpoint untuk meng-upload file ke laporan
router.post('/laporan/:id/upload', upload, laporanController.uploadFiles);

// Endpoint untuk menghapus file dari laporan
router.delete('/laporan/:id/delete', laporanController.deleteFiles);

module.exports = router;
