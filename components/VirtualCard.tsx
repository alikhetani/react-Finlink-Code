import React, { useState } from 'react';
import { User } from '../types';

export const VirtualCard: React.FC<{ user: User }> = ({ user }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="w-full max-w-lg mx-auto perspective-1000">
            <div 
                className={`relative w-full aspect-[1.586] transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-gradient-to-br from-blue-700 to-slate-900 text-white p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <span className="text-xl font-bold">FinLink Global</span>
                            <div className="w-12 h-8 bg-white/20 rounded-md"></div>
                        </div>
                    </div>
                    <div>
                        <p className="font-mono text-lg tracking-wider">**** **** **** 1234</p>
                        <div className="flex justify-between items-end mt-2">
                            <p className="font-medium uppercase text-sm">{user.name}</p>
                            <p className="text-sm">12/28</p>
                        </div>
                    </div>
                </div>

                {/* Card Back */}
                <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white p-2 rotate-y-180">
                    <div className="w-full h-12 bg-black mt-4"></div>
                    <div className="text-right px-4 py-2">
                        <p className="text-xs text-slate-400">CVV</p>
                        <div className="w-full h-8 bg-white rounded-md mt-1 flex items-center justify-end px-2">
                            <p className="font-mono text-black">***</p>
                        </div>
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-4 px-4">
                        This card is for digital use only. For support, contact us through the FinLink app.
                    </p>
                </div>
            </div>
        </div>
    );
};