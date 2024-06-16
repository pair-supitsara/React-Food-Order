import { useContext } from "react"
import { currencyFormatter } from '../util/formatting.js'

import Modal from "./UI/Modal.jsx"
import Button from "./UI/Button.jsx"
import CartContext from '../store/CartContext.jsx'
import UserProgressContext from '../store/UserProgressContext.jsx'
import CartItem from '../components/CartItem.jsx'

export default function Cart() {
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)

    const totalPriceOfItems = cartCtx.items.reduce(
        (total, item) => { 
            return total + item.quantity * item.price 
    }, 0)

    function handleCloseCart() {
        userProgressCtx.hideCart()
    }

    function handleOpenCheckout() {
        userProgressCtx.showCheckout()
    }
    
    return (
        <Modal 
            className="cart" 
            open={userProgressCtx.progress === 'cart'} 
            onClose={userProgressCtx.progress === 'cart' ? handleCloseCart : null }
        >
            <h2>Your Cart</h2>
            <ul>{cartCtx.items.map((item) => 
                <CartItem 
                    key={item.id} 
                    {...item} 
                    onIncrease={() => cartCtx.addItem(item)}
                    onDecrease={() => cartCtx.removeItem(item.id)}
                />
            )}</ul>
            <p className="cart-total">{currencyFormatter.format(totalPriceOfItems)}</p>
            <p className="modal-actions">
                <Button textOnly onClick={handleCloseCart}>Close</Button>
                {cartCtx.items.length > 0 && <Button onClick={handleOpenCheckout}>Go to Checkout</Button>}
            </p>
        </Modal>
    )
}