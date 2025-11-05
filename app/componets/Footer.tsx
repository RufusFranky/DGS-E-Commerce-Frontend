export default function Footer() {
  return (
    <footer className=" footer py-8">
      <div className=" mx-auto px-9 flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-semibold logo">HOTBRAY</h2>
          {/* <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} HOTBRAY. All rights reserved.
          </p> */}
        </div>

        {/* Right side */}
        <div className="flex space-x-6 text-sm fotter_links">
          <a href="./" className="transition">Home</a>
          <a href="./products" className="transition">Product</a>
          <a href="#" className="transition">About</a>
          <a href="#" className="transition">Contact</a>
        </div>
      </div>

      {/* Bottom border */}
      <div className="mt-6 border-t border-white-700 pt-4 text-center text-sm">
                  <p className=" mt-2">
            &copy; {new Date().getFullYear()} HOTBRAY. All rights reserved.
          </p>
      </div>
    </footer>
  );
}
