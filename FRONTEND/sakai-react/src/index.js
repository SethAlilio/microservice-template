import 'react-app-polyfill/ie11';
import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, HashRouter, MemoryRouter} from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import {AxiosInterceptor} from "./components/base/axios";
ReactDOM.render(
    <MemoryRouter>
        <ScrollToTop>
            <React.StrictMode>
                <AxiosInterceptor>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        limit={1}
                    />
                    <App/>
                </AxiosInterceptor>
            </React.StrictMode>
        </ScrollToTop>
    </MemoryRouter>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
