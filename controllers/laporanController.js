const { Laporan } = require('../models');
const imagekit = require('../config/imageKit'); // pastikan konfigurasi sesuai dengan path

// Buat Laporan
exports.createLaporan = async (req, res) => {
    try {
        const { vendor, date, delivered_by, username, no_resi } = req.body;
        const { nama_barang, part_number, qty } = req.body;

        // Validate input fields
        if (!vendor || !date || !delivered_by || !username || !no_resi || !nama_barang || !part_number || !qty) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (nama_barang.length !== part_number.length || nama_barang.length !== qty.length) {
            return res.status(400).json({ message: 'Mismatch in the number of items.' });
        }

        const files = req.files; // Array of uploaded files
        let imageUrls = [];

        if (files && files.length > 0) {
            // Upload files in parallel using Promise.all
            const uploadPromises = files.map(file =>
                imagekit.upload({
                    file: file.buffer.toString('base64'),
                    fileName: file.originalname,
                    folder: '/laporan/'
                })
            );

            const uploadResponses = await Promise.all(uploadPromises);
            imageUrls = uploadResponses.map(response => response.url);
        }

        // Save laporan data to database
        const newLaporan = await Laporan.create({
            vendor,
            date,
            delivered_by,
            fileUpload: JSON.stringify(imageUrls),
            username,
            no_resi,
            nama_barang: JSON.stringify(nama_barang),
            part_number: JSON.stringify(part_number),
            qty: JSON.stringify(qty)
        });

        res.status(201).json({
            message: 'Laporan created successfully!',
            data: newLaporan
        });
    } catch (error) {
        console.error('Error creating laporan:', error);
        res.status(500).json({
            message: 'Error creating laporan',
            error: error.message
        });
    }
};


// Get Semua Laporan
exports.getAllLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.findAll();
    res.json({
      message: 'Laporan fetched successfully!',
      data: laporan
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching laporan',
      error: error.message
    });
  }
};

// Get Laporan by ID
exports.getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    const laporan = await Laporan.findByPk(id);

    if (!laporan) {
      return res.status(404).json({
        message: 'Laporan not found!'
      });
    }

    res.json({
      message: 'Laporan fetched successfully!',
      data: laporan
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching laporan',
      error: error.message
    });
  }
};

exports.updateLaporan = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari parameter request
        const { vendor, date, delivered_by, username, no_resi, nama_barang, part_number, qty } = req.body;

        // Cari laporan berdasarkan ID
        const laporan = await Laporan.findByPk(id);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found!' });
        }

        // Update field laporan
        laporan.vendor = vendor;
        laporan.date = date;
        laporan.nama_barang = JSON.stringify(nama_barang);  // Simpan sebagai string jika perlu
        laporan.delivered_by = delivered_by;
        laporan.username = username;
        laporan.no_resi = no_resi;
        laporan.part_number = JSON.stringify(part_number);   // Simpan sebagai string jika perlu
        laporan.qty = JSON.stringify(qty);                   // Simpan sebagai string jika perlu

        // Simpan laporan yang diperbarui
        await laporan.save();

        res.json({
            message: 'Laporan updated successfully!',
            data: laporan
        });
    } catch (error) {
        console.error('Error updating laporan:', error);
        res.status(500).json({
            message: 'Error updating laporan',
            error: error.message
        });
    }
};


// Upload Files
exports.uploadFiles = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari parameter request
        const files = req.files; // Ini berisi array file yang diupload

        // Cari laporan berdasarkan ID
        const laporan = await Laporan.findByPk(id);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found!' });
        }

        let imageUrls = laporan.fileUpload ? JSON.parse(laporan.fileUpload) : [];

        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResponse = await imagekit.upload({
                    file: file.buffer.toString('base64'),
                    fileName: file.originalname,
                    folder: '/laporan/' // Tentukan folder di sini
                });

                imageUrls.push(uploadResponse.url); // Tambahkan URL file baru
            }
        }

        // Update field fileUpload
        laporan.fileUpload = JSON.stringify(imageUrls); // Simpan sebagai string JSON untuk beberapa URL

        // Simpan laporan yang diperbarui
        await laporan.save();

        res.json({
            message: 'Files uploaded successfully!',
            data: laporan
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({
            message: 'Error uploading files',
            error: error.message
        });
    }
};

// Delete Files
exports.deleteFiles = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari parameter request
        const { deleteFiles } = req.body; // Ambil file URLs yang akan dihapus

        // Cari laporan berdasarkan ID
        const laporan = await Laporan.findByPk(id);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found!' });
        }

        let imageUrls = laporan.fileUpload ? JSON.parse(laporan.fileUpload) : [];

        if (deleteFiles && Array.isArray(deleteFiles)) {
            for (const fileToDelete of deleteFiles) {
                // Remove the file URL from the array
                imageUrls = imageUrls.filter(url => url !== fileToDelete);
            }
        }

        // Update field fileUpload
        laporan.fileUpload = JSON.stringify(imageUrls); // Simpan sebagai string JSON untuk beberapa URL

        // Simpan laporan yang diperbarui
        await laporan.save();

        res.json({
            message: 'Files deleted successfully!',
            data: laporan
        });
    } catch (error) {
        console.error('Error deleting files:', error);
        res.status(500).json({
            message: 'Error deleting files',
            error: error.message
        });
    }
};


// Delete Laporan
exports.deleteLaporan = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from request parameters

        // Find the laporan by ID
        const laporan = await Laporan.findByPk(id);
        if (!laporan) {
            return res.status(404).json({ message: 'Laporan not found!' });
        }

        // Delete laporan
        await laporan.destroy();

        res.json({
            message: 'Laporan deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting laporan:', error);
        res.status(500).json({
            message: 'Error deleting laporan',
            error: error.message
        });
    }
};

// Get Laporan by Username
exports.getLaporanByUsername = async (req, res) => {
    try {
        const { username } = req.params; // Get username from request parameters
        const laporan = await Laporan.findAll({
            where: { username } // Filter reports by username
        });

        if (laporan.length === 0) {
            return res.status(404).json({
                message: 'No laporan found for this username!'
            });
        }

        res.json({
            message: 'Laporan fetched successfully!',
            data: laporan
        });
    } catch (error) {
        console.error('Error fetching laporan by username:', error);
        res.status(500).json({
            message: 'Error fetching laporan',
            error: error.message
        });
    }
};
