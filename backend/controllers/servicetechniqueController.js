import servicetechniqueModel from "../models/servicetechniqueModel.js";
import orderModel from "../models/orderModel.js";

import fs from 'fs'

// all servicetechnique list
const listservicetechnique = async (req, res) => {
    try {
        const servicetechniques = await servicetechniqueModel.find({})
        res.json({ success: true, data: servicetechniques })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const updateservicetechnique = async (req, res) => {
    const { id, name, localisation, phone, email, password } = req.body;

    try {
        const servicetechnique = await servicetechniqueModel.findById(id);

        if (!servicetechnique) {
            return res.json({ success: false, message: "servicetechnique not found" });
        }

        servicetechnique.name = name || servicetechnique.name;
        servicetechnique.localisation = localisation || servicetechnique.localisation;
        servicetechnique.phone = phone || servicetechnique.phone;
        servicetechnique.email = email || servicetechnique.email;
        servicetechnique.password = password || servicetechnique.password;

        await servicetechnique.save();
        res.json({ success: true, message: "servicetechnique Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
// add food
const addservicetechnique = async (req, res) => {

    const {name, localisation, phone,email,password} = req.body;

    const servicetechnique = new servicetechniqueModel({
        name: req.body.name,
        localisation: req.body.localisation,
        phone: req.body.phone,
        email:req.body.email,
        password: req.body.password,
    })
    try {
        await servicetechnique.save();
        res.json({ success: true, message: "servicetechnique Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete servicetechnique
const removeservicetechnique = async (req, res) => {
    try {

        await servicetechniqueModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "servicetechnique Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const findservicetechniqueByName = async (req, res) => {
    const { email } = req.body;

    try {
        const servicetechnique = await servicetechniqueModel.findOne({ email });

        if (!servicetechnique) {
            return res.json({ success: false, message: "servicetechnique not found" });
        }

        res.json({ success: true, data: servicetechnique });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const getTotalOrders = async (startDate, endDate, product) => {
    try {
        const filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (product && product !== 'All') {
            filter['items.name'] = product;
        }
        const allOrders = await orderModel.find(filter);
        const totalOrders = allOrders.length;
        return totalOrders;
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener los datos de los pedidos");
    }
}

const getTotalEarnings = async (startDate, endDate, product) => {
    try {
        const filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        let orders;
        if (product && product !== 'All') {
            filter['items.name'] = product;
            orders = await orderModel.find(filter);
        } else {
            orders = await orderModel.find();
        }

        let totalEarnings = 0;
        if (orders.length > 0) {
            if (product && product !== 'All') {
                // Sumar solo las ganancias del producto seleccionado
                totalEarnings = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        if (item.name === product) {
                            acc += item.price * item.quantity;
                        }
                    });
                    return acc;
                }, 0);
            } else {
                // Sumar las ganancias de todos los productos en todos los pedidos
                totalEarnings = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        acc += item.price * item.quantity;
                    });
                    return acc;
                }, 0);
            }
        }
        
        return totalEarnings;
    } catch (error) {
        console.log(error);
        throw new Error("Error al calcular los ingresos totales");
    }
}



const getOrdersPerDay = async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;

        const filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (product && product !== 'All') {
            filter['items.name'] = product;
        }

        const orders = await orderModel.find(filter);

        const ordersPerDay = orders.reduce((acc, order) => {
            const date = new Date(order.date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        res.json({ success: true, ordersPerDay });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las órdenes por día" });
    }
}

const getOrdersPerProduct = async (req, res) => {
    try {
        const { startDate, endDate, product } = req.query;

        const filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        let orders;
        if (product && product !== 'All') {
            filter['items.name'] = product;
            orders = await orderModel.find(filter);
        } else {
            orders = await orderModel.find(filter);
        }

        // Contar las órdenes por producto
        const ordersPerProduct = orders.reduce((acc, order) => {
            order.items.forEach(item => {
                const productName = item.name;
                if (product === 'All' || productName === product) {
                    acc[productName] = (acc[productName] || 0) + 1;
                }
            });
            return acc;
        }, {});

        // Obtener el total de items cuando no se selecciona "All"
        let totalItems = 0;
        if (product && product !== 'All') {
            totalItems = orders.reduce((acc, order) => {
                order.items.forEach(item => {
                    if (item.name === product) {
                        acc += item.quantity;
                    }
                });
                return acc;
            }, 0);
        } else {
            // Si se selecciona "All", calcular el total de items para todas las órdenes
            totalItems = orders.reduce((acc, order) => {
                order.items.forEach(item => {
                    acc += item.quantity;
                });
                return acc;
            }, 0);
        }

        res.json({ success: true, ordersPerProduct, totalItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al obtener las órdenes por producto" });
    }
}

const getTotalItems = async (startDate, endDate, product) => {
    try {
        const filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        let orders;
        if (product && product !== 'All') {
            filter['items.name'] = product;
            orders = await orderModel.find(filter);
        } else {
            orders = await orderModel.find();
        }

        let totalItems = 0;
        if (orders.length > 0) {
            if (product && product !== 'All') {
                // Sumar solo los ítems del producto seleccionado
                totalItems = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        if (item.name === product) {
                            acc += item.quantity;
                        }
                    });
                    return acc;
                }, 0);
            } else {
                // Sumar todos los ítems de todos los productos en todos los pedidos
                totalItems = orders.reduce((acc, order) => {
                    order.items.forEach(item => {
                        acc += item.quantity;
                    });
                    return acc;
                }, 0);
            }
        }
        
        return totalItems;
    } catch (error) {
        console.log(error);
        throw new Error("Error al calcular el total de ítems");
    }
}

const getOrdersPerState = async (req, res) => {
    try {
      const { startDate, endDate, product, state } = req.query;
      const filter = {};
  
      if (startDate && endDate) {
        filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
  
      if (product && product !== 'All') {
        filter['items.name'] = product;
      }
  
      if (state && state !== 'All') {
        filter['address.state'] = state;
      }
  
      const orders = await orderModel.find(filter);
  
      const ordersPerState = orders.reduce((acc, order) => {
        const state = order.address.state;
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {});
  
      res.json({ success: true, ordersPerState });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error al obtener las órdenes por estado" });
    }
  }
  
  const upgradeservicetechnique = async (id, newData) => {
    try {
        const servicetechnique = await servicetechniqueModel.findById(id);

        if (!servicetechnique) {
            throw new Error("servicetechnique not found");
        }

        // Actualizar los campos que se proporcionan en newData
        Object.keys(newData).forEach(key => {
            servicetechnique[key] = newData[key];
        });

        // Guardar los cambios
        await servicetechnique.save();
        
        return { success: true, message: "servicetechnique updated successfully" };
    } catch (error) {
        console.error("Error upgrading servicetechnique:", error);
        return { success: false, message: error.message };
    }
}


export { listservicetechnique, addservicetechnique, removeservicetechnique,updateservicetechnique, findservicetechniqueByName,getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct,getTotalItems, getOrdersPerState, upgradeservicetechnique }