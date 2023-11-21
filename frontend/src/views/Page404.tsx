import React from 'react';
import {NavLink} from "react-router-dom";

const Page404 = () => {
    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto w-screen h-screen lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-[#2c49ed]">404</h1>
                    <p className="mb-4 text-lg font-light text-[#2c49ed]">Страница не найдена</p>
                    <NavLink to="/projects" className="inline-flex  bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-[#2c49ed] my-4">Вернуться на гланую страницу</NavLink>
                </div>
            </div>
        </section>
    );
};

export default Page404;