import { FacebookIcon, InstagramIcon, MailIcon, TwitterIcon } from 'lucide-react';

export default function Footer2() {
    return (
        <div>
            <div className="bg-primary mt-5 grid h-full w-full grid-cols-1 gap-2 px-5 py-4 text-white md:grid-cols-3 md:py-6 lg:mt-10 lg:grid-cols-5 lg:px-20 lg:py-10">
                {/* First Column */}

                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-semibold lg:text-[15px]">E-commerce Support</h1>
                    <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                        <ul>Phonestore</ul>
                        <ul>Malang 123</ul>
                        <ul>Pendem</ul>
                        <ul>Jawa Timur</ul>
                        <ul>Phone: +31 20 123 4567</ul>
                        <ul>Email: support@phonestore.com</ul>
                    </li>
                </div>

                {/* Second Column */}
                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-semibold lg:text-[15px]">Working hours</h1>
                    <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                        <ul>Monday to Friday: 09:00 - 18:00</ul>
                        <ul>Saturday: 10:00 - 16:00</ul>
                        <ul>Sunday: Closed</ul>
                    </li>
                </div>

                {/* Third Column */}
                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-semibold lg:text-[15px]">About us</h1>
                    <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                        <ul>Stores</ul>
                        <ul>Corporate website</ul>
                        <ul>Exclusive Offers</ul>
                        <ul>Career</ul>
                    </li>
                </div>

                {/* Fourth Column */}
                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-semibold lg:text-[15px]">Help & Support</h1>
                    <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                        <ul>Help center</ul>
                        <ul>Payments</ul>
                        <ul>Product returns</ul>
                        <ul>FAQ</ul>
                    </li>
                </div>

                {/* Fifth Column (will wrap to the next row on larger screens) */}
                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-semibold lg:text-[15px]">Sign up for exclusive offers and the latest news!</h1>
                    <div className="border-1 flex w-full max-w-sm items-center rounded-md border-white px-2 py-1 align-middle">
                        <MailIcon className="mr-2 size-4" />
                        <input className="border-none p-2 text-[10px] text-white outline-none" placeholder="Your Email..."></input>
                    </div>
                    <li className="flex list-none gap-1 text-[10px] font-light">
                        <div className="border-1 h-fit w-fit rounded-md border-white bg-black p-1.5">
                            <FacebookIcon className="size-4" />
                        </div>
                        <div className="border-1 h-fit w-fit rounded-md border-white bg-black p-1.5">
                            <InstagramIcon className="size-4" />
                        </div>
                        <div className="border-1 h-fit w-fit rounded-md border-white bg-black p-1.5">
                            <TwitterIcon className="size-4" />
                        </div>
                    </li>
                </div>
            </div>
            <div className="text-primary grid grid-cols-1 items-center justify-between px-4 py-3 align-middle text-[12px] md:grid-cols-2 lg:grid-cols-2 lg:px-20">
                <p className="font-semibold">&copy; 2025 PHONESTORE. All Rights Reserved.</p>
                <div className="mt-3 justify-end md:ml-auto md:flex md:gap-6 lg:ml-auto lg:gap-10">
                    <p>Privacy policy</p>
                    <p>Cookie settings</p>
                    <p>Terms and conditions</p>
                </div>
            </div>
        </div>
    );
}
