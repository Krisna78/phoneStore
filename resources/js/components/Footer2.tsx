import { FacebookIcon, InstagramIcon, MailIcon, TwitterIcon } from 'lucide-react';

export default function Footer2() {
    return (
        <div className="mt-5 grid h-full w-full grid-cols-1 gap-2 bg-primary px-5 py-4 text-white md:grid-cols-2 md:py-6 lg:mt-10 lg:grid-cols-5 lg:px-20 lg:py-10">
            {/* First Column */}
            <div className="">
                <div className="flex flex-col gap-1.5 text-left align-top">
                    <h1 className="text-[12px] font-medium lg:text-[15px]">E-commerce Support</h1>
                    <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                        <ul>Phonestore</ul>
                        <ul>Malang 123</ul>
                        <ul>Pendem</ul>
                        <ul>Jawa Timur</ul>
                        <ul>Phone: +31 20 123 4567</ul>
                        <ul>Email: support@phonestore.com</ul>
                    </li>
                </div>
            </div>

            {/* Second Column */}
            <div className="flex flex-col gap-1.5 text-left align-top">
                <h1 className="text-[12px] font-medium lg:text-[15px]">Working hours</h1>
                <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                    <ul>Monday to Friday: 09:00 - 18:00</ul>
                    <ul>Saturday: 10:00 - 16:00</ul>
                    <ul>Sunday: Closed</ul>
                </li>
            </div>

            {/* Third Column */}
            <div className="flex flex-col gap-1.5 text-left align-top">
                <h1 className="text-[12px] font-medium lg:text-[15px]">About us</h1>
                <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                    <ul>Stores</ul>
                    <ul>Corporate website</ul>
                    <ul>Exclusive Offers</ul>
                    <ul>Career</ul>
                </li>
            </div>

            {/* Fourth Column */}
            <div className="flex flex-col gap-1.5 text-left align-top">
                <h1 className="text-[12px] font-medium lg:text-[15px]">Help & Support</h1>
                <li className="list-none text-[10px] font-light lg:text-[12px] lg:font-normal">
                    <ul>Help center</ul>
                    <ul>Payments</ul>
                    <ul>Product returns</ul>
                    <ul>FAQ</ul>
                </li>
            </div>

            {/* Fifth Column (will wrap to the next row on larger screens) */}
            <div className="flex flex-col gap-1.5 text-left align-top">
                <h1 className="text-[12px] font-medium lg:text-[15px]">Sign up for exclusive offers and the latest news!</h1>
                <div className="flex w-full max-w-sm items-center rounded-md border-1 border-white px-2 py-1 align-middle">
                    <MailIcon className="mr-2 size-4" />
                    <input className="border-none p-2 text-[10px] text-white outline-none" placeholder="Your Email..."></input>
                </div>
                <li className="flex list-none gap-1 text-[10px] font-light">
                    <div className="h-fit w-fit rounded-md border-1 border-white bg-black p-1.5">
                        <FacebookIcon className="size-4" />
                    </div>
                    <div className="h-fit w-fit rounded-md border-1 border-white bg-black p-1.5">
                        <InstagramIcon className="size-4" />
                    </div>
                    <div className="h-fit w-fit rounded-md border-1 border-white bg-black p-1.5">
                        <TwitterIcon className="size-4" />
                    </div>
                </li>
            </div>
        </div>
    );
}
