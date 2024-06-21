import apiModel from '../models/apiModel.js'; // Asegúrate de que la ruta sea correcta según tu estructura de archivos

// Controlador para obtener todos los registros
const getAllApis = async (req, res) => {
    try {
        const apis = await apiModel.find();
        res.json({ success: true, data: apis })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
};

// Controlador para crear un nuevo registro
const createApi = async (req, res) => {
    const api = req.body;

    
    const newApi = new apiModel({
        name: req.body.name,
        secretKey: req.body.secretKey,
        iddevelop: req.body.iddevelop,
    })

    try {
        await newApi.save();
        res.json({ success: true, message: "API Added" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }
};

// Controlador para actualizar un registro existente
const updateApi = async (req, res) => {
    console.log("Inicio de la función updateApi");
    const { id } = req.params.id;
    console.log(`ID recibido desde params: ${id}`);
    const { name, secretKey, iddevelop } = req.body;
    console.log(`Datos recibidos en el cuerpo del request: name=${name}, secretKey=${secretKey}, iddevelop=${iddevelop}`);

    try {
        const api = await apiModel.findById(id);
        console.log(`API encontrada en la base de datos: ${api}`);

        if (!api) {
            console.log("API no encontrada, enviando respuesta 404");
            return res.status(404).json({ success: false, message: 'API not found' });
        }

        console.log("Actualizando propiedades de la API...");
        api.name = name || api.name;
        api.secretKey = secretKey || api.secretKey;
        api.iddevelop = iddevelop || api.iddevelop;

        console.log("Guardando cambios en la base de datos...");
        await api.save();

        console.log("API actualizada exitosamente, enviando respuesta 200");
        res.status(200).json({ success: true, message: 'API updated successfully' });
    } catch (error) {
        console.error('Error actualizando la API:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const upgraapi = async (id, newData) => {
    try {
        const api = await apiModel.findById(id);

        if (!api) {
            throw new Error("api not found");
        }

        // Actualizar los campos que se proporcionan en newData
        Object.keys(newData).forEach(key => {
            api[key] = newData[key];
        });
        

        // Guardar los cambios
        await api.save();
        
        return { success: true, message: "api updated successfully" };
    } catch (error) {
        console.error("Error upgrading api:", error);
        return { success: false, message: error.message };
    }
};

// Controlador para eliminar un registro
const deleteApi = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No API with id: ${id}`);

    await apiModel.findByIdAndRemove(id);

    res.json({ message: "API deleted successfully." });
};


export { getAllApis, createApi, updateApi, deleteApi,upgraapi };
