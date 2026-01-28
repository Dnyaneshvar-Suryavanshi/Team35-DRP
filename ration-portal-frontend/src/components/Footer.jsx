export const Footer = () => {
    return (
        <footer className="bg-blue-700 text-white py-6 mt-10 footer">
            <div className="max-w-6xl mx-auto px-4 text-center space-y-3">


                <p className="text-sm">
                    Ration Portal is a digital platform ensuring transparent and efficient
                    distribution of food grains to citizens.
                </p>


                <div className="text-sm space-y-1">
                    <p>Email: <span className="font-semibold">support@rationportal.com</span></p>
                    <p>Helpline: <span className="font-semibold">456-512-436</span></p>
                </div>


                <p className="text-xs text-blue-200 mt-3">
                    © 2025 Ration_Portal | Team 35. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
