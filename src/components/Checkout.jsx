import { useContext } from "react"
import { currencyFormatter } from '../util/formatting.js'

import Modal from "./UI/Modal.jsx"
import Button from "./UI/Button.jsx"
import Input from "./UI/Input.jsx"
import CartContext from '../store/CartContext.jsx'
import UserProgressContext from '../store/UserProgressContext.jsx'
import Error from "./Error.jsx"

import useHttp from '../hooks/useHttp.jsx'

const url = 'http://localhost:3000/orders'
const config = { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Cart() {
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)
    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp(url, config)
    
    const totalPriceOfItems = cartCtx.items.reduce(
        (total, item) => { 
            return total + item.quantity * item.price 
    }, 0)

    function handleCloseCheckout() {
        userProgressCtx.hideCheckout()
    }

    async function handleSubmission(event) {
        event.preventDefault()
        const fd = new FormData(event.target)
        const customerData = Object.fromEntries(fd.entries())
        
        const body = JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        })
        sendRequest(body)
    }

    function clearCart() {
        cartCtx.clearCart()
        clearData()
    }

    let actions = (<>
        <Button type="button" onClick={handleCloseCheckout} textOnly>Close</Button>
        <Button>Submit Order</Button>
    </>)
    if (isSending) {
        actions = <span>sending order data</span>
    }

    if (data && !error) {
        return  <Modal 
                    open={userProgressCtx.progress === 'checkout'} 
                    onClose={userProgressCtx.progress === 'checkout' ? () => { handleCloseCheckout();clearCart(); } : null }
                >
                    <h2>Success!</h2>
                    <p>Your order was submited successfully.</p>
                    <p className="modal-actions">
                        <Button onClick={() => { handleCloseCheckout();clearCart(); }}>Okay!</Button>
                    </p>
                </Modal>
    }

    return (
        <Modal 
            open={userProgressCtx.progress === 'checkout'} 
            onClose={userProgressCtx.progress === 'checkout' ? handleCloseCheckout : null }
        >
            <form onSubmit={handleSubmission}>
                <h2>Checkout</h2>
                <p>Total Amount : {currencyFormatter.format(totalPriceOfItems)}</p>

                <Input label="Full Name" type="text" id="name" />
                <Input label="E-mail Address" type="email" id="email" />
                <Input label="Street" type="text" id="street" />
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>

                { error && <Error title="fail to submit order" message={error} />}

                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    )
}