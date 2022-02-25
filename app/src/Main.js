import React, { useContext, useEffect, useState } from 'react';
import injectContext, { Context } from './store/appContext';

const Main = () => {

    const { store, actions } = useContext(Context);
    const { currentUser } = store;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        //actions.getLoginAsync();
    }, [])

    return (
        <>
            <h1>Hola Mundo desde React</h1>

            {
                currentUser === null ? (
                    <form onSubmit={e => {
                        e.preventDefault();

                        const credentials = {
                            email: email,
                            password: password
                        };

                        actions.getLoginAsync(credentials);
                    }}>
                        <input type="text" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
                        <button>Login</button>
                        <p style={{ color: 'red'}}>{store.error !== null && store.error}</p>
                    </form>
                ) : (
                    <h1>Bienvenido, {currentUser.email}</h1>
                )
            }

        </>
    )
}

export default injectContext(Main);