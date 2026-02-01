import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PaymentModal = ({ amount, citizenName, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            onSuccess({
                transactionId: 'TXN' + Date.now(),
                amount: amount,
                method: paymentMethod
            });
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#003D82]">Payment Required</h2>
                    <p className="text-gray-500 text-sm mt-1">Total Amount to Pay</p>
                    <p className="text-4xl font-extrabold text-green-600 mt-2">₹{amount.toFixed(2)}</p>
                </div>

                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white shadow-sm text-[#003D82]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        UPI / QR
                    </button>
                    <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'cash' ? 'bg-white shadow-sm text-[#003D82]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Cash
                    </button>
                </div>

                <div className="mb-8 min-h-[250px] flex flex-col items-center justify-center">
                    {paymentMethod === 'upi' ? (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <div className="bg-white p-4 rounded-xl border-2 border-[#003D82] shadow-sm mb-4">
                                <QRCodeSVG
                                    value={`upi://pay?pa=shopkeeper@ration&pn=RationShop&am=${amount}&cu=INR`}
                                    size={180}
                                    level="H"
                                />
                            </div>
                            <p className="text-xs text-gray-400 font-mono">Scan with any UPI App</p>
                            <p className="text-xs text-orange-500 font-bold mt-2 animate-pulse">Simulated Payment Mode</p>
                        </div>
                    ) : (
                        <div className="text-center animate-in zoom-in duration-300 space-y-4">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium">Please collect <span className="font-bold text-black">₹{amount.toFixed(2)}</span> cash from <br />{citizenName}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-[#003D82] text-white rounded-xl font-bold text-lg hover:bg-[#002A5C] transition-all shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Processing...
                        </>
                    ) : (
                        paymentMethod === 'upi' ? 'I have made the payment' : 'Mark as Received'
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
