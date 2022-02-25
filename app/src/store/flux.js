const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            access_token: null,
            currentUser: null,
            error: null,
        },
        actions: {
            getLoginAsync: async (credentials) => {
                /* const credentials = {
                    email: 'maca.rebolledo@4geeks.co',
                    password: 'mojonapower'
                }; */
                const response = await fetch('https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io/api/login', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log(data);
                if(data.status === 'success'){
                    setStore({ currentUser: data.user, access_token: data.access_token, error: null });
                    sessionStorage.setItem('access_token', data.access_token);
                    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                } else {
                    setStore({ currentUser: null, access_token: null, error: data.msg });
                }
            },
            getLogin: () => {
                const credentials = {
                    email: 'maca.rebolledo@4geeks.co',
                    password: 'mojonapower'
                };
                fetch('https://5000-ljavierrodrigue-appreact-z5i92wdxwqa.ws-us34.gitpod.io/api/login', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.log(error));
            },
            getSessionUser: () => {
                if(sessionStorage.getItem('access_token')){
                    console.log(1);
                    setStore({ 
                        currentUser: JSON.parse(sessionStorage.getItem('currentUser')), 
                        access_token: sessionStorage.getItem('access_token') 
                    });
                }
            }
        }
    }
}

export default getState;