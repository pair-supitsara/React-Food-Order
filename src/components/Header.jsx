import { useContext } from 'react'

import ImgLogo from '../assets/logo.jpg'
import Button from './UI/Button.jsx'
import CartContext from '../store/CartContext.jsx'
import UserProgressContext from '../store/UserProgressContext.jsx'

function Header() {
    const cartCtx = useContext(CartContext)
    const userProgressCxt = useContext(UserProgressContext)

    const totalNumberOfItems = cartCtx.items.reduce((total, item) => total += item.quantity , 0)

    function handleShowCart() {
        userProgressCxt.showCart()
    }

    return (
        <header id="main-header">
            <div id="title">
                <img src={ImgLogo} alt="" />
                <h1>ReactFood</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart} >Cart ({ totalNumberOfItems })</Button>
            </nav>
        </header>
    )
}

export default Header