import React from "react";
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-slate-800 text-white">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <Link to="/" className="text-lg font-semibold">HandyFind</Link>
                    <div className="text-sm">Connects customers with reliable local service providers</div>
                </div>

                <div className="text-sm text-center md:text-right">&copy; {new Date().getFullYear()} HandyFind — Built with care❤️</div>
            </div>
        </footer>
    );
}

export default Footer;