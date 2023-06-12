import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
// import BackToHome from "./BackToHome";

function AddProduct({ productID, quantity }) {
    const [message, setMessage] = useState('');

    localStorage.setItem('message', '');

    const handleAddProduct = () => {
        const productData = {
            product_id: productID,
            quantity: quantity,
        };

        axios
            .post('http://localhost:8082/api/warehouse/add', productData)
            .then((response) => {
                const message2 = response.data.message;
                console.log(message2);
                setMessage(message2);
            })
            .catch((error) => {
                console.error('Error adding product:', error);
                setMessage('Error adding product');
            });
    };

    return (
        <div>
            <div className="Submit-button" onClick={handleAddProduct}>
                Add Product
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

class Warehouse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            productID: '',
            quantity: '',
            message: '',
        };
    }

    componentDidMount() {
        axios
            .get('http://localhost:8080/api/products/all')
            .then((response) => {
                this.setState({
                    products: response.data,
                });
                console.log(this.state.products);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { productID, quantity, message } = this.state;
        const userId = localStorage.getItem('userId');

        const handleProductIDChange = (e) => {
            this.setState({
                productID: e.target.value,
            });
        };

        const handleQuantityChange = (e) => {
            this.setState({
                quantity: e.target.value,
            });
        };

        return (
            <>
                {userId === "1" ? (
                    <div>
                        <h2>Add Product to Warehouse</h2>
                        <form>
                            <div>
                                <label>Product ID</label>
                                <br />
                                <input type="number" value={productID} onChange={handleProductIDChange} />
                            </div>
                            <div>
                                <label>Quantity</label>
                                <br />
                                <input type="number" value={quantity} onChange={handleQuantityChange} />
                            </div>
                            <br />
                            <AddProduct productID={productID} quantity={quantity} />
                        </form>
                        <br />
                        {message && <p>{message}</p>}
                        <div className="Products-list">
                            List of products
                            {this.state.products.map((product) => {
                                return (
                                    <div className="Card" key={product.id}>
                                        <div className="Card-info">
                                            <div className="Card-name">
                                                name: {product.name}, id: {product.id}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (<div>No permission</div>)}
            </>
        );
    }
}

export default Warehouse;
