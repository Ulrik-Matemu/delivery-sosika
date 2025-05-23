interface OrderStatus {
    order_status: string;
}

export const checkOrderStatus = async (id: Number) => {
    try {
        const response = await fetch(`https://sosika-backend.onrender.com/api/orders/${id}`);
        const latestOrder: OrderStatus = await response.json();
        if (latestOrder && latestOrder.order_status === "completed") {
            localStorage.removeItem("orderLocations");
            alert('Order Completed');
            window.location.assign('/orders');
        } else if (latestOrder && latestOrder.order_status === "cancelled") {
            localStorage.removeItem("orderLocations");
            alert('Order has been cancelled');
            window.location.assign('/orders');
        } else return;
    } catch(error) {
        console.error('Error fetching order status');
    }
}