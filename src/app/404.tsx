// pages/404.js
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" passHref>
        <button className="mt-6 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default Custom404;
