export const Notices = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">


            <div className="bg-white/90 backdrop-blur-md
                            border border-blue-100
                            shadow-sm rounded-xl p-5">

                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    Notices
                </h3>

                <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li>Ration distribution starts from 1st of every month</li>
                    <li>Carry original ration card</li>
                    <li>Biometric verification mandatory</li>
                </ul>
            </div>


            <div className="bg-white/90 backdrop-blur-md
                            border border-blue-100
                            shadow-sm rounded-xl p-5">

                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    Instructions
                </h3>

                <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li>Update family details regularly</li>
                    <li>Collect ration from assigned shop only</li>
                    <li>Report issues to Admin</li>
                </ul>
            </div>

        </div>
    );
};

export default Notices;
