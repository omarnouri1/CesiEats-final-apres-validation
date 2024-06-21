import developModel from "../models/developModel.js";
import orderModel from "../models/orderModel.js";

import fs from 'fs'

// all develop list
const listdevelop = async (req, res) => {
    try {
        const develops = await developModel.find({})
        res.json({ success: true, data: develops })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const updatedevelop = async (req, res) => {
    const { id, name, localisation, phone, email, password } = req.body;

    try {
        const develop = await developModel.findById(id);

        if (!develop) {
            return res.json({ success: false, message: "develop not found" });
        }

        develop.name = name || develop.name;
        develop.localisation = localisation || develop.localisation;
        develop.phone = phone || develop.phone;
        develop.email = email || develop.email;
        develop.password = password || develop.password;

        await develop.save();
        res.json({ success: true, message: "develop Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
// add food
const adddevelop = async (req, res) => {

    const {name, localisation, phone,email,password} = req.body;

    const develop = new developModel({
        name: req.body.name,
        localisation: req.body.localisation,
        phone: req.body.phone,
        email:req.body.email,
        password: req.body.password,
    })
    try {
        await develop.save();
        res.json({ success: true, message: "develop Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete develop
const removedevelop = async (req, res) => {
    try {

        await developModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "develop Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const finddevelopByName = async (req, res) => {
    const { email } = req.body;

    try {
        const develop = await developModel.findOne({ email });

        if (!develop) {
            return res.json({ success: false, message: "develop not found" });
        }

        res.json({ success: true, data: develop });
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
  
  const upgradedevelop = async (id, newData) => {
    try {
        const develop = await developModel.findById(id);

        if (!develop) {
            throw new Error("develop not found");
        }

        // Actualizar los campos que se proporcionan en newData
        Object.keys(newData).forEach(key => {
            develop[key] = newData[key];
        });

        // Guardar los cambios
        await develop.save();
        
        return { success: true, message: "develop updated successfully" };
    } catch (error) {
        console.error("Error upgrading develop:", error);
        return { success: false, message: error.message };
    }
}


export { listdevelop, adddevelop, removedevelop,updatedevelop, finddevelopByName,getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct,getTotalItems, getOrdersPerState, upgradedevelop }