import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./../Styles/cart.css";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, [navigate, user]);

  const handleRemove = (courseId) => {
    const updatedCart = cartItems.filter((c) => c.id !== courseId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Removed from cart");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      
      for (const course of cartItems) {
        try {
          await axios.post(
            `https://onlinecoursemanagementsystem-production.up.railway.app/api/courses/${course.id}/enroll`,
            {},
            config
          );
        } catch (err) {
          if (err.response?.status !== 400) {
            throw err;
          }
        }
      }
      
      toast.success("Successfully enrolled in cart courses!");
      setCartItems([]);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/mycourses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cartPage">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="emptyCart">Your cart is empty.</p>
      ) : (
        <div className="cartContent">
          <div className="cartItems">
            {cartItems.map((item) => (
              <div key={item.id} className="cartItem">
                <div className="cartItemDetails">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price || 0}</p>
                </div>
                <button onClick={() => handleRemove(item.id)} className="removeBtn">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cartSummary">
            <h3>Summary</h3>
            <p>Total Items: {cartItems.length}</p>
            <p>Total Price: ${totalPrice}</p>
            <button onClick={handleCheckout} className="checkoutBtn" disabled={loading}>
              {loading ? "Processing..." : "Checkout & Enroll"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
