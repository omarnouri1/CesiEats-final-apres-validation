import restaurantModel from "../models/restaurantModel.js";
import orderModel from "../models/orderModel.js";


import fs from 'fs'

// all restaurant list
const listrestaurant = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({})
        res.json({ success: true, data: restaurants })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const upgradeRestaurant = async (id, newData) => {
    try {
        const restaurant = await restaurantModel.findById(id);

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        // Actualizar los campos que se proporcionan en newData
        Object.keys(newData).forEach(key => {
            restaurant[key] = newData[key];
        });

        // Guardar los cambios
        await restaurant.save();
        
        return { success: true, message: "Restaurant updated successfully" };
    } catch (error) {
        console.error("Error upgrading restaurant:", error);
        return { success: false, message: error.message };
    }
};

// add food
// En tu controlador
const addrestaurant = async (req, res) => {
    const { name = "newrestaurante", email, localisation, phone } = req.body;
    try {
        // Verificar si el restaurante ya existe
        const existingRestaurant = await restaurantModel.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ success: false, message: "Restaurant already exists" });
        }

        // Crear el nuevo restaurante
        const newRestaurant = new restaurantModel({ name, email, localisation, phone });
        await newRestaurant.save();

        res.status(201).json({ success: true, message: "Restaurant created successfully" });
    } catch (error) {
        console.error("Error adding restaurant:", error);
        res.status(500).json({ success: false, message: "Error adding restaurant" });
    }
};


// delete restaurant
const removerestaurant = async (req, res) => {
    try {

        await restaurantModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "restaurant Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const findRestaurantByName = async (req, res) => {
    const { email } = req.body;

    try {
        const restaurant = await restaurantModel.findOne({ email });

        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }

        res.json({ success: true, data: restaurant });
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
  



export { listrestaurant, addrestaurant, removerestaurant,upgradeRestaurant, findRestaurantByName,getTotalOrders, getTotalEarnings, getOrdersPerDay, getOrdersPerProduct,getTotalItems, getOrdersPerState }