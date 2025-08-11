import Image from 'next/image';
import loaderImg from 'public/images/Loader.jpg';
function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center loading">
                {/* <div className="text-center "> */}
                <Image src={loaderImg} alt="Loading..." width={100} height={100} />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default Loader;